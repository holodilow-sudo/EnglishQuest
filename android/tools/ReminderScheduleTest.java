package ru.arseniy.englishquest;

import java.time.*;
import java.util.*;

/** Host-only tests: no APK, emulator, installation or phone state. */
public final class ReminderScheduleTest {
    private static final ZoneId CHITA = ZoneId.of("Asia/Chita");
    private static int checks;
    private static final String[] WEEK = ReminderSchedule.parse(ReminderSchedule.WEEKDAYS, 2);
    private static final String[] END = ReminderSchedule.parse(ReminderSchedule.WEEKENDS, 4);
    private static long local(String text, ZoneId zone) { return LocalDateTime.parse(text).atZone(zone).toInstant().toEpochMilli(); }
    private static void expect(boolean condition, String message) {
        checks++; if (!condition) throw new AssertionError(message);
    }
    private static void next(String now, String wanted, ZoneId zone) {
        expect(ReminderSchedule.next(local(now, zone), zone, WEEK, END).at == local(wanted, zone), "Next after " + now + " must be " + wanted);
    }
    public static void main(String[] args) {
        next("2026-11-06T10:00", "2026-11-06T11:00", CHITA);
        next("2026-11-06T11:00", "2026-11-06T19:00", CHITA);
        next("2026-11-06T19:01", "2026-11-07T11:00", CHITA);
        next("2026-11-07T11:00", "2026-11-07T13:00", CHITA);
        next("2026-11-07T13:00", "2026-11-07T17:00", CHITA);
        next("2026-11-07T17:00", "2026-11-07T19:00", CHITA);
        next("2026-11-08T19:00", "2026-11-09T11:00", CHITA);
        next("2026-12-31T19:00", "2027-01-01T11:00", CHITA);
        long cursor = local("2026-11-02T00:00", CHITA);
        Map<LocalDate, List<String>> days = new LinkedHashMap<>();
        for (int i = 0; i < 18; i++) {
            ReminderSchedule.Slot slot = ReminderSchedule.next(cursor, CHITA, WEEK, END);
            ZonedDateTime time = Instant.ofEpochMilli(slot.at).atZone(CHITA);
            days.computeIfAbsent(time.toLocalDate(), d -> new ArrayList<>()).add(time.toLocalTime().toString());
            expect(slot.at > cursor, "Strictly increasing alarms"); cursor = slot.at;
        }
        expect(days.size() == 7, "Exactly seven days");
        for (Map.Entry<LocalDate, List<String>> day : days.entrySet()) {
            boolean weekend = day.getKey().getDayOfWeek().getValue() >= 6;
            expect(day.getValue().equals(Arrays.asList(weekend ? END : WEEK)), "Correct times for " + day.getKey());
        }
        ZoneId ny = ZoneId.of("America/New_York");
        next("2026-03-07T19:01", "2026-03-08T11:00", ny);
        next("2026-10-31T19:01", "2026-11-01T11:00", ny);
        next("2026-11-07T10:59", "2026-11-07T11:00", ZoneId.of("Europe/London"));
        long scheduled = local("2026-11-07T19:00", CHITA);
        expect(ReminderSchedule.timely(scheduled, scheduled, CHITA), "Due reminder");
        expect(ReminderSchedule.timely(scheduled + 30 * 60000, scheduled, CHITA), "Moderate Android delay");
        expect(!ReminderSchedule.timely(scheduled - 1, scheduled, CHITA), "No early notification");
        expect(!ReminderSchedule.timely(scheduled + 61 * 60000, scheduled, CHITA), "Skip stale notification");
        expect(!ReminderSchedule.timely(local("2026-11-08T11:00", CHITA), scheduled, CHITA), "No yesterday backlog");
        for (String bad : new String[]{"11:00,11:00", "25:00,19:00", "11:90,19:00", "11:00", "11:00,", "ab:cd,19:00"}) {
            boolean rejected = false; try { ReminderSchedule.parse(bad, 2); } catch (IllegalArgumentException expected) { rejected = true; }
            expect(rejected, "Reject invalid input: " + bad);
        }
        expect(Arrays.equals(ReminderSchedule.parse("19:00,11:00", 2), WEEK), "Sort edited times");
        System.out.println("Reminder schedule: " + checks + " checks passed; 18 weekly reminders, local time and DST verified.");
    }
}
