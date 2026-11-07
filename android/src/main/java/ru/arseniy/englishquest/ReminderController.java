package ru.arseniy.englishquest;

import android.Manifest;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import org.json.JSONArray;
import org.json.JSONObject;
import java.time.ZoneId;

/** Local notifications, no network, exact-alarm permission or continuously running service. */
public final class ReminderController {
    public static final String ACTION_ALARM = "ru.arseniy.englishquest.WORD_REMINDER";
    public static final String ACTION_REVIEW = "ru.arseniy.englishquest.OPEN_WORD_REVIEW";
    private static final String CHANNEL = "word-practice-v1";
    private static final int ALARM_ID = 7310, NOTIFICATION_ID = 7311;
    private ReminderController() { }
    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences("word-reminders-v1", Context.MODE_PRIVATE);
    }
    private static NotificationManager manager(Context context) {
        return (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    }
    public static void createChannel(Context context) {
        NotificationChannel channel = new NotificationChannel(CHANNEL, "Пора повторить слова", NotificationManager.IMPORTANCE_DEFAULT);
        channel.setDescription("Повторение слов: отдельное расписание для будней и выходных.");
        manager(context).createNotificationChannel(channel);
    }
    public static boolean permissionGranted(Context context) {
        return Build.VERSION.SDK_INT < 33 || context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
    }
    public static boolean allowed(Context context) {
        NotificationChannel channel = manager(context).getNotificationChannel(CHANNEL);
        return permissionGranted(context) && manager(context).areNotificationsEnabled()
                && channel != null && channel.getImportance() != NotificationManager.IMPORTANCE_NONE;
    }
    public static synchronized void configure(Context context, boolean enabled, String weekdays, String weekends) {
        String w = String.join(",", ReminderSchedule.parse(weekdays, 2));
        String e = String.join(",", ReminderSchedule.parse(weekends, 4));
        if (!prefs(context).edit().putBoolean("configured", true).putBoolean("enabled", enabled)
                .putString("weekdays", w).putString("weekends", e).commit())
            throw new IllegalStateException("Не удалось сохранить расписание.");
        reschedule(context);
    }
    private static PendingIntent alarmIntent(Context context, long at, String key) {
        Intent intent = new Intent(context, ReminderReceiver.class).setAction(ACTION_ALARM)
                .putExtra("scheduled", at).putExtra("slot", key);
        return PendingIntent.getBroadcast(context, ALARM_ID, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
    public static synchronized void reschedule(Context context) {
        createChannel(context);
        SharedPreferences p = prefs(context);
        AlarmManager alarm = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        alarm.cancel(alarmIntent(context, 0, ""));
        p.edit().remove("scheduled").remove("slot").remove("schedule_error").apply();
        if (!p.getBoolean("enabled", false) || !allowed(context)) {
            manager(context).cancel(NOTIFICATION_ID);
            return;
        }
        try {
            ReminderSchedule.Slot slot = ReminderSchedule.next(System.currentTimeMillis(), ZoneId.systemDefault(),
                    ReminderSchedule.parse(p.getString("weekdays", ReminderSchedule.WEEKDAYS), 2),
                    ReminderSchedule.parse(p.getString("weekends", ReminderSchedule.WEEKENDS), 4));
            if (!p.edit().putLong("scheduled", slot.at).putString("slot", slot.key).commit())
                throw new IllegalStateException("Не удалось сохранить время уведомления.");
            alarm.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, slot.at, alarmIntent(context, slot.at, slot.key));
        } catch (RuntimeException error) {
            p.edit().remove("scheduled").remove("slot").putBoolean("schedule_error", true).apply();
        }
    }
    public static synchronized void receive(Context context, Intent intent) {
        SharedPreferences p = prefs(context);
        long at = intent.getLongExtra("scheduled", 0);
        String key = intent.getStringExtra("slot");
        if (at != p.getLong("scheduled", -1) || key == null || !key.equals(p.getString("slot", ""))) return;
        try {
            if (p.getBoolean("enabled", false) && allowed(context)
                    && ReminderSchedule.timely(System.currentTimeMillis(), at, ZoneId.systemDefault())
                    && !key.equals(p.getString("last_delivered", ""))) {
                if (post(context)) p.edit().putString("last_delivered", key).commit();
            }
        } finally {
            // Schedule the next FUTURE slot, never replay missed reminders after sleep/reboot.
            reschedule(context);
        }
    }
    public static synchronized boolean post(Context context) {
        createChannel(context);
        if (!allowed(context)) return false;
        Intent intent = new Intent(context, MainActivity.class).setAction(ACTION_REVIEW)
                .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent open = PendingIntent.getActivity(context, NOTIFICATION_ID, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification notification = new Notification.Builder(context, CHANNEL)
                .setSmallIcon(R.drawable.ic_word_reminder).setColor(Color.rgb(165, 109, 183))
                .setContentTitle("Ученик, пора повторить слова!")
                .setContentText("Пара минут английского — и слова станут знакомее. Нажми, чтобы повторить.")
                .setStyle(new Notification.BigTextStyle().bigText("Пара минут английского — и слова станут знакомее. Нажми, чтобы повторить."))
                .setContentIntent(open).setAutoCancel(true).setCategory(Notification.CATEGORY_REMINDER)
                .setVisibility(Notification.VISIBILITY_PRIVATE).setTimeoutAfter(60 * 60 * 1000L).build();
        try { manager(context).notify(NOTIFICATION_ID, notification); return true; }
        catch (SecurityException denied) { return false; }
    }
    public static synchronized String status(Context context) {
        SharedPreferences p = prefs(context);
        JSONObject result = new JSONObject();
        try {
            result.put("native", true).put("configured", p.getBoolean("configured", false))
                    .put("enabled", p.getBoolean("enabled", false)).put("permission", permissionGranted(context))
                    .put("allowed", allowed(context)).put("scheduleError", p.getBoolean("schedule_error", false))
                    .put("scheduled", p.getLong("scheduled", 0)).put("timezone", ZoneId.systemDefault().getId())
                    .put("weekdays", new JSONArray(java.util.Arrays.asList(ReminderSchedule.parse(p.getString("weekdays", ReminderSchedule.WEEKDAYS), 2))))
                    .put("weekends", new JSONArray(java.util.Arrays.asList(ReminderSchedule.parse(p.getString("weekends", ReminderSchedule.WEEKENDS), 4))));
        } catch (Exception invalid) { return "{\"native\":true,\"error\":true}"; }
        return result.toString();
    }
}
