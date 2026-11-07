package ru.arseniy.englishquest;

import java.io.*;
import java.net.URI;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Locale;
import javax.net.ssl.HttpsURLConnection;

/** Public HTTPS download, bounded redirects/size/time, SHA-256 before any install. No credentials. */
final class UpdateTransfer {
    interface Progress { void changed(int percent); }
    interface Cancellation { boolean stopped(); }
    static boolean trustedRedirect(String value) {
        try {
            URI uri=new URI(value);
            return "https".equals(uri.getScheme()) && uri.getPort()==-1 && uri.getUserInfo()==null && uri.getFragment()==null
                && ("release-assets.githubusercontent.com".equals(uri.getHost()) || "objects.githubusercontent.com".equals(uri.getHost()));
        } catch(Exception error) { return false; }
    }
    static String hex(byte[] bytes) {
        StringBuilder result=new StringBuilder();
        for(byte value:bytes) result.append(String.format(Locale.ROOT,"%02x",value&255));
        return result.toString();
    }
    static String hash(File file) throws Exception {
        MessageDigest hash=MessageDigest.getInstance("SHA-256");
        try(InputStream input=new FileInputStream(file)) { byte[] buffer=new byte[32768]; int n; while((n=input.read(buffer))!=-1)hash.update(buffer,0,n); }
        return hex(hash.digest());
    }
    static void copy(InputStream input, File file, long expected, String digest, Progress progress, Cancellation cancelled) throws Exception {
        boolean done=false;
        try(FileOutputStream output=new FileOutputStream(file)) {
            MessageDigest hash=MessageDigest.getInstance("SHA-256");
            long count=0,deadline=System.nanoTime()+600_000_000_000L; int last=-1,n; byte[] buffer=new byte[32768];
            while((n=input.read(buffer))!=-1) {
                if(cancelled.stopped() || System.nanoTime()>deadline || count+n>expected)throw new IOException("Download stopped or oversized");
                output.write(buffer,0,n);hash.update(buffer,0,n);count+=n;
                int percent=(int)(count*100/expected);if(percent!=last){last=percent;progress.changed(percent);}
            }
            if(cancelled.stopped() || count!=expected || !digest.equals(hex(hash.digest())))throw new IOException("APK integrity check failed");
            output.getFD().sync(); done=true;
        } finally { if(!done)file.delete(); }
    }
    static void download(UpdateRelease release, File file, Progress progress, Cancellation cancelled) throws Exception {
        String expected=UpdateRelease.REPOSITORY+"/releases/download/v"+release.version+"/EnglishQuest-"+release.version+".apk";
        if(!expected.equals(release.download))throw new SecurityException("Wrong release source");
        String url=expected;
        for(int hop=0;hop<=3;hop++) {
            if(cancelled.stopped())throw new IOException("Cancelled");
            HttpsURLConnection request=(HttpsURLConnection)new URL(url).openConnection();
            try {
                request.setInstanceFollowRedirects(false); request.setConnectTimeout(10000); request.setReadTimeout(15000);
                request.setUseCaches(false); request.setRequestProperty("User-Agent","EnglishQuest-Android");
                request.setRequestProperty("Accept","application/octet-stream"); request.setRequestProperty("Accept-Encoding","identity");
                int code=request.getResponseCode();
                if(code==301||code==302||code==303||code==307||code==308) {
                    String next=request.getHeaderField("Location");
                    if(!trustedRedirect(next))throw new SecurityException("Untrusted redirect");url=next;continue;
                }
                if(code!=200)throw new IOException("Release download unavailable");
                long length=request.getContentLengthLong();
                if(length>=0 && length!=release.bytes)throw new IOException("Unexpected APK length");
                try(InputStream input=request.getInputStream()){copy(input,file,release.bytes,release.sha256,progress,cancelled);}
                return;
            } finally { request.disconnect(); }
        }
        throw new IOException("Too many redirects");
    }
}
