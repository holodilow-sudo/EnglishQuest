package ru.arseniy.englishquest;
import android.content.Context;
import android.content.pm.*;
import android.os.Build;
import java.io.File;
import java.security.MessageDigest;
import java.util.*;

final class UpdateApkVerifier {
    @SuppressWarnings("deprecation")
    static void verify(Context context, File file, UpdateRelease release) throws Exception {
        if(!file.isFile() || file.length()!=release.bytes || !release.sha256.equals(UpdateTransfer.hash(file)))throw new SecurityException("Invalid APK bytes");
        PackageManager manager=context.getPackageManager();
        int flags=Build.VERSION.SDK_INT>=28?PackageManager.GET_SIGNING_CERTIFICATES:PackageManager.GET_SIGNATURES;
        PackageInfo candidate=manager.getPackageArchiveInfo(file.getAbsolutePath(),flags),installed=manager.getPackageInfo(context.getPackageName(),flags);
        if(candidate==null || !context.getPackageName().equals(candidate.packageName) || !release.version.equals(candidate.versionName))throw new SecurityException("Wrong package/version");
        long candidateCode=Build.VERSION.SDK_INT>=28?candidate.getLongVersionCode():candidate.versionCode;
        long installedCode=Build.VERSION.SDK_INT>=28?installed.getLongVersionCode():installed.versionCode;
        if(candidateCode<=installedCode)throw new SecurityException("Not a newer APK");
        Set<String> expected=signers(installed);
        if(expected.isEmpty() || !expected.equals(signers(candidate)))throw new SecurityException("Wrong signing key");
    }
    @SuppressWarnings("deprecation")
    private static Set<String> signers(PackageInfo info) throws Exception {
        Signature[] signatures=Build.VERSION.SDK_INT>=28?(info.signingInfo==null?null:info.signingInfo.getApkContentsSigners()):info.signatures;
        Set<String> result=new HashSet<>();
        if(signatures!=null)for(Signature signature:signatures)result.add(UpdateTransfer.hex(MessageDigest.getInstance("SHA-256").digest(signature.toByteArray())));
        return result;
    }
}
