"""Encode local PCM masters as offline Android-compatible AAC-LC, no network."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[2]
SPEECH = ROOT / 'android/src/main/assets/speech'
SOURCE = ROOT / '.local/audio-source'
ffmpeg = shutil.which('ffmpeg')
if not ffmpeg:
    raise SystemExit('ffmpeg is required for AAC encoding; no dependency is downloaded automatically.')
phrases = json.loads((SPEECH / 'phrases.json').read_text(encoding='utf8'))

def encode(phrase):
    original = SOURCE / phrase['sourceFile']
    destination = SPEECH / phrase['file']
    if not original.is_file() or original.stat().st_size < 1000:
        raise ValueError('Missing source WAV: ' + phrase['sourceFile'])
    if destination.is_file() and destination.stat().st_size > 1000 and destination.stat().st_mtime >= original.stat().st_mtime:
        return False
    subprocess.run([ffmpeg, '-nostdin', '-hide_banner', '-loglevel', 'error', '-y',
                    '-i', str(original), '-map_metadata', '-1', '-ac', '1', '-ar', '22050',
                    '-c:a', 'aac', '-profile:a', 'aac_low', '-b:a', '64k', '-movflags', '+faststart', str(destination)],
                   check=True, capture_output=True, timeout=30,
                   creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    if destination.stat().st_size < 1000:
        raise ValueError('Empty AAC output: ' + phrase['file'])
    return True

with ThreadPoolExecutor(max_workers=8) as pool:
    generated = sum(pool.map(encode, phrases))
print(json.dumps({'entries': len(phrases), 'encoded': generated, 'reused': len(phrases)-generated,
                  'encoding': 'AAC-LC 64kbps mono', 'bytes': sum((SPEECH/p['file']).stat().st_size for p in phrases)}))
