package ru.arseniy.englishquest;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.HashSet;

/** Pure calendar logic: local phone time, Monday-Friday versus Saturday-Sunday. */
public final class ReminderSchedule {
    public static final String WEEKDAYS = "11:00,19:00";
    public static final String WEEKENDS = "11:00,13:00,17:00,19:00";
    private ReminderSchedule() { }

    public static String[] parse(String csv, int count) {
        if (csv == null || csv.length() > 50) throw new IllegalArgumentException("Некорректное время.");
        String[] times = csv.split(",", -1);
        if (times.length != count) throw new IllegalArgumentException("Проверь количество напоминаний.");
        HashSet<String> unique = new HashSet<>();
        for (String time : times) {
            if (!time.matches("(?:[01][0-9]|2[0-3]):[0-5][0-9]") || !unique.add(time))
                throw new IllegalArgumentException("Время должно быть разным и в формате ЧЧ:ММ.");
        }
        Arrays.sort(times);
        return times;
    }

    public static final class Slot {
        public final long at;
        public final String key;
        Slot(long at, String key) { this.at = at; this.key = key; }
    }

    public static Slot next(long now, ZoneId zone, String[] weekdays, String[] weekends) {
        LocalDate today = Instant.ofEpochMilli(now).atZone(zone).toLocalDate();
        for (int offset = 0; offset < 8; offset++) {
            LocalDate day = today.plusDays(offset);
            DayOfWeek dow = day.getDayOfWeek();
            String[] times = dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY ? weekends : weekdays;
            Slot next = null;
            for (String time : times) {
                long at = day.atTime(LocalTime.parse(time)).atZone(zone).toInstant().toEpochMilli();
                if (at > now && (next == null || at < next.at)) next = new Slot(at, day + "|" + time);
            }
            if (next != null) return next;
        }
        throw new IllegalArgumentException("Нет времени для напоминаний.");
    }

    public static boolean timely(long now, long scheduled, ZoneId zone) {
        return scheduled > 0 && now >= scheduled && now - scheduled <= 60 * 60 * 1000L
                && Instant.ofEpochMilli(now).atZone(zone).toLocalDate()
                .equals(Instant.ofEpochMilli(scheduled).atZone(zone).toLocalDate());
    }
}
