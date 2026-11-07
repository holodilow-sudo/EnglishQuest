"""Build a locally signed APK with the official SDK tools; --debug enables QA."""
from pathlib import Path
from datetime import datetime
import hashlib
import json
import shutil
import subprocess
import zipfile
import ctypes
import struct
import argparse
import os
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / '.toolchain'
BUILD = ROOT / 'build' / datetime.now().strftime('%Y%m%d-%H%M%S')
SOURCE = ROOT / 'android' / 'src' / 'main'
DIST = ROOT / 'dist'
def ascii_build_path(path):
    # Some Windows environments cannot enumerate intermediate parent folders for
    # GetShortPathNameW. An existing short ancestor plus ASCII child names still
    # identifies the same authorized project. Verify identity before using it.
    kernel = ctypes.WinDLL('kernel32', use_last_error=True)
    short_name = kernel.GetShortPathNameW
    short_name.argtypes = [ctypes.c_wchar_p, ctypes.c_wchar_p, ctypes.c_uint]
    short_name.restype = ctypes.c_uint
    for ancestor in (path, *path.parents):
        buffer = ctypes.create_unicode_buffer(32768)
        if short_name(str(ancestor), buffer, len(buffer)):
            candidate = Path(buffer.value) / path.relative_to(ancestor)
            if str(candidate).isascii() and candidate.samefile(path):
                return candidate
    raise RuntimeError('Cannot get an ASCII path for the existing project')

EXEC_ROOT = ascii_build_path(ROOT)

def find(base, pattern):
    matches = list(base.rglob(pattern))
    if len(matches) != 1:
        raise RuntimeError(f'Expected one {pattern} below {base}; found {len(matches)}')
    return matches[0]

def run(label, args, use_ascii=False):
    print(label, flush=True)
    # aapt2 on Windows does not reliably accept Cyrillic paths. Keep source files
    # in place and pass the existing Windows short path to the SDK binaries.
    argv = [str(EXEC_ROOT/a.relative_to(ROOT)) if use_ascii and isinstance(a,Path) and a.is_relative_to(ROOT) else str(a) for a in args]
    subprocess.run(argv, check=True, cwd=EXEC_ROOT if use_ascii else ROOT)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--debug', action='store_true', help='Enable WebView diagnostics in a separate test APK')
    parser.add_argument('--allow-system-city-speech', action='store_true', help='Allow unbundled city dialogue to use an installed offline Android English voice; record the limitation in build metadata')
    parser.add_argument('--allow-system-travel-speech', action='store_true', help='Allow travel phrases to use the installed Android English voice; record missing bundled audio explicitly')
    args = parser.parse_args()
    if not os.environ.get('ENGLISHQUEST_KEYSTORE') or not os.environ.get('ENGLISHQUEST_STORE_PASSWORD'):
        raise RuntimeError('Set ENGLISHQUEST_KEYSTORE and ENGLISHQUEST_STORE_PASSWORD privately before building. Never commit the signing key or password.')
    if not Path(os.environ['ENGLISHQUEST_KEYSTORE']).expanduser().is_file():
        raise RuntimeError('Configured signing key is missing. Refusing to generate a replacement key.')
    if not os.environ.get('ENGLISHQUEST_KEY_PASSWORD'):
        os.environ['ENGLISHQUEST_KEY_PASSWORD'] = os.environ['ENGLISHQUEST_STORE_PASSWORD']
    travel = json.loads(subprocess.check_output(['node', '-e',
        "const fs=require('fs'),vm=require('vm'),ctx={window:{}};vm.runInNewContext(fs.readFileSync('app/travel-content.js','utf8'),ctx);process.stdout.write(JSON.stringify(ctx.window.TravelContent));"],
        cwd=ROOT, encoding='utf-8'))
    speech_root = SOURCE/'assets'/'speech'
    audio_manifest = speech_root/'index.json'
    audio_index = json.loads(audio_manifest.read_text(encoding='utf-8'))
    audio_files = set(audio_index['entries'].values())
    missing_audio = [name for name in audio_files if not (speech_root/name).is_file()]
    if missing_audio:
        raise RuntimeError(f'Missing {len(missing_audio)} audio assets: {missing_audio[:3]}')
    city_speech = ROOT/'app'/'city-speech.json'
    missing_city = []
    if city_speech.exists():
        prompts = json.loads(city_speech.read_text(encoding='utf-8'))['phrases']
        missing_city = [text for text in prompts if ' '.join(text.lower().split()) not in audio_index['entries']]
        if missing_city and not args.allow_system_city_speech:
            raise RuntimeError(f'City speech preparation incomplete: {len(missing_city)} prompts. Prepare with --include-city, generate and encode before building.')
        if missing_city:
            print(f'City dialogue: {len(missing_city)} phrases require an installed offline Android English voice. Bundled curriculum audio is unchanged.', flush=True)
    travel_phrases = list(dict.fromkeys(p['en'] for topic in travel['topics'] for p in topic['phrases']))
    missing_travel = [phrase for phrase in travel_phrases if ' '.join(phrase.lower().split()) not in audio_index['entries']]
    if missing_travel and not args.allow_system_travel_speech:
        raise RuntimeError(f'Travel audio is not fully bundled: {len(missing_travel)} phrases. Prepare audio or explicitly use --allow-system-travel-speech.')
    if list(speech_root.glob('*.wav')):
        raise RuntimeError('Uncompressed source WAV files must stay outside APK assets')
    jdk = find(TOOLS / 'jdk', 'javac.exe').parent
    buildtools = find(TOOLS / 'sdk-build', 'aapt2.exe').parent
    platform = find(TOOLS / 'sdk-platform', 'android.jar')
    for part in ['generated', 'classes', 'dex']:
        (BUILD / part).mkdir(parents=True, exist_ok=True)
    DIST.mkdir(exist_ok=True)
    resources = BUILD / 'compiled-resources'
    resources.mkdir()
    base_apk = BUILD / 'base.apk'
    linked = BUILD / 'linked'
    linked.mkdir()
    manifest = ET.parse(SOURCE/'AndroidManifest.xml')
    android_ns = '{http://schemas.android.com/apk/res/android}'
    ET.register_namespace('android', 'http://schemas.android.com/apk/res/android')
    manifest.getroot().find('application').set(android_ns+'debuggable', 'true' if args.debug else 'false')
    version = manifest.getroot().get(android_ns+'versionName')
    build_manifest = BUILD/'AndroidManifest.xml'
    manifest.write(build_manifest, encoding='utf-8', xml_declaration=True)
    for resource_dir in (SOURCE/'res').iterdir():
        if resource_dir.is_dir():
            (linked/'res'/resource_dir.name).mkdir(parents=True)
    run('1/7 Compile Android resources', [buildtools/'aapt2.exe','compile','--dir',SOURCE/'res','-o',resources], use_ascii=True)
    # Work around the Windows SDK ZIP writer crash by using documented directory
    # outputs. Resource binaries are still produced by Google's aapt2.
    run('2/7 Link Android resources', [buildtools/'aapt2.exe','link',*sorted(resources.glob('*.flat')),'--output-to-dir','-o',linked,'--manifest',build_manifest,'-I',platform,'--java',BUILD/'generated'], use_ascii=True)
    shutil.copytree(ROOT/'app',linked/'assets'/'app')
    if (SOURCE/'assets').exists():
        shutil.copytree(SOURCE/'assets',linked/'assets',dirs_exist_ok=True)
    with zipfile.ZipFile(base_apk,'w',compression=zipfile.ZIP_STORED) as archive:
        for file in sorted(linked.rglob('*')):
            if file.is_file(): archive.write(file,file.relative_to(linked).as_posix())
    sources = list((SOURCE/'java').rglob('*.java')) + list((BUILD/'generated').rglob('*.java'))
    if not sources:
        raise RuntimeError('No Java sources')
    # The standard compiler API reports the true task result independently of
    # this host's JDK ZIP close/toRealPath failure. Source errors still fail.
    # Google's lambda stubs supply javac's bootstrap signatures; D8 desugars the
    # emitted Java 8 lambda bytecode. Keep them before Android's empty stub.
    boot_classpath = str(buildtools/'core-lambda-stubs.jar') + os.pathsep + str(platform)
    run('3/7 Compile Java wrapper', [jdk/'java.exe',ROOT/'android/tools/CompileAndroid.java',boot_classpath,BUILD/'classes',*sources])
    classes_jar = BUILD/'classes.jar'
    with zipfile.ZipFile(classes_jar,'w',compression=zipfile.ZIP_DEFLATED) as archive:
        for classfile in (BUILD/'classes').rglob('*.class'):
            archive.write(classfile,classfile.relative_to(BUILD/'classes').as_posix())
    run('4/7 Convert bytecode for Android', [jdk/'java.exe','-cp',buildtools/'lib'/'d8.jar','com.android.tools.r8.D8','--lib',platform,'--min-api','26','--output',BUILD/'dex',classes_jar])
    aligned = BUILD/'aligned.apk'
    print('5/7 Package and align APK',flush=True)
    entries=[(file.relative_to(linked).as_posix(),file) for file in sorted(linked.rglob('*')) if file.is_file()]
    entries += [(dex.name,dex) for dex in (BUILD/'dex').glob('*.dex')]
    with zipfile.ZipFile(aligned,'w',compression=zipfile.ZIP_STORED) as archive:
        for name,file in entries:
            info=zipfile.ZipInfo(name)
            info.compress_type=zipfile.ZIP_STORED
            offset=archive.fp.tell()+30+len(name.encode('utf-8'))
            pad=(-offset)%4
            if pad: info.extra=struct.pack('<HH',0xFFFF,pad)+bytes(pad)
            archive.writestr(info,file.read_bytes())
    run('Verify unsigned alignment', [buildtools/'zipalign.exe','-c','4',aligned])
    key = Path(os.environ['ENGLISHQUEST_KEYSTORE']).expanduser().resolve()
    apk = DIST/('EnglishQuest-'+version+('-test' if args.debug else '')+'.apk')
    signer = [jdk/'java.exe','-jar',buildtools/'lib'/'apksigner.jar']
    run('6/7 Sign local APK', [*signer,'sign','--ks',key,'--ks-key-alias',os.environ.get('ENGLISHQUEST_KEY_ALIAS','englishquesttest'),'--ks-pass','env:ENGLISHQUEST_STORE_PASSWORD','--key-pass','env:ENGLISHQUEST_KEY_PASSWORD','--out',apk,aligned])
    run('7/7 Verify APK signature', [*signer,'verify','--verbose','--print-certs',apk])
    run('Verify alignment', [buildtools/'zipalign.exe','-c','4',apk])
    digest=hashlib.sha256(apk.read_bytes()).hexdigest()
    content_text=(ROOT/'app'/'content.js').read_text(encoding='utf-8')
    content=json.loads(content_text.split('const CONTENT = ',1)[1].strip().rstrip(';'))
    audio_manifest=SOURCE/'assets'/'speech'/'index.json'
    metadata={'apk':apk.name,'version':version,'versionCode':int(manifest.getroot().get(android_ns+'versionCode')),'package':manifest.getroot().get('package'),'bytes':apk.stat().st_size,'sha256':digest,'variant':'local-debug' if args.debug else 'local-release','compileSdk':35,'minSdk':26,'source':content.get('source',{}),'units':len(content['units']),'lessons':len(content['lessons']),'tasks':sum(len(l['tasks']) for l in content['lessons']),'words':len(content['words']),'bundledAudio':audio_manifest.exists(),'build':str(BUILD)}
    metadata.update({'sections':sum(len(u['sections']) for u in content['units']),
                     'dictionaryCards':sum(bool(w.get('dictionary')) for w in content['words']),
                     'thematicTasks':sum(len(l['tasks']) for l in content['lessons'] if not l.get('dictionary')),
                     'audio':{'phrases':len(audio_index['entries']),'files':len(audio_files),
                              'voice':audio_index['voice'],'language':audio_index['language'],
                              'encoding':audio_index.get('encoding'),'offline':not bool(missing_city or missing_travel),
                              'curriculumBundledOffline':False, 'publicSourcePersonalizedAudioRemoved':2,'citySystemVoiceRequired':len(missing_city),
                              'citySystemVoicePhrases':missing_city,
                              'cityFallback':'installed offline English Android TTS' if missing_city else None,
                              'travelSystemVoiceRequired':len(missing_travel),
                              'travelSystemVoicePhrases':missing_travel,
                              'travelFallback':'installed Android English TTS; offline availability depends on the device' if missing_travel else None}})
    metadata['practice'] = {'textbookTasks':metadata['tasks'], 'travelTopics':len(travel['topics']),
        'travelPhrases':sum(len(topic['phrases']) for topic in travel['topics']), 'travelTasks':len(travel['tasks']),
        'totalTasks':metadata['tasks'] + len(travel['tasks']), 'lengths':[10,25,50,100,'all']}
    reminder_source = (SOURCE/'java/ru/arseniy/englishquest/ReminderSchedule.java').read_text(encoding='utf-8')
    metadata['reminders'] = {'weekdays':re.search(r'WEEKDAYS = "([^"]+)"',reminder_source).group(1).split(','),
        'weekends':re.search(r'WEEKENDS = "([^"]+)"',reminder_source).group(1).split(','),
        'timezone':'device-local', 'delivery':'inexact local alarms; notification permission required',
        'restoreOn':['boot','package replacement','time change','timezone change'], 'tapAction':'textbook word review'}
    update_source = SOURCE/'java/ru/arseniy/englishquest/UpdateRelease.java'
    if update_source.exists():
        metadata['updates'] = {
            'repository': 'https://github.com/holodilow-sudo/EnglishQuest',
            'endpoint': re.search(r'API = "([^"]+)"', update_source.read_text(encoding='utf-8')).group(1),
            'check': 'automatically on app foreground; repeated checks within 60 seconds coalesced',
            'channel': 'latest stable GitHub Release',
            'download': 'automatically downloads public APK into app cache; user taps Install',
            'verification': 'GitHub SHA-256, package name, newer versionCode and same APK signing certificate',
            'installation': 'user-confirmed Android package update',
            'uploadsLearningProgress': False}
    (DIST/'build-info.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf-8')
    (DIST/(apk.stem+'-build-info.json')).write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf-8')
    (DIST/(apk.name+'.sha256')).write_text(digest+'  '+apk.name+'\n',encoding='utf-8')
    print(json.dumps(metadata,ensure_ascii=False,indent=2))

if __name__ == '__main__':
    main()
