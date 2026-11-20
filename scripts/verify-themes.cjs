/* Test the real theme controls with synthetic progress in an isolated browser. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/theme-review');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(pathToFileURL(path.join(root,'app/index.html')).href);
  await page.evaluate(()=>{state=initial();state.city={welcome:true};state.sound=false;state.xp=123;state.coins=51;state.words[CONTENT.words[0].id]={level:2,due:Date.now()+86400000,seen:3,difficult:false};state.awarded[CONTENT.lessons[0].tasks[0].id]=true;save();currentTab='profile';profileView='progress';render()});
  assert.equal(await page.evaluate(()=>CityThemes.current),'vice');
  assert.equal(await page.locator('[name="appearance-theme"]').count(),6);
  const before=await page.evaluate(()=>JSON.stringify({xp:state.xp,coins:state.coins,words:state.words,awarded:state.awarded,cosmetics:state.cosmetics}));
  const themes=await page.evaluate(()=>CityThemes.themes.map(t=>t.id));
  for(const id of themes){
   await page.locator(`[name="appearance-theme"][value="${id}"]`).check();
   assert.equal(await page.locator('html').getAttribute('data-theme'),id);
   assert.equal(await page.locator('[name="appearance-theme"]:checked').count(),1);
   await page.reload();
   assert.equal(await page.evaluate(()=>CityThemes.current),id);
   assert.equal(await page.evaluate(()=>JSON.stringify({xp:state.xp,coins:state.coins,words:state.words,awarded:state.awarded,cosmetics:state.cosmetics})),before);
   await page.evaluate(()=>{currentTab='profile';profileView='progress';render()});
  }
  await page.evaluate(()=>{CityThemes.select('not-a-theme')});
  assert.equal(await page.evaluate(()=>CityThemes.current),'carbon');
  const fits=async(label)=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label);
  for(const width of [320,430]){
   await page.setViewportSize({width,height:844});
   for(const id of themes){
    await page.evaluate(id=>CityThemes.select(id),id);
    for(const tab of ['home','training','travel','course','words','profile']){
     await page.evaluate(tab=>{session=null;flash=null;currentTab=tab;profileView='progress';render()},tab);
     await fits(id+' / '+tab+' / '+width);
    }
    for(const view of ['shop','badges']){await page.evaluate(view=>{profileView=view;profile()},view);await fits(id+' / '+view)}
    await page.evaluate(()=>{start(CONTENT.lessons[0].id)});await fits(id+' / lesson');
    await page.evaluate(()=>{startReview([CONTENT.words[0].id]);flash.revealed=true;reviewScreen()});await fits(id+' / word');
    await page.evaluate(()=>{CityTraining.begin({mode:'build',source:'textbook',count:1})});await fits(id+' / sentence');
    await page.evaluate(()=>{CityTraining.pause();state.training.active=null;session=null;flash=null;currentTab='profile';profileView='progress';render();CityReminders.settings()});await fits(id+' / reminders');
    await page.evaluate(()=>dismiss());
   }
  }
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>{CityThemes.select('vice');currentTab='training';render()});
  fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,'vice-practice.png')});
  await page.evaluate(()=>{currentTab='profile';profileView='progress';render();document.querySelector('.appearance-settings').scrollIntoView({block:'start',behavior:'instant'})});
  await page.screenshot({path:path.join(out,'theme-settings.png')});
  assert.deepEqual(errors,[]);
  const result={passed:true,themes,checks:['Six free themes selectable through real settings controls','Selection survives reload','XP, coins, words, answers and owned cosmetics unchanged','Invalid theme ignored','320/430 px main views, profile views, lessons, flashcards, sentence construction and reminder settings','No browser JS errors']};
  fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
