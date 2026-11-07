package ru.arseniy.englishquest;

import android.app.Activity;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.PlaybackParams;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;

import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Set;

/** Plays packaged speech first, then an installed offline English system voice. */
final class SpeechController {
    interface Feedback { void message(String text); void log(String text); }
    private final Activity activity;
    private final Feedback feedback;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final AudioManager audioManager;
    private final AudioAttributes audioAttributes = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_MEDIA).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build();
    private JSONObject entries = new JSONObject();
    private TextToSpeech tts;
    private MediaPlayer player;
    private volatile boolean initialized;
    private volatile boolean systemAvailable;
    private volatile boolean destroyed;
    private volatile String systemEngine = "";
    private volatile String systemVoice = "";
    private volatile String systemLanguage = "";
    private volatile String lastError = "";
    private volatile String lastSource = "none";
    private volatile String playback = "idle";
    private volatile String lastEvent = "idle";
    private volatile int completedCount;
    private int requestNumber;
    private String activeId = "";
    private String activeText = "";
    private boolean activeSlow;
    private boolean attemptedSystem;
    private boolean attemptedBundled;

    SpeechController(Activity activity, Feedback feedback) {
        this.activity = activity;
        this.feedback = feedback;
        audioManager = (AudioManager) activity.getSystemService(Activity.AUDIO_SERVICE);
        loadIndex();
        initSystemVoice();
    }

    private void loadIndex() {
        try (InputStream in = activity.getAssets().open("speech/index.json")) {
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int count;
            while ((count = in.read(buffer)) != -1) bytes.write(buffer, 0, count);
            JSONObject root = new JSONObject(new String(bytes.toByteArray(), StandardCharsets.UTF_8));
            entries = root.getJSONObject("entries");
            feedback.log("Speech bundled entries=" + entries.length());
        } catch (Exception error) {
            entries = new JSONObject();
            feedback.log("Speech bundled index unavailable");
        }
    }

    private void initSystemVoice() {
        if (destroyed) return;
        initialized = false;
        tts = new TextToSpeech(activity, status -> {
            if (destroyed || tts == null) return;
            initialized = true;
            if (status != TextToSpeech.SUCCESS) {
                systemAvailable = false;
                feedback.log("TTS init status=" + status + " offlineEnglishAvailable=false");
                return;
            }
            systemEngine = tts.getDefaultEngine();
            Set<Voice> voices = tts.getVoices();
            Voice preferred = null;
            int best = -1;
            if (voices != null) for (Voice voice : voices) {
                if (!"en".equals(voice.getLocale().getLanguage()) || voice.isNetworkConnectionRequired()) continue;
                if (voice.getFeatures() != null && voice.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)) continue;
                int score = ("GB".equals(voice.getLocale().getCountry()) ? 10000 : 0) + voice.getQuality();
                if (score > best) { preferred = voice; best = score; }
            }
            systemAvailable = preferred != null && tts.setVoice(preferred) == TextToSpeech.SUCCESS;
            if (systemAvailable) {
                systemVoice = preferred.getName();
                systemLanguage = preferred.getLocale().toLanguageTag();
            }
            tts.setAudioAttributes(audioAttributes);
            tts.setPitch(1.0f);
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String id) { handler.post(() -> {
                    if (activeId.equals(id)) { playback = "playing"; lastEvent = "tts_start"; feedback.log("TTS onStart"); }
                }); }
                @Override public void onDone(String id) { handler.post(() -> {
                    if (activeId.equals(id)) complete("tts_done");
                }); }
                @Override public void onError(String id) { handler.post(() -> systemError(id)); }
                @Override public void onError(String id, int errorCode) { handler.post(() -> systemError(id)); }
            });
            feedback.log("TTS init status=" + status + " offlineEnglishAvailable=" + systemAvailable);
        });
    }

    String status() {
        JSONObject status = new JSONObject();
        boolean bundled = entries.length() > 0;
        try {
            status.put("ready", bundled || initialized);
            status.put("available", bundled || systemAvailable);
            status.put("source", bundled ? "bundled" : systemAvailable ? "system" : "none");
            status.put("engine", bundled ? "packaged-speech" : systemEngine);
            status.put("voice", bundled ? "Microsoft Zira" : systemVoice);
            status.put("language", bundled ? "en-US" : systemLanguage);
            status.put("bundledCount", entries.length());
            status.put("systemAvailable", systemAvailable);
            status.put("systemVoice", systemVoice);
            status.put("lastSource", lastSource);
            status.put("lastError", lastError);
            status.put("playback", playback);
            status.put("lastEvent", lastEvent);
            status.put("completedCount", completedCount);
        } catch (Exception ignored) { }
        return status.toString();
    }

    void speak(String text, boolean slow) {
        if (text == null || text.trim().isEmpty()) return;
        final String clean = text.trim();
        if (clean.length() > 1200) { feedback.message("Для озвучки выбери одно слово или предложение."); return; }
        activity.runOnUiThread(() -> {
            if (destroyed || activity.isFinishing()) return;
            stop();
            activeText = clean;
            activeSlow = slow;
            activeId = "speech-" + (++requestNumber);
            lastError = "";
            attemptedBundled = false;
            attemptedSystem = false;
            if (audioManager != null && audioManager.getStreamVolume(AudioManager.STREAM_MUSIC) == 0) {
                fail("muted", "На устройстве выключен звук мультимедиа. Добавь громкость и нажми ещё раз.");
                return;
            }
            if (hasBundled(clean)) playBundled();
            else if (systemAvailable) playSystem();
            else fail("voice_unavailable", "Для этой фразы пока нет озвучки. Попробуй слово из словаря или установи английский голос в настройках Android.");
        });
    }

    private static String key(String text) { return text.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT); }
    private boolean hasBundled(String text) { return entries.has(key(text)); }

    private void playBundled() {
        attemptedBundled = true;
        final String request = activeId;
        String name = entries.optString(key(activeText), "");
        if (!name.matches("[a-z0-9_-]+\\.(wav|m4a)")) { bundledError(request); return; }
        releasePlayer();
        player = new MediaPlayer();
        final MediaPlayer current = player;
        try (AssetFileDescriptor file = activity.getAssets().openFd("speech/" + name)) {
            current.setAudioAttributes(audioAttributes);
            current.setDataSource(file.getFileDescriptor(), file.getStartOffset(), file.getLength());
            current.setOnPreparedListener(media -> {
                if (!request.equals(activeId) || destroyed || player != current) return;
                try {
                    if (activeSlow) current.setPlaybackParams(new PlaybackParams().setSpeed(0.75f).setPitch(1.0f));
                    current.start();
                    playback = "playing";
                    lastEvent = "bundled_start";
                    feedback.log("Speech bundled onStart slow=" + activeSlow);
                } catch (Exception error) { bundledError(request); }
            });
            current.setOnCompletionListener(media -> {
                if (request.equals(activeId)) { releasePlayer(); complete("bundled_done"); }
            });
            current.setOnErrorListener((media, what, extra) -> { bundledError(request); return true; });
            lastSource = "bundled";
            playback = "preparing";
            current.prepareAsync();
            watchdog(request);
        } catch (Exception error) { bundledError(request); }
    }

    private void playSystem() {
        if (tts == null || !systemAvailable) { fail("voice_unavailable", "Английская озвучка недоступна. Нажми ещё раз или выбери другую карточку."); return; }
        attemptedSystem = true;
        lastSource = "system";
        playback = "preparing";
        tts.setSpeechRate(activeSlow ? 0.65f : 0.84f);
        if (tts.speak(activeText, TextToSpeech.QUEUE_FLUSH, null, activeId) == TextToSpeech.ERROR) systemError(activeId);
        else watchdog(activeId);
    }

    private void systemError(String id) {
        if (!activeId.equals(id) || destroyed) return;
        feedback.log("TTS onError");
        if (!attemptedBundled && hasBundled(activeText)) playBundled();
        else fail("system_error", "Не получилось произнести фразу. Нажми на динамик ещё раз.");
    }

    private void bundledError(String id) {
        if (!activeId.equals(id) || destroyed) return;
        releasePlayer();
        feedback.log("Speech bundled onError");
        if (!attemptedSystem && systemAvailable) playSystem();
        else fail("playback_error", "Не получилось включить озвучку. Нажми на динамик ещё раз.");
    }

    private void watchdog(String id) {
        handler.postDelayed(() -> {
            if (!activeId.equals(id) || destroyed) return;
            if ("preparing".equals(playback)) {
                if ("bundled".equals(lastSource)) bundledError(id); else systemError(id);
            }
        }, 7000);
        handler.postDelayed(() -> {
            if (activeId.equals(id) && ("playing".equals(playback) || "preparing".equals(playback))) {
                stop();
                fail("playback_timeout", "Озвучка прервалась. Нажми на динамик ещё раз.");
            }
        }, 60000);
    }

    private void complete(String event) {
        playback = "idle";
        lastEvent = event;
        lastError = "";
        completedCount++;
        feedback.log("Speech onDone source=" + lastSource + " completed=" + completedCount);
    }

    private void fail(String code, String message) {
        lastError = code;
        lastEvent = "error";
        playback = "idle";
        feedback.log("Speech error=" + code);
        feedback.message(message);
    }

    private void releasePlayer() {
        if (player != null) {
            player.setOnCompletionListener(null);
            player.setOnErrorListener(null);
            player.setOnPreparedListener(null);
            player.release();
            player = null;
        }
    }

    void stop() {
        activeId = "";
        if (tts != null) tts.stop();
        releasePlayer();
        playback = "idle";
    }

    void onResume() {
        if (initialized && !systemAvailable && entries.length() == 0 && !destroyed) {
            if (tts != null) tts.shutdown();
            initSystemVoice();
        }
    }

    void destroy() {
        destroyed = true;
        stop();
        handler.removeCallbacksAndMessages(null);
        if (tts != null) { tts.shutdown(); tts = null; }
    }
}
