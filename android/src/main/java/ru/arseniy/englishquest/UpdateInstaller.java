package ru.arseniy.englishquest;

import android.app.Activity;
import android.content.*;
import android.net.Uri;
import android.provider.Settings;
import android.util.AtomicFile;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.*;
import org.json.JSONObject;

/** Download/cache state survives a restart; installing always requires an explicit UI tap. */
final class UpdateInstaller {
    interface Listener{void changed(JSONObject state);}
    private final Activity activity;
    private final Listener listener;
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private final AtomicFile record;
    private final String installed;
    private volatile boolean closed,cancelled;
    private boolean busy,initialized;
    private UpdateRelease release;
    private String state="idle",message="";
    private int percent;
    UpdateInstaller(Activity activity,String installed,Listener listener){
        this.activity=activity;this.installed=installed;this.listener=listener;
        record=new AtomicFile(new File(activity.getCacheDir(),"verified-update.json"));
    }
    boolean busy(){return busy;}
    boolean ready(){return release!=null && (state.equals("ready")||state.equals("install-permission")||state.equals("installing"));}
    void notifyStatus(){emit(state,message);}
    private void emit(String next,String detail){
        state=next;message=detail;
        try{
            JSONObject value=new JSONObject().put("state",state).put("progress",percent).put("message",message).put("manual",false).put("inApp",true);
            if(release!=null)value.put("version",release.version).put("bytes",release.bytes);
            listener.changed(value);
        }catch(Exception ignored){}
    }
    boolean restore(Runnable after){
        if(initialized)return false;
        if(busy)return true;
        busy=true;
        worker.execute(()->{
            UpdateRelease cached=null;
            File[] abandoned=activity.getCacheDir().listFiles((dir,name)->name.matches("update-[a-f0-9-]{36}\\.part"));
            if(abandoned!=null)for(File file:abandoned)file.delete();
            try{
                byte[] bytes=record.readFully();if(bytes.length>8192)throw new IOException("Invalid cache");
                cached=UpdateRelease.parse(new String(bytes,StandardCharsets.UTF_8),installed);
                if(cached==null)throw new IOException("Old cache");
                UpdateApkVerifier.verify(activity,UpdateApkProvider.file(activity),cached);
            }catch(Exception invalid){cached=null;record.delete();UpdateApkProvider.file(activity).delete();}
            final UpdateRelease result=cached;
            activity.runOnUiThread(()->{if(closed)return;busy=false;initialized=true;release=result;if(result!=null){percent=100;emit("ready","");}after.run();});
        });
        return true;
    }
    void start(UpdateRelease candidate){
        if(closed||busy||ready())return;
        release=candidate;busy=true;cancelled=false;percent=0;emit("downloading","");
        worker.execute(()->{
            File part=new File(activity.getCacheDir(),"update-"+UUID.randomUUID()+".part");boolean done=false;
            try{
                UpdateTransfer.download(candidate,part,progress->activity.runOnUiThread(()->{
                    if(!closed&&busy&&!cancelled){percent=progress;emit("downloading","");}
                }),()->closed||cancelled);
                if(closed||cancelled)throw new IOException("Stopped");
                activity.runOnUiThread(()->{if(!closed)emit("verifying","");});
                UpdateApkVerifier.verify(activity,part,candidate);
                if(closed||cancelled)throw new IOException("Stopped");
                File target=UpdateApkProvider.file(activity);record.delete();
                if(target.exists()&&!target.delete())throw new IOException("Cache busy");
                if(!part.renameTo(target))throw new IOException("Cannot finalize download");
                FileOutputStream output=null;
                try{output=record.startWrite();output.write(candidate.cacheJson().getBytes(StandardCharsets.UTF_8));record.finishWrite(output);}
                catch(Exception error){record.failWrite(output);throw error;}
                done=true;
            }catch(Exception error){/* No untrusted remote text/URLs in logs or UI. */}
            finally{part.delete();}
            final boolean success=done;
            activity.runOnUiThread(()->{
                if(closed)return;busy=false;
                if(success){percent=100;emit("ready","");}
                else emit("available",cancelled?"Загрузка остановлена. Можно продолжить позже.":"Не удалось скачать или проверить файл. Нажми «Повторить загрузку».");
            });
        });
    }
    void cancel(){if(busy&&state.equals("downloading")){cancelled=true;emit("downloading","Останавливаем загрузку…");}}
    void retry(UpdateRelease latest){if(latest!=null)start(latest);else if(release!=null)start(release);}
    void resume(){if(ready())emit(state.equals("install-permission")&&!activity.getPackageManager().canRequestPackageInstalls()?"install-permission":"ready","");}
    void install(){
        if(closed||busy||!ready())return;
        if(!activity.getPackageManager().canRequestPackageInstalls()){emit("install-permission","");return;}
        busy=true;UpdateRelease candidate=release;emit("verifying","");
        worker.execute(()->{
            boolean valid=false;
            try{UpdateApkVerifier.verify(activity,UpdateApkProvider.file(activity),candidate);valid=true;}catch(Exception ignored){}
            final boolean verified=valid;
            activity.runOnUiThread(()->{
                if(closed)return;busy=false;
                if(!verified){record.delete();UpdateApkProvider.file(activity).delete();emit("available","Файл обновления недоступен или изменился. Скачай его заново.");return;}
                if(!activity.hasWindowFocus()){emit("ready","");return;}
                try{
                    Uri uri=UpdateApkProvider.uri(activity);
                    Intent intent=new Intent(Intent.ACTION_VIEW).setDataAndType(uri,"application/vnd.android.package-archive")
                        .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    intent.setClipData(ClipData.newRawUri("EnglishQuest APK",uri));
                    activity.startActivity(intent);emit("installing","");
                }catch(RuntimeException error){emit("ready","Не удалось открыть установщик Android. Попробуй ещё раз.");}
            });
        });
    }
    void settings(){
        if(closed||!ready())return;
        try{activity.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,Uri.parse("package:"+activity.getPackageName())));}
        catch(RuntimeException error){emit("install-permission","Разреши установку из English City Quest в настройках телефона.");}
    }
    void destroy(){closed=true;cancelled=true;worker.shutdownNow();}
}
