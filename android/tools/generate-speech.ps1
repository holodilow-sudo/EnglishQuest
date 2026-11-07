param([string]$SpeechDirectory = (Join-Path $PSScriptRoot '../src/main/assets/speech'), [string]$SourceDirectory = (Join-Path $PSScriptRoot '../../.local/audio-source'))
$ErrorActionPreference = 'Stop'
$SpeechDirectory = (Resolve-Path -LiteralPath $SpeechDirectory).Path
$null = New-Item -ItemType Directory -Force -Path $SourceDirectory
$SourceDirectory = (Resolve-Path -LiteralPath $SourceDirectory).Path
$phraseList = Get-Content -LiteralPath (Join-Path $SpeechDirectory 'phrases.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$speechVoice = New-Object -ComObject SAPI.SpVoice
$speechToken = New-Object -ComObject SAPI.SpObjectToken
# Direct token selection works on this host even when SAPI voice enumeration fails.
$speechToken.SetId('HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_MS_EN-US_ZIRA_11.0')
$speechVoice.Voice = $speechToken
$speechVoice.Rate = -1
$speechVoice.Volume = 100
$generated = 0
$existing = 0
foreach ($phrase in $phraseList) {
    $sourceName = if ($phrase.sourceFile) { $phrase.sourceFile } else { $phrase.file }
    $destination = Join-Path $SourceDirectory $sourceName
    if ((Test-Path -LiteralPath $destination) -and (Get-Item -LiteralPath $destination).Length -gt 1000) { $existing++; continue }
    $speechStream = New-Object -ComObject SAPI.SpFileStream
    try {
        # SAFT22kHz16BitMono, PCM WAV supported by Android MediaPlayer offline.
        $speechStream.Format.Type = 22
        $speechStream.Open($destination, 3, $false)
        $speechVoice.AudioOutputStream = $speechStream
        if ($phrase.sapiXml) {
            # SVSFIsXML = 8. This Zira engine accepts W3C SSML with IPA phonemes.
            $null = $speechVoice.Speak([string]$phrase.sapiXml, 8)
        } else {
            $null = $speechVoice.Speak([string]$phrase.text, 16)
        }
    } finally { $speechStream.Close() }
    if ((Get-Item -LiteralPath $destination).Length -lt 1000) { throw "Empty speech output: $($phrase.file)" }
    $generated++
    if (($generated % 25) -eq 0) { Write-Output "Generated $generated phrases ($existing already present)" }
}
Write-Output "Speech complete: $generated generated, $existing already present; $($speechToken.GetDescription())"
