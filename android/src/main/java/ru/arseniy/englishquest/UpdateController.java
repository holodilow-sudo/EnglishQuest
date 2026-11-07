package ru.arseniy.englishquest;

import android.app.Activity;
import android.os.SystemClock;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ssl.HttpsURLConnection;
import org.json.JSONObject;

/** Foreground metadata check. No user data, remote WebView content, or silent installs. */
final class UpdateController {
    interface Listener { void changed(String json); }
    private final Activity activity;
    private final Listener listener;
    private final String installed;
    private final UpdateInstaller installer;
    private final java.util.Set<String> attempted = new java.util.HashSet<>();
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private volatile HttpsURLConnection connection;
    private volatile boolean closed;
    private volatile String status;
    // All fields below are used only on the UI thread.
    private boolean checking;
    private long lastAttempt, retryAt;
    private UpdateRelease available;

    UpdateController(Activity activity, Listener listener) {
        this.activity = activity; this.listener = listener;
        try { installed = activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0).versionName; }
        catch (Exception error) { throw new IllegalStateException(error); }
        installer = new UpdateInstaller(activity, installed, value -> {
            try { value.put("installed", installed).put("native", true); status=value.toString(); listener.changed(status); }
            catch (Exception ignored) { }
        });
        status = json("idle", false, "");
    }
    String status() { return status; }
    private String json(String state, boolean manual, String message) {
        try {
            JSONObject value = new JSONObject().put("state", state).put("native", true)
                    .put("installed", installed).put("manual", manual).put("message", message).put("inApp", true);
            if (available != null) value.put("version", available.version).put("bytes", available.bytes);
            return value.toString();
        } catch (Exception impossible) { return "{\"state\":\"error\"}"; }
    }
    private void emit(String state, boolean manual, String message) {
        status = json(state, manual, message); listener.changed(status);
    }
    void check(boolean manual) {
        if (closed || checking) return;
        if (installer.restore(() -> check(manual))) return;
        if (installer.busy()) return;
        if (installer.ready()) { installer.resume(); return; }
        long now = SystemClock.elapsedRealtime();
        if (now < retryAt) {
            if (manual) emit(available != null ? "available" : "error", true, "GitHub временно ограничил проверки. Попробуй позже.");
            return;
        }
        if (lastAttempt != 0 && now - lastAttempt < (manual ? 15000 : 60000)) {
            if (manual) emit(available != null ? "available" : "recent", true, "Проверка уже выполнена. Повтори через минуту.");
            return;
        }
        lastAttempt = now; checking = true; emit("checking", manual, "");
        worker.execute(() -> {
            String result = "error", message = "Не удалось проверить обновления. Проверь интернет и попробуй ещё раз.";
            UpdateRelease candidate = null;
            boolean limited = false;
            HttpsURLConnection request = null;
            try {
                request = (HttpsURLConnection) new URL(UpdateRelease.API).openConnection();
                connection = request;
                request.setConnectTimeout(8000); request.setReadTimeout(8000);
                request.setInstanceFollowRedirects(false);
                request.setRequestProperty("Accept", "application/vnd.github+json");
                request.setRequestProperty("User-Agent", "EnglishQuest-Android");
                request.setRequestProperty("X-GitHub-Api-Version", "2022-11-28");
                int code = request.getResponseCode();
                if (code == 404) { result = "unpublished"; message = "Обновления ещё не опубликованы в GitHub."; }
                else if (code == 403 || code == 429) { limited = true; message = "GitHub временно ограничил проверки. Попробуй позже."; }
                else if (code == 200) {
                    long deadline = SystemClock.elapsedRealtime() + 20000;
                    try (InputStream input = request.getInputStream(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                        byte[] buffer = new byte[8192]; int count;
                        while ((count = input.read(buffer)) != -1) {
                            if (closed || output.size() + count > 1024 * 1024 || SystemClock.elapsedRealtime() > deadline)
                                throw new IllegalStateException("Response limit");
                            output.write(buffer, 0, count);
                        }
                        candidate = UpdateRelease.parse(new String(output.toByteArray(), StandardCharsets.UTF_8), installed);
                        result = candidate == null ? "current" : "available"; message = "";
                    }
                }
            } catch (Exception error) { /* Offline is normal: only manual checks surface errors. */ }
            finally { if (request != null) request.disconnect(); connection = null; }
            final String outcome = result, detail = message;
            final UpdateRelease release = candidate;
            final boolean rateLimited = limited;
            activity.runOnUiThread(() -> {
                if (closed) return;
                checking = false;
                if (rateLimited) retryAt = SystemClock.elapsedRealtime() + 15 * 60 * 1000;
                // Retain a previously verified candidate through a transient connection failure.
                if ("available".equals(outcome) || "current".equals(outcome) || "unpublished".equals(outcome)) available = release;
                emit(available != null ? "available" : outcome, manual, detail);
                if (release != null && attempted.add(release.version)) installer.start(release);
            });
        });
    }
    void download() {
        if (!closed && !checking) { if(available!=null)attempted.add(available.version); installer.retry(available); }
    }
    void install() { if (!closed) installer.install(); }
    void installSettings() { if (!closed) installer.settings(); }
    void cancelDownload() { if (!closed) installer.cancel(); }
    void destroy() {
        closed = true; worker.shutdownNow();
        installer.destroy();
        HttpsURLConnection request = connection;
        if (request != null) request.disconnect();
    }
}
