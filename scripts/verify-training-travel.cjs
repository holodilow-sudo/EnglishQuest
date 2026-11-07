/* Isolated browser QA; no user browser profile, APK build or device installation. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.resolve(process.argv[2]||path.join(root,'work/training-review'));
fs.mkdirSync(out,{recursive:true});
const checks=[];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.goto(pathToFileURL(path.join(root,'app/index.html')).href);
  const initialize=()=>p.evaluate(()=>{CityTraining.pause();clearTimeout(toastTimer);document.querySelector('#toast').classList.remove('show');state=initial();state.sound=false;state.city={welcome:true};session=null;flash=null;currentTab='training';render()});
  const installAnswerHelper=()=>p.evaluate(()=>{
   window.answerPractice=(correct=true)=>{
    const a=CityTraining.current,q=CityTraining.questions.find(q=>q.id===a.ids[a.index]);
    if(q.type==='order'){
     if(correct){const used=new Set();a.answer=q.answer.replace(/[.!?,]/g,'').split(/\s+/).map(t=>{const i=q.tokens.findIndex((v,j)=>!used.has(j)&&v.toLowerCase()===t.toLowerCase());if(i<0)throw Error('Missing token '+t);used.add(i);return i})}
     else a.answer=[0];
    }else a.selected=a.options.findIndex(x=>correct?x===q.answer:x!==q.answer);
    CityTraining.check();if(a.correct!==correct)throw Error('Answer check mismatch '+q.id);
   };
  });
  await initialize();await installAnswerHelper();
  const counts=await p.evaluate(()=>{
   const t=TravelContent;
   for(const topic of t.topics){if(topic.phrases.length!==10)throw Error('Phrase count');for(const p of topic.phrases)if(!p.en||!p.ru||!p.situation)throw Error('Missing phrase field')}
   for(const q of t.tasks){if(!q.explanation)throw Error('No explanation');if(q.type!=='order'&&(new Set(q.options).size!==4||q.options.filter(x=>x===q.answer).length!==1))throw Error('Ambiguous options '+q.id)}
   return {topics:t.topics.length,phrases:t.topics.flatMap(t=>t.phrases).length,tasks:t.tasks.length,unique:new Set(CityTraining.questions.map(q=>q.id)).size,total:CityTraining.questions.length};
  });
  assert.deepEqual({...counts,unique:undefined,total:undefined},{topics:20,phrases:200,tasks:600,unique:undefined,total:undefined});assert.equal(counts.unique,counts.total);
  checks.push('20 topics, 200 original phrases, 600 unique travel tasks; four distinct choices and one canonical answer.');
  const click=(name)=>p.locator(`[data-training="${name}"]`).first().click();
  await p.screenshot({path:path.join(out,'01-training.png')});
  await p.evaluate(()=>window.scrollTo(0,document.querySelector('.training-heading').getBoundingClientRect().top+scrollY-20));await p.screenshot({path:path.join(out,'07-settings.png')});await p.evaluate(()=>window.scrollTo(0,0));
  await p.locator('[data-training="count"][data-value="100"]').click();
  await click('start');
  assert.equal(await p.evaluate(()=>CityTraining.current.ids.length),100);
  assert.equal(await p.evaluate(()=>new Set(CityTraining.current.ids).size),100);
  assert(await p.evaluate(()=>CityTraining.current.ids.every(id=>CityTraining.questions.find(q=>q.id===id).type!=='order')));
  const first=await p.evaluate(()=>({id:CityTraining.current.ids[0],options:CityTraining.current.options}));
  const choice=await p.evaluate(()=>{const a=CityTraining.current,q=CityTraining.questions.find(q=>q.id===a.ids[0]);return a.options.indexOf(q.answer)});
  await p.locator(`[data-training="select"][data-index="${choice}"]`).click();
  assert.equal(await p.evaluate(()=>CityTraining.current.score),1);
  const xp=await p.evaluate(()=>state.xp);await p.evaluate(()=>CityTraining.check());assert.equal(await p.evaluate(()=>state.xp),xp);
  await p.reload();await installAnswerHelper();
  await p.locator('[data-action="tab"][data-value="training"]').click();await click('resume');
  assert.deepEqual(await p.evaluate(()=>({id:CityTraining.current.ids[0],options:CityTraining.current.options})),first);
  assert.equal(await p.evaluate(()=>CityTraining.current.checked),true);
  assert.equal(await p.evaluate(()=>CityTraining.current.score),1);
  await click('next');
  await p.evaluate(()=>{while(CityTraining.current){answerPractice();CityTraining.next()}});
  assert.equal(await p.evaluate(()=>state.training.lastRun.total),100);
  assert.equal(await p.evaluate(()=>state.training.lastRun.score),100);
  assert.deepEqual(await p.evaluate(()=>state.completed),[]);
  checks.push('100-question textbook blitz: actual one-tap checking, no duplicate questions, reload preserves shuffled options and checked state; no duplicate XP and no false textbook completion.');
  await initialize();await installAnswerHelper();
  const marathonTotal=await p.evaluate(()=>{CityTraining.begin({mode:'mixed',source:'textbook',count:'all'});return CityTraining.current.ids.length});
  for(let offset=0;offset<marathonTotal;offset+=50){
   await p.evaluate(()=>{for(let i=0;i<50&&CityTraining.current;i++){answerPractice();CityTraining.next()}});
   if(offset%500===0)console.log(`Marathon: ${Math.min(offset+50,marathonTotal)} / ${marathonTotal}`);
  }
  const textbookMarathon=await p.evaluate(()=>({total:state.training.lastRun.total,score:state.training.lastRun.score,completed:state.completed.length,xp:state.xp}));
  assert.deepEqual(textbookMarathon,{total:2585,score:2585,completed:0,xp:2585*5});
  checks.push('Entire 2,585-question textbook marathon passes through the new renderer and checker, including gaps, reverse translations and sentence assembly.');
  await initialize();await installAnswerHelper();
  const allTravel=await p.evaluate(()=>{
   CityTraining.begin({mode:'mixed',source:'travel',count:'all'});
   while(CityTraining.current){answerPractice();CityTraining.next()}
   return {xp:state.xp,coins:state.coins,mastered:Object.keys(state.training.topics).length,score:state.training.lastRun.score,answers:state.training.answers};
  });
  assert.deepEqual(allTravel,{xp:3000,coins:205,mastered:20,score:600,answers:600});
  const repeated=await p.evaluate(()=>{
   CityTraining.begin({mode:'mixed',source:'travel',count:'all'});
   while(CityTraining.current){answerPractice();CityTraining.next()}
   return {xp:state.xp,coins:state.coins};
  });
  assert.deepEqual(repeated,{xp:3000,coins:205});
  checks.push('All 600 travel answers accepted, including all 200 sentence orders. 20 topic rewards and daily reward granted once; entire repeated course grants no extra XP or coins.');
  await initialize();await installAnswerHelper();
  await p.evaluate(()=>{CityTraining.begin({mode:'blitz',source:'travel',count:10});answerPractice(false);CityTraining.next();while(CityTraining.current){answerPractice();CityTraining.next()}});
  assert.equal(await p.evaluate(()=>CityTraining.available('errors','travel').length),1);
  assert.equal(await p.evaluate(()=>state.training.lastRun.score),9);
  await click('retry');assert.equal(await p.evaluate(()=>CityTraining.current.ids.length),1);
  await p.evaluate(()=>{answerPractice();CityTraining.next()});
  assert.equal(await p.evaluate(()=>CityTraining.available('errors','travel').length),0);
  assert.equal(await p.evaluate(()=>state.xp),50);
  checks.push('Mistakes persist, exact failed questions can be retried, corrected questions leave the error pool, and previously missed XP is earned once.');
  await initialize();await installAnswerHelper();
  const scheduling=await p.evaluate(()=>{
   const q=TravelContent.tasks[0];CityTraining.begin({mode:'mixed',source:'travel',ids:[q.id],count:1});answerPractice();CityTraining.next();
   const first={...state.training.tasks[q.id]};CityTraining.begin({mode:'mixed',source:'travel',ids:[q.id],count:1});answerPractice();CityTraining.next();
   const second={...state.training.tasks[q.id]};state.training.tasks[q.id].due=Date.now()-1;
   return {first,second,firstReview:CityTraining.available('review','travel')[0].id,id:q.id};
  });
  assert.equal(scheduling.first.due,scheduling.second.due);assert.equal(scheduling.first.level,scheduling.second.level);assert.equal(scheduling.firstReview,scheduling.id);
  checks.push('Early replays neither postpone due dates nor advance memory levels; due questions appear first in review.');
  await initialize();await installAnswerHelper();
  await p.locator('[data-action="tab"][data-value="travel"]').click();
  await p.screenshot({path:path.join(out,'02-travel.png')});
  await p.locator('#travel-search').fill('аллергия');assert((await p.locator('#travel-phrases .travel-phrase').count())>=2);
  await p.locator('#travel-search').fill('window seat');assert.equal(await p.locator('#travel-phrases .travel-phrase').count(),1);
  await p.locator('#travel-search').fill('no-such-phrase-xyz');assert.equal(await p.locator('#travel-phrases .travel-phrase').count(),0);
  await p.locator('#travel-search').fill('');
  await p.evaluate(()=>{window.__spoken=[];window.AndroidSpeech={speak:t=>window.__spoken.push(['normal',t]),speakSlow:t=>window.__spoken.push(['slow',t]),stop:()=>window.__spoken.push(['stop'])}});
  await p.locator('.travel-topic details').first().locator('summary').click();
  await p.locator('.travel-topic [data-training="speak"]').first().click();await p.locator('.travel-topic [data-training="slow"]').first().click();
  assert.deepEqual((await p.evaluate(()=>window.__spoken)).slice(-2),[['normal','Hello! My name is Alex.'],['slow','Hello! My name is Alex.']]);
  checks.push('Phrasebook search works in Russian and English; normal/slow speech buttons send the correct phrase to the native bridge (device audio not asserted).');
  await p.evaluate(()=>{CityTraining.begin({mode:'mixed',source:'travel',count:1,ids:['trip-airport-07-situation'],title:'Аэропорт · жизненная ситуация'})});
  await p.screenshot({path:path.join(out,'03-situation.png'),fullPage:true});
  await p.evaluate(()=>answerPractice(false));
  await p.screenshot({path:path.join(out,'04-explanation.png'),fullPage:true});
  assert.equal(await p.evaluate(()=>CityIntegration.handleBack()),true);
  assert.equal(await p.locator('[data-training="resume"]').count(),1);
  assert((await p.evaluate(()=>window.__spoken)).some(x=>x[0]==='stop'));
  await p.locator('[data-training="topic"]').first().click();assert.equal(await p.locator('.modal').count(),1);
  await p.locator('.modal [data-training="resume"]').click();assert.equal(await p.evaluate(()=>CityTraining.current.ids[0]),'trip-airport-07-situation');
  checks.push('Android back pauses practice and stops speech. Starting another run asks to replace the saved series; Resume retains it.');
  await p.evaluate(()=>{CityTraining.begin({mode:'mixed',source:'travel',count:1,ids:['trip-hotel-04-build'],title:'Отель · собираем фразу'})});
  const token=await p.evaluate(()=>CityTraining.current.tokens[0]);
  await p.locator(`[data-training="pick"][data-index="${token}"]`).click();
  await p.reload();await installAnswerHelper();await p.locator('[data-action="tab"][data-value="training"]').click();await click('resume');
  assert.deepEqual(await p.evaluate(()=>CityTraining.current.answer),[token]);
  await p.locator('[data-training="unpick"]').first().click();assert.deepEqual(await p.evaluate(()=>CityTraining.current.answer),[]);
  await p.screenshot({path:path.join(out,'05-sentence.png'),fullPage:true});
  await p.evaluate(()=>answerPractice());await click('next');
  assert.equal(await p.locator('[data-city="share"]').count(),1);
  await p.screenshot({path:path.join(out,'06-result.png'),fullPage:true});
  await p.locator('[data-city="share"]').click();
  assert(await p.evaluate(()=>CityShare.isOpen()));await p.evaluate(()=>CityShare.close());
  checks.push('Partially assembled sentences survive reload and can be edited; result screen retains the father reminder and opens the existing share card.');
  for(const width of [360,390,430]){
   await p.setViewportSize({width,height:844});
   for(const tab of ['home','training','travel','course','words','profile']){
    await p.evaluate(tab=>{currentTab=tab;render()},tab);
    assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${tab}: page overflow at ${width}`);
    assert(await p.evaluate(()=>[...document.querySelectorAll('.training-tabs,.training-config,.travel-topic,.training-modes')].every(el=>el.scrollWidth<=el.clientWidth+1)),`${tab}: component overflow at ${width}`);
   }
   await p.evaluate(()=>{CityTraining.begin({mode:'mixed',source:'travel',count:1,ids:['trip-diet-08-situation']})});
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  checks.push('Home, both new sections, original navigation and long question text fit 360, 390 and 430 px screens.');
  await p.setViewportSize({width:390,height:844});await initialize();
  await p.evaluate(()=>{currentTab='home';render()});await p.screenshot({path:path.join(out,'00-home.png')});
  assert.deepEqual(errors,[]);
  checks.push('No browser JavaScript errors.');
  fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify({status:'passed',counts,checks,limitations:['No APK built or installed.','Speech bridge routing tested; actual new audio and native messenger chooser need device validation.'],date:new Date().toISOString()},null,2));
  console.log(JSON.stringify({status:'passed',checks:checks.length,counts,out}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
