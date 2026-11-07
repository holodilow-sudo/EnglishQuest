package ru.arseniy.englishquest;
import org.json.JSONArray;
import org.json.JSONObject;

public final class UpdateReleaseTest {
    private static int checks;
    private static void check(boolean value) { checks++; if (!value) throw new AssertionError("Check " + checks); }
    private static JSONObject fixture(String version) throws Exception {
        return new JSONObject().put("tag_name", "v" + version).put("draft", false).put("prerelease", false)
            .put("assets", new JSONArray().put(new JSONObject().put("name", "EnglishQuest-" + version + ".apk")
            .put("state", "uploaded").put("digest", "sha256:"+"a".repeat(64)).put("size", 39379865).put("browser_download_url",
                UpdateRelease.REPOSITORY + "/releases/download/v" + version + "/EnglishQuest-" + version + ".apk")));
    }
    private static void rejected(JSONObject value) throws Exception {
        boolean rejected = false;
        try { UpdateRelease.parse(value.toString(), "1.2.0"); } catch (Exception error) { rejected = true; }
        check(rejected);
    }
    public static void main(String[] args) throws Exception {
        check(UpdateRelease.newer("1.2.1", "1.2.0"));
        check(UpdateRelease.newer("1.10.0", "1.9.9"));
        check(UpdateRelease.newer("2.0.0", "1.99.99"));
        check(!UpdateRelease.newer("1.2.0", "1.2.0"));
        check(!UpdateRelease.newer("1.1.0", "1.2.0"));
        check(UpdateRelease.parse(fixture("1.2.1").toString(), "1.2.0").bytes == 39379865);
        check(UpdateRelease.parse(fixture("1.2.0").toString(), "1.2.0") == null);
        check(UpdateRelease.parse(fixture("1.1.0").toString(), "1.2.0") == null);
        rejected(fixture("1.2.1").put("draft", true));
        rejected(fixture("1.2.1").put("prerelease", true));
        for (String tag : new String[]{"v1.3.0-beta", "1.3.0", "v01.3.0", "v1.3", "v1.3.0/../../bad", "v9999999.0.0"})
            rejected(fixture("1.2.1").put("tag_name", tag));
        for (String url : new String[]{"https://evil.example/app.apk", "http://github.com/holodilow-sudo/EnglishQuest/releases/download/v1.2.1/EnglishQuest-1.2.1.apk",
                "https://github.com/other/EnglishQuest/releases/download/v1.2.1/EnglishQuest-1.2.1.apk",
                UpdateRelease.REPOSITORY + "/releases/download/v1.2.1/EnglishQuest-1.2.1.apk?redirect=bad"}) {
            JSONObject value = fixture("1.2.1"); value.getJSONArray("assets").getJSONObject(0).put("browser_download_url", url); rejected(value);
        }
        for (long size : new long[]{0, -1, 1024, 200L * 1024 * 1024 + 1}) {
            JSONObject value = fixture("1.2.1"); value.getJSONArray("assets").getJSONObject(0).put("size", size); rejected(value);
        }
        for (String state : new String[]{"new", "open", ""}) {
            JSONObject value = fixture("1.2.1"); value.getJSONArray("assets").getJSONObject(0).put("state", state); rejected(value);
        }
        JSONObject wrong = fixture("1.2.1"); wrong.getJSONArray("assets").getJSONObject(0).put("name", "EnglishQuest-1.2.1-test.apk"); rejected(wrong);
        rejected(fixture("1.2.1").put("assets", new JSONArray()));
        rejected(new JSONObject());
        for(String digest:new String[]{"", "sha256:123", "sha1:"+"a".repeat(64), "sha256:"+"g".repeat(64)}){
            JSONObject value=fixture("1.2.1");value.getJSONArray("assets").getJSONObject(0).put("digest",digest);rejected(value);
        }
        UpdateRelease cached=UpdateRelease.parse(fixture("1.2.1").toString(),"1.2.0");
        check(UpdateRelease.parse(cached.cacheJson(),"1.2.0").sha256.equals("a".repeat(64)));
        check(UpdateRelease.parse(cached.cacheJson(),"1.2.1")==null);
        System.out.println("Update release tests passed: " + checks);
    }
}
