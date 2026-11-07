/* Repeatable rewards regression checks. Uses a NEW ephemeral browser context.
   Never reads, clears, or modifies the user's browser profile. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
let playwright;
try{playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright')}
catch{playwright=require('playwright')}
const root=path.resolve(__dirname,'..');
const browsers=[process.env.BROWSER_EXECUTABLE,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean);
const executablePath=browsers.find(p=>fs.existsSync(p));
const checks=[];
async function main(){
 const browser=await playwright.chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.goto(pathToFileURL(path.join(root,'app/index.html')).href);
  const metadata=await page.evaluate(()=>({units:CONTENT.units.length,words:CONTENT.words.length,lessons:CONTENT.lessons.length}));
  await page.evaluate(()=>{
   window.__qaComplete=function(id,correct=true){
    start(id);
    for(let i=0;i<session.lesson.tasks.length;i++){
     session.index=i;session.checked=false;
     const q=session.lesson.tasks[i];
     if(q.type==='order'){
      const used=new Set(),parts=correct?q.answer.replace(/[.!?,]/g,'').split(/\s+/):[q.tokens[0]];
      session.answer=parts.map(t=>{const index=q.tokens.findIndex((token,j)=>!used.has(j)&&token.toLowerCase()===t.toLowerCase());used.add(index);return index});
     }else session.selected=q.options.findIndex(o=>correct?o===q.answer:o!==q.answer);
     check();
    }
    finish();
   };
  });
  const legacy=await page.evaluate(()=>{
   const raw={version:1,xp:70,awarded:{'travel-01':true},completed:['travel-words'],history:{'2026-01-01':{answers:3}},words:{'go-01':{level:2,due:12345,seen:3}},sound:false,goal:10};
   const migrated=migrate(raw);
   return {xp:migrated.xp,completed:migrated.completed,awarded:migrated.awarded,history:migrated.history,words:migrated.words,sound:migrated.sound,version:migrated.version,coins:migrated.coins,owned:migrated.cosmetics.owned.length};
  });
  assert.equal(legacy.xp,70);assert.equal(legacy.version,2);assert.equal(legacy.coins,0);
  assert.deepEqual(legacy.completed,['travel-words']);assert.deepEqual(legacy.awarded,{'travel-01':true});
  assert.deepEqual(legacy.history,{'2026-01-01':{answers:3}});assert.equal(legacy.words['go-01'].level,2);assert.equal(legacy.sound,false);assert.equal(legacy.owned,3);
  checks.push('Migration preserves XP, answers, lessons, history, word schedules and sound.');

  const lesson=await page.evaluate(()=>{
   state=initial();state.sound=false;const l=CONTENT.lessons.find(l=>l.id==='travel-words')||CONTENT.lessons[0];
   window.__qaComplete(l.id,false);const wrong={coins:state.coins,xp:state.xp,mastered:lessonMastered(l),badges:Object.keys(state.badges).length};
   window.__qaComplete(l.id,true);const first={coins:state.coins,xp:state.xp,mastered:lessonMastered(l),tasks:l.tasks.length};
   window.__qaComplete(l.id,true);return {wrong,first,repeated:{coins:state.coins,xp:state.xp}};
  });
  assert.equal(lesson.wrong.coins,0);assert.equal(lesson.wrong.mastered,false);assert.equal(lesson.wrong.badges,0);
  assert.equal(lesson.first.mastered,true);assert.equal(lesson.first.xp,lesson.first.tasks*5);
  assert.equal(lesson.first.coins,10+(lesson.first.tasks>=10?5:0));
  assert.deepEqual(lesson.repeated,{coins:lesson.first.coins,xp:lesson.first.xp});
  checks.push('Mistakes earn no mastery rewards; corrections earn XP and 10 lesson coins once.');

  const daily=await page.evaluate(()=>{
   state=initial();state.sound=false;session=null;flash=null;
   for(let i=0;i<50;i++)recordAnswer('task:same',true);
   const duplicate={count:todayCount(),coins:state.coins};
   for(let i=0;i<9;i++)recordAnswer('task:unique-'+i,true);
   const reached={count:todayCount(),coins:state.coins};
   for(let i=0;i<50;i++)recordAnswer('task:unique-'+i,true);
   return {duplicate,reached,afterMore:state.coins};
  });
  assert.deepEqual(daily.duplicate,{count:1,coins:0});assert.deepEqual(daily.reached,{count:10,coins:5});assert.equal(daily.afterMore,5);
  checks.push('Daily goal requires 10 different successful actions and pays once.');

  const review=await page.evaluate(()=>{
   state=initial();state.sound=false;session=null;flash=null;const id=CONTENT.words[0].id;
   state.words[id]={level:0,seen:1,due:Date.now()-1,difficult:true};
   startReview([id]);rate(true);const unrevealed=state.coins;flash.revealed=true;rate(true);const first=state.coins;
   state.words[id].difficult=true;state.words[id].due=Date.now()-1;startReview([id]);flash.revealed=true;rate(true);const repeated=state.coins;
   const other=CONTENT.words[1].id,due=Date.now()+86400000;state.words[other]={level:2,seen:3,due,difficult:true};startReview([other]);flash.revealed=true;rate(true);
   const early={coins:state.coins,level:state.words[other].level,dueUnchanged:state.words[other].due===due};
   rate(true);return {unrevealed,first,repeated,early,seenAfterSecondClick:state.words[other].seen};
  });
  assert.equal(review.unrevealed,0);assert.equal(review.first,2);assert.equal(review.repeated,2);
  assert.deepEqual(review.early,{coins:2,level:2,dueUnchanged:true});assert.equal(review.seenAfterSecondClick,4);
  checks.push('Difficult due word pays 2 coins once/day; early/unrevealed/double actions do not farm.');

  const shop=await page.evaluate(()=>{
   state=initial();state.sound=false;session=null;flash=null;currentTab='profile';profileView='shop';
   buyCosmetic('avatar-rocket');const insufficient={coins:state.coins,owned:state.cosmetics.owned.includes('avatar-rocket')};
   state.coins=100;buyCosmetic('avatar-rocket');const first={coins:state.coins,avatar:state.cosmetics.equipped.avatar};
   buyCosmetic('avatar-rocket');save();return {insufficient,first,repeated:state.coins};
  });
  assert.deepEqual(shop.insufficient,{coins:0,owned:false});assert.deepEqual(shop.first,{coins:60,avatar:'avatar-rocket'});assert.equal(shop.repeated,60);
  await page.reload();
  const persisted=await page.evaluate(()=>({coins:state.coins,avatar:state.cosmetics.equipped.avatar,owned:state.cosmetics.owned.includes('avatar-rocket')}));
  assert.deepEqual(persisted,{coins:60,avatar:'avatar-rocket',owned:true});
  checks.push('Shop checks funds, charges once and persists the equipped cosmetic.');

  for(const tab of ['home','course','words','profile']){
   await page.evaluate(tab=>{currentTab=tab;render()},tab);
   assert(await page.locator('h1').count()>0);
   const width=await page.evaluate(()=>document.documentElement.scrollWidth);
   assert(width<=390,tab+' overflows 390 px');
  }
  for(const view of ['badges','shop']){
   await page.evaluate(view=>{currentTab='profile';profileView=view;profile()},view);
   assert(await page.locator(view==='badges'?'.badge-card':'.shop-card').count()>0);
  }
  await page.setViewportSize({width:360,height:800});
  for(const view of ['progress','badges','shop']){
   await page.evaluate(view=>{profileView=view;profile()},view);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth)<=360,view+' overflows 360 px');
  }
  const bridge=await page.evaluate(()=>{
   const calls=[];window.AndroidSpeech={speak:t=>calls.push(['normal',t]),speakSlow:t=>calls.push(['slow',t]),getStatus:()=>JSON.stringify({ready:true,available:true,source:'bundled'})};
   speak('Hello.');speak('Hello.',true);return {calls,status:speechStatus()};
  });
  assert.deepEqual(bridge.calls,[['normal','Hello.'],['slow','Hello.']]);assert.match(bridge.status,/Готова/);
  checks.push('All app views render at phone widths and native normal/slow speech routes correctly.');

  const badges=await page.evaluate(()=>{
   CONTENT.lessons=CONTENT.units.flatMap(u=>u.sections.map((s,i)=>({id:'qa-'+u.id+'-'+(i+1),unit:u.id,section:i+1,title:'QA section',pages:'1',icon:'book',wordIds:[],tasks:[{id:'qa-task-'+u.id+'-'+(i+1),type:'choice',en:'yes',ru:'да',answer:'да',options:['да','нет'],explanation:'Да',page:1}]})));
   state=initial();state.sound=false;session=null;flash=null;
   state.completed=CONTENT.lessons.map(l=>l.id);reconcileRewards();const incomplete=Object.keys(state.badges).length;
   for(const l of CONTENT.lessons)state.awarded[l.tasks[0].id]=true;
   reconcileRewards();const first=state.coins;reconcileRewards();
   return {incomplete,sections:CONTENT.lessons.length,badges:Object.keys(state.badges).length,units:Object.keys(state.badges).filter(id=>id.startsWith('unit-')).length,coins:state.coins,unchanged:first===state.coins};
  });
  assert.equal(badges.incomplete,0);assert.equal(badges.sections,22);assert.equal(badges.badges,26);assert.equal(badges.units,4);assert.equal(badges.coins,220);assert.equal(badges.unchanged,true);
  checks.push('22 mastered sections unlock 26 badges; merely completed wrong lessons do not.');
  assert.deepEqual(errors,[]);
  checks.push('No uncaught browser JavaScript errors.');
  const result={passed:true,metadata,checks};
  fs.mkdirSync(path.join(root,'tmp'),{recursive:true});
  fs.writeFileSync(path.join(root,'tmp','rewards-verification.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
 }finally{await context.close();await browser.close()}
}
main().catch(error=>{console.error(error);process.exitCode=1});

