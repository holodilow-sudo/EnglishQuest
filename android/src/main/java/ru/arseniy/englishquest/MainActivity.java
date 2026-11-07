package ru.arseniy.englishquest;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.provider.Settings;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.window.OnBackInvokedDispatcher;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Locale;

/** Offline shell with packaged content and a narrowly scoped speech bridge. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/assets/app/index.html";
    private static final int PAPER = Color.rgb(246, 247, 251);
    private WebView webView;
    private volatile SpeechController speech;
    private ResultShareController resultShare;
    private UpdateController updates;
    private boolean destroyed;
    private AlertDialog nativeDialog;
    private static final int NOTIFICATION_PERMISSION_REQUEST = 7312;
    private boolean reminderReviewPending, pageReady, notificationPermissionPending;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        reminderReviewPending = ReminderController.ACTION_REVIEW.equals(getIntent().getAction());
        if (reminderReviewPending) getIntent().setAction(Intent.ACTION_MAIN);
        if (savedInstanceState != null) reminderReviewPending |= savedInstanceState.getBoolean("reminderReviewPending", false);
        ReminderController.createChannel(this);
        FrameLayout container = new FrameLayout(this);
        container.setBackgroundColor(PAPER);
        setupInsets(container);
        setContentView(container);

        webView = new WebView(this);
        // The prior BlueStacks image had a broken GL_EXT_blend_func_extended shader path.
        // Physical phones use GPU compositing; limit its software workaround to emulator builds.
        if (isEmulatorBuild()) webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        webView.setBackgroundColor(PAPER);
        container.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setBlockNetworkLoads(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setTextZoom(100);
        WebView.setWebContentsDebuggingEnabled(
                (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0);
        webView.addJavascriptInterface(new SpeechBridge(), "AndroidSpeech");
        resultShare = new ResultShareController(this, new ResultShareController.Feedback() {
            @Override public boolean trusted() { return isTrustedDocument(); }
            @Override public void result(String requestId, String status) {
                if (isTrustedDocument()) webView.evaluateJavascript("window.CityShare&&CityShare.nativeResult("
                        + org.json.JSONObject.quote(requestId) + "," + org.json.JSONObject.quote(status) + ");", null);
            }
        });
        webView.addJavascriptInterface(new ShareBridge(), "AndroidShare");
        webView.addJavascriptInterface(new ReminderBridge(), "AndroidReminders");
        updates = new UpdateController(this, this::updateStatus);
        webView.addJavascriptInterface(new UpdateBridge(), "AndroidUpdates");
        webView.setWebViewClient(new LocalClient());
        webView.setWebChromeClient(new WebChromeClient());
        webView.loadUrl(START_URL);
        initSpeech();

        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
    }

    @SuppressWarnings("deprecation")
    private void setupInsets(FrameLayout container) {
        getWindow().setStatusBarColor(PAPER);
        getWindow().setNavigationBarColor(PAPER);
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            getWindow().getDecorView().setOnApplyWindowInsetsListener((view, insets) -> {
                Insets safe = insets.getInsets(WindowInsets.Type.systemBars()
                        | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                container.setPadding(safe.left, safe.top, safe.right, safe.bottom);
                return insets;
            });
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.setSystemBarsAppearance(
                        WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                                | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS,
                        WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                                | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                    | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        }
    }

    private static boolean isEmulatorBuild() {
        String hardware = Build.HARDWARE.toLowerCase(Locale.ROOT);
        String fingerprint = Build.FINGERPRINT.toLowerCase(Locale.ROOT);
        String model = Build.MODEL.toLowerCase(Locale.ROOT);
        return hardware.contains("goldfish") || hardware.contains("ranchu")
                || hardware.contains("vbox") || hardware.contains("android_x86")
                || hardware.contains("bluestacks") || hardware.startsWith("bst")
                || fingerprint.startsWith("generic/") || fingerprint.startsWith("generic_x86/")
                || model.contains("bluestacks") || model.contains("sdk_gphone");
    }

    private void initSpeech() {
        speech = new SpeechController(this, new SpeechController.Feedback() {
            @Override public void message(String text) { showSpeechMessage(text); }
            @Override public void log(String text) { debugLog(text); }
        });
    }

    public final class SpeechBridge {
        @JavascriptInterface public void speak(String text) { if (speech != null) speech.speak(text, false); }
        @JavascriptInterface public void speakSlow(String text) { if (speech != null) speech.speak(text, true); }
        @JavascriptInterface public void stop() {
            runOnUiThread(() -> {
                if (isTrustedDocument() && speech != null) speech.stop();
            });
        }
        @JavascriptInterface public String getStatus() {
            return speech == null ? "{\"ready\":false,\"available\":false,\"source\":\"none\"}" : speech.status();
        }
    }

    private boolean isTrustedDocument() {
        if (destroyed || isFinishing() || webView == null || webView.getUrl() == null) return false;
        Uri uri = Uri.parse(webView.getUrl());
        return isLocalAsset(uri) && "/assets/app/index.html".equals(uri.getPath()) && uri.getQuery() == null;
    }

    public final class ShareBridge {
        @JavascriptInterface public void shareImage(String dataUrl, String requestId) {
            if (dataUrl == null || dataUrl.length() > (ResultImageProvider.MAX_BYTES * 4 / 3 + 128)
                    || requestId == null || requestId.length() > 70) return;
            runOnUiThread(() -> { if (resultShare != null && isTrustedDocument()) resultShare.share(dataUrl, requestId); });
        }
    }

    public final class ReminderBridge {
        @JavascriptInterface public String getStatus() { return ReminderController.status(MainActivity.this); }
        @JavascriptInterface public void configure(boolean enabled, String weekdays, String weekends) {
            if (weekdays == null || weekends == null || weekdays.length() > 50 || weekends.length() > 50) return;
            runOnUiThread(() -> {
                if (!isTrustedDocument()) return;
                try {
                    ReminderController.configure(MainActivity.this, enabled, weekdays, weekends);
                    reminderStatus("saved");
                    if (enabled) requestNotificationPermission();
                } catch (RuntimeException error) { reminderStatus("invalid"); }
            });
        }
        @JavascriptInterface public void requestPermission() {
            runOnUiThread(() -> { if (isTrustedDocument()) requestNotificationPermission(); });
        }
        @JavascriptInterface public void openSettings() {
            runOnUiThread(() -> {
                if (!isTrustedDocument()) return;
                try { startActivity(new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                        .putExtra(Settings.EXTRA_APP_PACKAGE, getPackageName())); }
                catch (RuntimeException error) { reminderStatus("settings-error"); }
            });
        }
        @JavascriptInterface public void test() {
            runOnUiThread(() -> {
                if (isTrustedDocument()) reminderStatus(ReminderController.post(MainActivity.this) ? "test-sent" : "blocked");
            });
        }
    }

    public final class UpdateBridge {
        @JavascriptInterface public String getStatus() { return updates == null ? "{}" : updates.status(); }
        @JavascriptInterface public void check() {
            runOnUiThread(() -> { if (isTrustedDocument() && updates != null) updates.check(true); });
        }
        @JavascriptInterface public void download() {
            runOnUiThread(() -> { if (isTrustedDocument() && updates != null) updates.download(); });
        }
        @JavascriptInterface public void install() {
            runOnUiThread(() -> { if (isTrustedDocument() && updates != null) updates.install(); });
        }
        @JavascriptInterface public void installSettings() {
            runOnUiThread(() -> { if (isTrustedDocument() && updates != null) updates.installSettings(); });
        }
        @JavascriptInterface public void cancelDownload() {
            runOnUiThread(() -> { if (isTrustedDocument() && updates != null) updates.cancelDownload(); });
        }
    }
    private void updateStatus(String json) {
        if (pageReady && isTrustedDocument()) webView.evaluateJavascript(
                "window.CityUpdates&&CityUpdates.nativeChanged(" + json + ");", null);
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33 && !ReminderController.permissionGranted(this) && !notificationPermissionPending) {
            notificationPermissionPending = true;
            requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_REQUEST);
        } else { ReminderController.reschedule(this); reminderStatus(""); }
    }
    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == NOTIFICATION_PERMISSION_REQUEST) {
            notificationPermissionPending = false;
            ReminderController.reschedule(this); reminderStatus("");
        }
    }
    private void reminderStatus(String message) {
        if (pageReady && isTrustedDocument()) webView.evaluateJavascript("window.CityReminders&&CityReminders.nativeChanged("
                + ReminderController.status(this) + "," + org.json.JSONObject.quote(message) + ");", null);
    }
    private void openReminderReview() {
        if (!reminderReviewPending || !pageReady || !isTrustedDocument()) return;
        webView.evaluateJavascript("window.CityReminders?CityReminders.openReview():false", result -> {
            if ("true".equals(result)) reminderReviewPending = false;
        });
    }
    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (ReminderController.ACTION_REVIEW.equals(intent.getAction())) {
            reminderReviewPending = true; intent.setAction(Intent.ACTION_MAIN); openReminderReview();
        }
    }
    @Override protected void onSaveInstanceState(Bundle outState) {
        outState.putBoolean("reminderReviewPending", reminderReviewPending);
        super.onSaveInstanceState(outState);
    }

    private void showSpeechMessage(String text) {
        runOnUiThread(() -> {
            if (destroyed || isFinishing()) return;
            Toast.makeText(this, text, Toast.LENGTH_LONG).show();
            if (webView != null) webView.evaluateJavascript(
                    "if(typeof toast==='function')toast(" + org.json.JSONObject.quote(text) + ");", null);
        });
    }

    private void debugLog(String message) {
        if ((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
            Log.d("EnglishQuest", message);
        }
    }

    @SuppressWarnings("deprecation")
    @Override public void onBackPressed() { handleBack(); }

    private void handleBack() {
        if (webView == null || destroyed || nativeDialog != null) return;
        // Reference the app's own state; do not navigate WebView history and lose an active lesson.
        String script = "(function(){"
                + "if(window.CityShare&&CityShare.isOpen()){CityShare.close();return 'handled';}"
                + "if(window.CityIntegration&&CityIntegration.handleBack&&CityIntegration.handleBack())return 'handled';"
                + "if(document.querySelector('.modal-shade')){if(typeof dismiss==='function')dismiss();return 'handled';}"
                + "if(document.querySelector('.result')){session=null;flash=null;currentTab='home';render();return 'handled';}"
                + "if(typeof session!=='undefined'&&session&&session.index<session.lesson.tasks.length){exitLesson();return 'handled';}"
                + "if(typeof flash!=='undefined'&&flash&&flash.index<flash.queue.length)return 'review';"
                + "if(typeof currentTab!=='undefined'&&(currentTab!=='home'||session||flash)){session=null;flash=null;currentTab='home';render();return 'handled';}"
                + "return 'close';})()";
        webView.evaluateJavascript(script, result -> {
            if (destroyed || isFinishing()) return;
            if ("\"review\"".equals(result)) {
                showExitDialog(true);
            } else if (!"\"handled\"".equals(result)) {
                showExitDialog(false);
            }
        });
    }

    private void showExitDialog(boolean review) {
        if (nativeDialog != null || destroyed) return;
        nativeDialog = new AlertDialog.Builder(this)
                .setTitle(review ? "Закончить повторение?" : "Закрыть English Quest?")
                .setMessage(review ? "Ответы на пройденные карточки уже сохранены."
                        : "Твои баллы, слова и завершённые уроки сохранены на устройстве.")
                .setNegativeButton("Продолжить", null)
                .setPositiveButton(review ? "На главную" : "Закрыть", (dialog, which) -> {
                    if (review && webView != null) {
                        webView.evaluateJavascript("session=null;flash=null;currentTab='home';render();", null);
                    } else finish();
                }).create();
        nativeDialog.setOnDismissListener(dialog -> nativeDialog = null);
        nativeDialog.show();
    }

    private static boolean isLocalAsset(Uri uri) {
        if (uri == null || !"https".equals(uri.getScheme()) || !HOST.equals(uri.getHost())
                || uri.getPort() != -1 || uri.getUserInfo() != null) return false;
        String path = uri.getPath();
        if (path == null || !path.startsWith("/assets/app/") || !path.matches("/[A-Za-z0-9_./-]+")) return false;
        for (String segment : path.split("/")) {
            if ("..".equals(segment) || ".".equals(segment)) return false;
        }
        return true;
    }

    private final class LocalClient extends WebViewClient {
        @Override public void onPageFinished(WebView view, String url) {
            pageReady = START_URL.equals(url);
            if (pageReady) { reminderStatus(""); openReminderReview(); if (updates != null) updateStatus(updates.status()); }
        }
        @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            // This application has one top-level document. No external link reaches the bridge.
            return !START_URL.equals(request.getUrl().toString());
        }

        @SuppressWarnings("deprecation")
        @Override public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return !START_URL.equals(url);
        }

        @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (!"GET".equals(request.getMethod()) || !isLocalAsset(uri)) return errorResponse(403, "Forbidden");
            String assetPath = uri.getPath().substring("/assets/".length());
            try {
                InputStream data = getAssets().open(assetPath);
                Map<String, String> headers = new HashMap<>();
                headers.put("Cache-Control", "no-cache");
                headers.put("X-Content-Type-Options", "nosniff");
                headers.put("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'");
                return new WebResourceResponse(mimeType(assetPath), "UTF-8", 200, "OK", headers, data);
            } catch (IOException missing) {
                return errorResponse(404, "Not Found");
            }
        }

        @Override public void onReceivedError(WebView view, WebResourceRequest request,
                android.webkit.WebResourceError error) {
            if (!request.isForMainFrame()) return;
            Toast.makeText(MainActivity.this, "Не удалось открыть уроки. Закрой и снова открой приложение.", Toast.LENGTH_LONG).show();
        }

        @Override public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
            // Let Android recreate a clean Activity after a WebView renderer failure.
            ((FrameLayout) view.getParent()).removeView(view);
            view.destroy();
            webView = null;
            pageReady = false;
            if (!destroyed && !isFinishing()) {
                new AlertDialog.Builder(MainActivity.this).setTitle("Вернёмся к занятиям")
                        .setMessage("Приложению нужно перезапустить экран. Сохранённый прогресс останется.")
                        .setCancelable(false).setPositiveButton("Открыть снова", (dialog, which) -> recreate()).show();
            }
            return true;
        }
    }

    private static String mimeType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".json")) return "application/json";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".webp")) return "image/webp";
        if (path.endsWith(".woff2")) return "font/woff2";
        return "application/octet-stream";
    }

    private static WebResourceResponse errorResponse(int status, String reason) {
        return new WebResourceResponse("text/plain", "UTF-8", status, reason, new HashMap<>(),
                new ByteArrayInputStream(reason.getBytes(StandardCharsets.UTF_8)));
    }

    @Override protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
        if (speech != null) speech.onResume();
        ReminderController.reschedule(this);
        reminderStatus("");
        if (updates != null) updates.check(false);
    }

    @Override protected void onPause() {
        if (speech != null) speech.stop();
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override protected void onDestroy() {
        destroyed = true;
        if (updates != null) { updates.destroy(); updates = null; }
        if (resultShare != null) { resultShare.destroy(); resultShare = null; }
        if (nativeDialog != null) nativeDialog.dismiss();
        if (speech != null) { speech.destroy(); speech = null; }
        if (webView != null) {
            webView.removeJavascriptInterface("AndroidSpeech");
            webView.removeJavascriptInterface("AndroidShare");
            webView.removeJavascriptInterface("AndroidReminders");
            webView.removeJavascriptInterface("AndroidUpdates");
            webView.stopLoading();
            ((FrameLayout) webView.getParent()).removeView(webView);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
