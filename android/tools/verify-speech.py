"""Decode every packaged phrase and verify duration and non-silent PCM samples."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json
import math
import array
import wave
import subprocess
import shutil
import hashlib
import sys

ROOT = Path(__file__).resolve().parents[2]
SPEECH = ROOT / 'android/src/main/assets/speech'
index = json.loads((SPEECH / 'index.json').read_text(encoding='utf8'))
ffmpeg = shutil.which('ffmpeg')
ffprobe = shutil.which('ffprobe')
out = ROOT/'preview/android/tts'
out.mkdir(parents=True,exist_ok=True)
cached = {}
if '--incremental' in sys.argv and (out/'audio-validation.json').exists():
    previous = json.loads((out/'audio-validation.json').read_text(encoding='utf8'))
    if not previous.get('failures'):
        cached = {row['file']: row for row in previous.get('files',[]) if row.get('sha256')}

def verify(filename):
    try:
        source = SPEECH / filename
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        if filename in cached and cached[filename]['sha256'] == digest:
            return ({**cached[filename], 'reusedDecodedValidation':True}, None)
        if source.suffix == '.wav':
            with wave.open(str(source), 'rb') as audio:
                frames = audio.readframes(audio.getnframes())
                assert audio.getsampwidth() == 2 and audio.getnchannels() == 1, 'Expected mono 16-bit PCM'
                sample_rate = audio.getframerate()
                codec = 'pcm_s16le'
        else:
            assert source.suffix == '.m4a' and ffmpeg and ffprobe, 'AAC verification requires ffmpeg and ffprobe'
            result = subprocess.run([ffprobe, '-v', 'error', '-select_streams', 'a:0',
                                     '-show_entries', 'stream=codec_name,profile,sample_rate,channels,duration', '-of', 'json', str(source)],
                                    check=True, capture_output=True, text=True, timeout=20,
                                    creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
            stream = json.loads(result.stdout)['streams'][0]
            assert stream['codec_name'] == 'aac' and stream['profile'] == 'LC' and stream['channels'] == 1, 'Expected AAC-LC mono'
            assert float(stream['duration']) > 0.1, 'Empty AAC duration'
            sample_rate = int(stream['sample_rate'])
            decoded = subprocess.run([ffmpeg, '-nostdin', '-v', 'error', '-i', str(source),
                                      '-f', 's16le', '-ac', '1', '-ar', str(sample_rate), '-'],
                                     check=True, capture_output=True, timeout=20,
                                     creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
            frames = decoded.stdout
            codec = 'aac_lc'
        samples = array.array('h', frames)
        duration = len(samples) / sample_rate
        rms = math.sqrt(sum(x*x for x in samples) / max(1, len(samples)))
        peak = max(map(abs, samples), default=0)
        assert duration > 0.1 and rms > 20 and peak > 500, 'Silent or empty audio'
        return ({'file':filename,'seconds':round(duration,3),'rms':round(rms,1),'peak':peak,'sampleRate':sample_rate,'codec':codec,'sha256':digest,'reusedDecodedValidation':False}, None)
    except Exception as error:
        return (None, {'file':filename,'error':str(error)})

with ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(verify, index['entries'].values()))
rows = [row for row, error in results if row]
failures = [error for row, error in results if error]
result = {'entries':len(index['entries']),'verified':len(rows),'voice':index['voice'],'language':index['language'],
          'totalSeconds':round(sum(row['seconds'] for row in rows),1),'bytes':sum((SPEECH/row['file']).stat().st_size for row in rows),
          'decodedNow':sum(not row.get('reusedDecodedValidation') for row in rows),
          'reusedDecodedValidation':sum(bool(row.get('reusedDecodedValidation')) for row in rows),
          'failures':failures,'files':rows}
(out/'audio-validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({key:value for key,value in result.items() if key != 'files'},ensure_ascii=False))
if failures: raise SystemExit(1)
