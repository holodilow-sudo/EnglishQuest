package ru.arseniy.englishquest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** Only stable, correctly named APK assets from this one public repository. */
final class UpdateRelease {
    static final String REPOSITORY = "https://github.com/holodilow-sudo/EnglishQuest";
    static final String API = "https://api.github.com/repos/holodilow-sudo/EnglishQuest/releases/latest";
    final String version, download, sha256;
    final long bytes;
    UpdateRelease(String version, String download, long bytes, String sha256) {
        this.version = version; this.download = download; this.bytes = bytes;
        this.sha256 = sha256;
    }
    String cacheJson() throws JSONException {
        return new JSONObject().put("tag_name", "v"+version).put("draft",false).put("prerelease",false)
            .put("assets",new JSONArray().put(new JSONObject().put("name","EnglishQuest-"+version+".apk")
            .put("state","uploaded").put("size",bytes).put("browser_download_url",download).put("digest","sha256:"+sha256))).toString();
    }
    static int[] versionParts(String value) {
        if (value == null || !value.matches("(0|[1-9][0-9]{0,5})\\.(0|[1-9][0-9]{0,5})\\.(0|[1-9][0-9]{0,5})"))
            throw new IllegalArgumentException("Invalid stable version");
        String[] parts = value.split("\\.");
        return new int[]{Integer.parseInt(parts[0]), Integer.parseInt(parts[1]), Integer.parseInt(parts[2])};
    }
    static boolean newer(String candidate, String installed) {
        int[] a = versionParts(candidate), b = versionParts(installed);
        for (int i = 0; i < 3; i++) if (a[i] != b[i]) return a[i] > b[i];
        return false;
    }
    static UpdateRelease parse(String body, String installed) throws JSONException {
        JSONObject release = new JSONObject(body);
        if (release.getBoolean("draft") || release.getBoolean("prerelease"))
            throw new IllegalArgumentException("Not a stable published release");
        String tag = release.getString("tag_name");
        if (!tag.startsWith("v")) throw new IllegalArgumentException("Invalid tag");
        String version = tag.substring(1);
        versionParts(version);
        if (!newer(version, installed)) return null;
        String name = "EnglishQuest-" + version + ".apk";
        String url = REPOSITORY + "/releases/download/" + tag + "/" + name;
        JSONArray assets = release.getJSONArray("assets");
        for (int i = 0; i < assets.length(); i++) {
            JSONObject asset = assets.getJSONObject(i);
            long size = asset.optLong("size", 0);
            String digest = asset.optString("digest");
            if (name.equals(asset.optString("name")) && "uploaded".equals(asset.optString("state"))
                    && url.equals(asset.optString("browser_download_url")) && size >= 1024 * 1024 && size <= 200L * 1024 * 1024
                    && digest.matches("sha256:[a-f0-9]{64}"))
                return new UpdateRelease(version, url, size, digest.substring(7));
        }
        throw new IllegalArgumentException("Release APK is not ready");
    }
}
