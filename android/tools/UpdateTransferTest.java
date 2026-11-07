package ru.arseniy.englishquest;
import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;

public class UpdateTransferTest {
    static int count;
    static void check(boolean ok){count++;if(!ok)throw new AssertionError("Check "+count);}
    public static void main(String[] args)throws Exception{
        check(UpdateTransfer.trustedRedirect("https://release-assets.githubusercontent.com/a?token=signed"));
        check(UpdateTransfer.trustedRedirect("https://objects.githubusercontent.com/file"));
        for(String url:new String[]{"http://release-assets.githubusercontent.com/a","https://release-assets.githubusercontent.com.evil.test/a","https://evil.test/a","https://user@objects.githubusercontent.com/a","https://objects.githubusercontent.com:444/a","https://objects.githubusercontent.com/a#fragment","file:///tmp/apk","https://127.0.0.1/a","not a url"})check(!UpdateTransfer.trustedRedirect(url));
        Path dir=Files.createTempDirectory("englishquest-transfer-test-");File file=dir.resolve("download.part").toFile();
        try{
            byte[] bytes=new byte[75001];new Random(13).nextBytes(bytes);
            String digest=UpdateTransfer.hex(MessageDigest.getInstance("SHA-256").digest(bytes));
            List<Integer> progress=new ArrayList<>();
            UpdateTransfer.copy(new ByteArrayInputStream(bytes),file,bytes.length,digest,progress::add,()->false);
            check(Arrays.equals(bytes,Files.readAllBytes(file.toPath())));check(progress.get(progress.size()-1)==100);
            check(UpdateTransfer.hash(file).equals(digest));
            for(int variant=0;variant<5;variant++){
                final int v=variant;boolean failed=false;
                InputStream input=v==4?new InputStream(){public int read()throws IOException{throw new IOException("Network failed");}}:new ByteArrayInputStream(bytes);
                try{UpdateTransfer.copy(input,file,v==0?bytes.length+1:v==1?bytes.length-1:bytes.length,v==2?"0".repeat(64):digest,p->{},()->v==3);}
                catch(Exception expected){failed=true;}
                check(failed&&!file.exists());
            }
            System.out.println("Update transfer tests passed: "+count+" (redirects, exact bytes, hash, truncation, oversize, cancellation, network failure)");
        }finally{file.delete();Files.delete(dir);}
    }
}
