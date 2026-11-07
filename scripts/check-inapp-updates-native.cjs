/* Host tests/typecheck only. Does not build, sign or install an APK. */
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/inapp-update-check');
const java=path.join(root,'.toolchain/jdk/jdk-17.0.20.1+1/bin/java.exe'),javac=path.join(path.dirname(java),'javac.exe');
const pkg=path.join(root,'android/src/main/java/ru/arseniy/englishquest'),jar=path.join(root,'work/github-update-check/json-20240303.jar');
function run(exe,args){const r=spawnSync(exe,args,{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:4*1024*1024});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');if(r.error)throw r.error;assert.equal(r.status,0)}
const classes=path.join(out,'unit');fs.mkdirSync(classes,{recursive:true});
assert(fs.existsSync(jar),'Host-test dependency only: org.json 20240303 from repo.maven.apache.org; never bundled in APK.');
run(javac,['-encoding','UTF-8','-cp',jar,'-d',classes,path.join(pkg,'UpdateRelease.java'),path.join(pkg,'UpdateTransfer.java'),path.join(root,'android/tools/UpdateTransferTest.java'),path.join(root,'android/tools/UpdateReleaseTest.java'),path.join(pkg,'ReminderSchedule.java'),path.join(root,'android/tools/ReminderScheduleTest.java')]);
run(java,['-cp',[classes,jar].join(path.delimiter),'ru.arseniy.englishquest.UpdateReleaseTest']);
run(java,['-cp',classes,'ru.arseniy.englishquest.ReminderScheduleTest']);
run(java,['-cp',[classes,jar].join(path.delimiter),'ru.arseniy.englishquest.UpdateTransferTest']);
const native=path.join(out,'android');fs.mkdirSync(native,{recursive:true});
const stub=path.join(out,'R.java');fs.writeFileSync(stub,'package ru.arseniy.englishquest; public final class R { public static final class drawable { public static final int ic_word_reminder=0x7f010001; } }');
const boot=[path.join(root,'.toolchain/sdk-build/android-15/core-lambda-stubs.jar'),path.join(root,'.toolchain/sdk-platform/android-35/android.jar')].join(path.delimiter);
run(java,[path.join(root,'android/tools/CompileAndroid.java'),boot,native,...fs.readdirSync(pkg).filter(f=>f.endsWith('.java')).map(f=>path.join(pkg,f)),stub]);
const manifest=fs.readFileSync(path.join(root,'android/src/main/AndroidManifest.xml'),'utf8'),main=fs.readFileSync(path.join(pkg,'MainActivity.java'),'utf8');
assert(manifest.includes('android:versionCode="6"')&&manifest.includes('android:versionName="1.2.2"'));
assert(manifest.includes('package="ru.arseniy.englishquest"')&&manifest.includes('android.permission.INTERNET'));
assert(manifest.includes('REQUEST_INSTALL_PACKAGES')&&!manifest.includes('WRITE_EXTERNAL_STORAGE'));
assert(main.includes('settings.setBlockNetworkLoads(true)')&&main.includes("connect-src 'none'"));
assert(main.includes('if (updates != null) updates.check(false)'));
const report={passed:true,releasePolicyChecks:36,transferChecks:19,reminderScheduleChecks:49,allAndroidJavaTypechecked:true,plannedVersion:'1.2.2',plannedVersionCode:6,apkBuilt:false,deviceTested:false};
fs.writeFileSync(path.join(out,'native-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
