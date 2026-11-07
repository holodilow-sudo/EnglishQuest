package ru.arseniy.englishquest;
import android.content.*;
import android.database.*;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.*;

/** Read grant exposes only the verified update, never learning state or arbitrary cache files. */
public final class UpdateApkProvider extends ContentProvider {
    static File file(Context context){return new File(context.getCacheDir(),"verified-update.apk");}
    static Uri uri(Context context){return Uri.parse("content://"+context.getPackageName()+".updates/apk/update.apk");}
    @Override public boolean onCreate(){return true;}
    private File resolve(Uri uri) throws FileNotFoundException {
        if(getContext()==null || !uri(getContext()).equals(uri))throw new FileNotFoundException("Unknown URI");
        File file=file(getContext());if(!file.isFile()||file.length()<1024*1024||file.length()>200L*1024*1024)throw new FileNotFoundException("No APK");return file;
    }
    @Override public ParcelFileDescriptor openFile(Uri uri,String mode)throws FileNotFoundException {
        if(!"r".equals(mode))throw new FileNotFoundException("Read only");return ParcelFileDescriptor.open(resolve(uri),ParcelFileDescriptor.MODE_READ_ONLY);
    }
    @Override public String getType(Uri uri){return "application/vnd.android.package-archive";}
    @Override public Cursor query(Uri uri,String[] projection,String selection,String[] args,String sort){
        final File file;try{file=resolve(uri);}catch(FileNotFoundException error){return null;}
        String[] columns=projection==null?new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE}:projection;
        MatrixCursor cursor=new MatrixCursor(columns,1);Object[] values=new Object[columns.length];
        for(int i=0;i<columns.length;i++){if(OpenableColumns.DISPLAY_NAME.equals(columns[i]))values[i]="EnglishQuest-update.apk";else if(OpenableColumns.SIZE.equals(columns[i]))values[i]=file.length();}
        cursor.addRow(values);return cursor;
    }
    @Override public Uri insert(Uri uri,ContentValues values){throw new UnsupportedOperationException("Read only");}
    @Override public int update(Uri uri,ContentValues values,String selection,String[] args){throw new UnsupportedOperationException("Read only");}
    @Override public int delete(Uri uri,String selection,String[] args){throw new UnsupportedOperationException("Read only");}
}
