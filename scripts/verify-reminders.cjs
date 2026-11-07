/* Isolated WebView/UI contract checks. Does not send real OS notifications. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.resolve(process.argv[2]||path.join(root,'work/reminders-review'));
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const p=await ctx.newPage(),errors=[],checks=[];p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.goto(pathToFileURL(path.join(root,'app/index.html')).href);
  await p.evaluate(()=>{state=initial();state.city={welcome:true};state.sound=false;state.xp=75;state.coins=27;state.awarded['existing-answer']=true;state.completed=['existing-lesson'];save();currentTab='profile';render()});
  const progress=await p.evaluate(()=>({xp:state.xp,coins:state.coins,completed:state.completed,awarded:state.awarded}));
  await p.locator('[data-reminders="settings"]').click();
  assert.deepEqual(await p.locator('[data-reminder-time="weekdays"]').evaluateAll(nodes=>nodes.map(n=>n.value)),['11:00','19:00']);
  assert.deepEqual(await p.locator('[data-reminder-time="weekends"]').evaluateAll(nodes=>nodes.map(n=>n.value)),['11:00','13:00','17:00','19:00']);
  assert.equal(await p.locator('#reminder-enabled').isChecked(),true);
  for(const width of [360,390,430]){
   await p.setViewportSize({width,height:844});
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert(await p.locator('.reminders-modal').evaluate(el=>el.scrollWidth<=el.clientWidth));
  }
  await p.setViewportSize({width:390,height:844});
  await p.screenshot({path:path.join(out,'08-reminders.png')});
  await p.locator('[data-reminder-time="weekdays"]').last().fill('11:00');await p.locator('[data-reminders="save"]').click();
  assert((await p.locator('.reminder-error').innerText()).includes('разное'));
  await p.locator('[data-reminder-time="weekdays"]').last().fill('19:00');await p.locator('[data-reminders="save"]').click();
  assert.equal(await p.locator('.modal').count(),0);
  await p.reload();await p.evaluate(()=>{currentTab='profile';render()});
  await p.locator('[data-reminders="settings"]').click();
  assert.equal(await p.locator('#reminder-enabled').isChecked(),true);
  await p.locator('[data-reminder-time="weekdays"]').first().fill('10:30');await p.locator('[data-reminders="save"]').click();
  await p.reload();await p.evaluate(()=>{currentTab='profile';render()});await p.locator('[data-reminders="settings"]').click();
  assert.equal(await p.locator('[data-reminder-time="weekdays"]').first().inputValue(),'10:30');
  await p.locator('[data-reminder-time="weekdays"]').first().fill('11:00');await p.locator('#reminder-enabled').uncheck();await p.locator('[data-reminders="save"]').click();
  assert((await p.locator('[data-reminder-card]').innerText()).includes('выключены'));
  await p.locator('[data-reminders="settings"]').click();await p.locator('#reminder-enabled').check();await p.locator('[data-reminders="save"]').click();
  assert.deepEqual(await p.evaluate(()=>({xp:state.xp,coins:state.coins,completed:state.completed,awarded:state.awarded})),progress);
  checks.push('Requested weekday/weekend defaults, editable times, validation, enable/disable and persistence work without altering learning progress.');
  await p.locator('[data-reminders="settings"]').click();await p.locator('[data-reminders="test"]').click();
  await p.evaluate(()=>{clearTimeout(toastTimer);document.querySelector('#toast').classList.remove('show')});
  await p.screenshot({path:path.join(out,'09-notification.png')});
  await p.locator('[data-reminders="open-review"]').click();
  assert.equal(await p.locator('.review-flash').count(),1);
  assert(await p.evaluate(()=>flash.queue.length===10&&flash.queue.every(w=>CONTENT.words.some(x=>x.id===w.id))));
  await p.evaluate(()=>{flash=null;session=null;const due=CONTENT.words[5];state.words[due.id]={level:0,difficult:true,due:Date.now()-1000,seen:1};CityReminders.openReview()});
  assert.equal(await p.evaluate(()=>flash.queue[0].id),await p.evaluate(()=>CONTENT.words[5].id));
  await p.evaluate(()=>{flash=null;CONTENT.words.forEach(w=>state.words[w.id]={level:3,difficult:false,due:Date.now()+86400000,seen:10});CityReminders.openReview()});
  assert.equal(await p.locator('.review-flash').count(),1);assert.equal(await p.evaluate(()=>flash.queue.length),10);
  checks.push('Notification routes to textbook word cards: due words first, fresh words when available, and a usable practice set even when all words are learned and not due.');
  await p.evaluate(()=>{flash=null;start(CONTENT.lessons[0].id);CityReminders.openReview()});
  assert((await p.locator('.modal').innerText()).includes('Перейти к словам'));
  await p.locator('.modal [data-action="dismiss"]').click();assert(await p.evaluate(()=>!!session));
  await p.evaluate(()=>CityReminders.openReview());await p.locator('[data-reminders="review-now"]').click();assert.equal(await p.locator('.review-flash').count(),1);
  await p.evaluate(()=>{flash=null;CityTraining.begin({mode:'blitz',source:'textbook',count:25});CityReminders.openReview()});
  assert.equal(await p.locator('.review-flash').count(),1);assert.equal(await p.evaluate(()=>CityTraining.current.ids.length),25);
  checks.push('Opening review confirms leaving an active lesson and preserves an unfinished long training series.');
  await p.evaluate(()=>{
   flash=null;session=null;window.__reminderCalls=[];
   window.__reminderState={native:true,configured:false,enabled:false,allowed:false,permission:false,scheduled:0,weekdays:['11:00','19:00'],weekends:['11:00','13:00','17:00','19:00']};
   window.AndroidReminders={
    getStatus:()=>JSON.stringify(window.__reminderState),
    configure:(enabled,w,e)=>{window.__reminderCalls.push(['configure',enabled,w,e]);Object.assign(window.__reminderState,{configured:true,enabled,weekdays:w.split(','),weekends:e.split(',')});CityReminders.nativeChanged(window.__reminderState,'saved')},
    requestPermission:()=>window.__reminderCalls.push(['permission']),openSettings:()=>window.__reminderCalls.push(['settings']),test:()=>window.__reminderCalls.push(['test'])
   };currentTab='profile';render();
  });
  assert.deepEqual(await p.evaluate(()=>window.__reminderCalls),[]);
  await p.locator('[data-reminders="settings"]').click();await p.locator('[data-reminders="save"]').click();
  assert.deepEqual(await p.evaluate(()=>window.__reminderCalls[0]),['configure',true,'11:00,19:00','11:00,13:00,17:00,19:00']);
  assert((await p.locator('[data-reminder-card]').innerText()).includes('не разрешает'));
  await p.locator('[data-reminders="settings"]').click();await p.locator('[data-reminders="permission"]').click();await p.locator('[data-reminders="phone-settings"]').click();await p.locator('[data-reminders="test"]').click();
  assert.deepEqual((await p.evaluate(()=>window.__reminderCalls)).slice(1),[['permission'],['settings'],['test']]);
  await p.evaluate(()=>{dismiss();Object.assign(window.__reminderState,{allowed:true,permission:true,scheduled:Date.now()+3600000});CityReminders.nativeChanged(window.__reminderState,'')});
  assert((await p.locator('[data-reminder-card]').innerText()).includes('Ближайшее'));
  await p.evaluate(()=>{window.__reminderState.enabled=false;CityReminders.nativeChanged(window.__reminderState,'')});
  assert((await p.locator('[data-reminder-card]').innerText()).includes('выключены'));
  checks.push('Native bridge contract: no automatic permission request, exact schedule sent on save, blocked permission is visible, manual permission/settings/test controls route correctly, and next reminder is displayed only when scheduled.');
  assert.deepEqual(errors,[]);
  const native=JSON.parse(fs.readFileSync(path.join(root,'work/reminders-native-check/verification.json'),'utf8'));
  const hashes=JSON.parse(fs.readFileSync(path.join(root,'work/reminders-baseline/hashes.json'),'utf8').replace(/^\uFEFF/,''));
  for(const record of hashes)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(record.Path)).digest('hex').toUpperCase(),record.Hash);
  const report={passed:true,checks,native,legacyApkAndCurriculumUnchanged:true,date:new Date().toISOString(),deviceDeliveryTested:false,apkBuilt:false,installed:false};
  fs.writeFileSync(path.join(out,'reminders-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,checks:checks.length,out}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
