/* Isolated synthetic progress; never uses the user's browser profile. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/practice-review');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(pathToFileURL(path.join(root,'app/index.html')).href);
  await page.evaluate(()=>{state=initial();state.city={welcome:true};state.sound=false;save();currentTab='home';render()});
  await page.locator('.tabbar [data-value="training"]').click();
  assert.equal(await page.locator('.practice-card').count(),4);
  assert.equal(await page.locator('.tabbar [aria-current="page"]').textContent(),'Практика');
  await page.locator('[data-training="course-blitz"]').click();
  assert.match(await page.locator('#toast').textContent(),/Сначала пройди/);
  assert.equal(await page.evaluate(()=>!!CityTraining.current),false);
  const stats=await page.evaluate(()=>{
   const check=(value,message)=>{if(!value)throw Error(message)};
   const p=PracticeQueue;
   for(let n=0;n<50;n++){
    const spread=p.spread(p.shuffle([1,1,1,1,2,2,3,3,4,4]),x=>x);
    check(spread.every((x,i)=>!i||x!==spread[i-1]),'Frequent group repeats at tail');
   }
   const lesson=CONTENT.lessons.find(l=>l.tasks.filter(p.isTranslation).length>=4&&l.tasks.some(q=>q.reverse));
   state.completed=[lesson.id];state.rewardLedger.lessons[lesson.id]=true;state.xp=135;state.coins=17;
   for(const q of lesson.tasks){state.awarded[q.id]=true;if(q.wordId)learnWord(q.wordId)}
   const learned=CityTraining.available('blitz','learned');
   check(learned.length>0&&learned.every(q=>q.lessonId===lesson.id||(q.wordId&&state.words[q.wordId])),'Unknown questions in course blitz');
   for(const q of CityTraining.questions)state.training.tasks[q.id]={seen:1,level:0,due:Date.now()-1000,difficult:true};
   for(const mode of ['blitz','review','errors','build'])for(const source of ['textbook','travel','all']){
    const pool=CityTraining.available(mode,source);
    check(new Set(pool.map(p.taskKey)).size===pool.length,mode+' has semantic duplicates');
   }
   const all=CityTraining.available('mixed','all');
   check(all.length===CityTraining.questions.length,'Full marathon lost tasks');
   check(all.every((q,i)=>!i||p.taskKey(q)!==p.taskKey(all[i-1])),'Mirrored tasks adjacent in mixed practice');
   const pairMap=new Map();let duplicates;
   for(const w of CONTENT.words){const key=p.wordKey(w);if(pairMap.has(key)){duplicates=[pairMap.get(key),w];break}pairMap.set(key,w)}
   startReview(duplicates.map(w=>w.id));check(flash.queue.length===1,'Duplicate word cards');
   // Dictionary filters remain effective even when other words are overdue.
   currentTab='words';vocabUnit=1;vocabSection=1;searchTerm='';vocabFilter='all';startReview();
   check(flash.queue.every(w=>wordLocation(w).unit===1&&wordLocation(w).section===1),'Review escaped section filter');
   start(lesson.id);
   check(session.lesson.tasks.length===lesson.tasks.length,'Lesson tasks removed');
   check(session.lesson.tasks.every((q,i,a)=>!i||p.taskKey(q)!==p.taskKey(a[i-1])),'Mirrored lesson questions adjacent');
   CityTraining.begin({mode:'blitz',source:'learned',count:10});
   const a=CityTraining.current,q=CityTraining.questions.find(q=>q.id===a.ids[0]);
   a.selected=a.options.indexOf(q.answer);CityTraining.check();CityTraining.pause();save();
   return {ids:[...a.ids],index:a.index,checked:a.checked,options:[...a.options],xp:state.xp,coins:state.coins,completed:[...state.completed],words:JSON.stringify(state.words),tasks:all.length};
  });
  await page.reload();
  const restored=await page.evaluate(()=>{const a=CityTraining.current;return {ids:a.ids,index:a.index,checked:a.checked,options:a.options,xp:state.xp,coins:state.coins,completed:state.completed,words:JSON.stringify(state.words),tasks:CityTraining.questions.length}});
  assert.deepEqual(restored,stats);
  await page.evaluate(()=>{CityTraining.pause();state.training.active=null;currentTab='training';render()});
  await page.locator('[data-training="build"]').click();
  assert(await page.evaluate(()=>CityTraining.current.ids.every(id=>CityTraining.questions.find(q=>q.id===id).type==='order')));
  await page.locator('[data-training="pause"]').click();
  for(const width of [320,360,390,430]){
   await page.setViewportSize({width,height:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow at '+width);
   const sizes=await page.locator('.practice-card').evaluateAll(nodes=>nodes.map(n=>({w:n.clientWidth,h:n.clientHeight,overflow:n.scrollWidth>n.clientWidth+1})));
   assert(sizes.every(s=>s.w>=44&&s.h>=44&&!s.overflow));
  }
  fs.mkdirSync(out,{recursive:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(out,'practice.png')});
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify({passed:true,checks:['Four working entry cards and bottom navigation','Course blitz excludes unknown material','Semantic uniqueness in blitz, review, errors and build','Full curriculum and marathon task IDs retained','Repeated word cards and dictionary filters','Reload preserves active series and progress','320–430 px layouts'],date:new Date().toISOString()},null,2));
  console.log('Practice checks passed; '+stats.tasks+' tasks preserved.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
