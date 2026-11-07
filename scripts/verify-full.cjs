const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'preview/full');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const p=await context.newPage(),errors=[],checks=[];
 p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.goto(pathToFileURL(path.join(root,'app/index.html')).href);
  await p.evaluate(()=>{state=initial();state.sound=false;save();render()});
  const ids=await p.evaluate(()=>CONTENT.lessons.map(l=>l.id));
  const totals=await p.evaluate(()=>({words:CONTENT.words.length,lessons:CONTENT.lessons.length,tasks:CONTENT.lessons.reduce((n,l)=>n+l.tasks.length,0),sections:CONTENT.units.reduce((n,u)=>n+u.sections.length,0)}));
  assert.equal(totals.sections,22);
  for (const id of ids) {
   const result=await p.evaluate(id=>{
    start(id);const issues=[];
    const count=session.lesson.tasks.length;
    for(let i=0;i<count;i++){
     const q=session.lesson.tasks[session.index];
     if(q.type==='order'){
      const used=new Set();session.answer=q.answer.replace(/[.!?,]/g,'').split(/\s+/).map(word=>{
       const index=q.tokens.findIndex((t,j)=>!used.has(j)&&t.toLowerCase()===word.toLowerCase());
       if(index<0)throw Error(q.id+': missing token '+word);used.add(index);return index;
      });
      for(const variant of q.accepted||[]) if(![q.answer,...q.accepted].some(a=>normalize(a)===normalize(variant)))issues.push(q.id+': alternative rejected');
     }else session.selected=q.options.indexOf(q.answer);
     check();if(!session.correct)issues.push(q.id+': canonical answer rejected');next();
    }
    return {issues,mastered:lessonMastered(CONTENT.lessons.find(l=>l.id===id))};
   },id);
   assert.deepEqual(result.issues,[]);assert(result.mastered,id+': mastery');
  }
  checks.push('Every actual lesson and canonical exercise answer completes successfully');
  const alternatives=await p.evaluate(()=>{
   let tested=0;
   for(const l of CONTENT.lessons)for(let i=0;i<l.tasks.length;i++)for(const answer of l.tasks[i].accepted||[]){
    start(l.id);session.index=i;const q=l.tasks[i],used=new Set();
    session.answer=answer.replace(/[.!?,]/g,'').split(/\s+/).map(word=>{const j=q.tokens.findIndex((t,k)=>!used.has(k)&&t.toLowerCase()===word.toLowerCase());if(j<0)throw Error(q.id+': missing alternative token '+word);used.add(j);return j});
    check();if(!session.correct)throw Error(q.id+': rejected alternative '+answer);tested++;
   }
   return tested;
  });
  checks.push(alternatives+' alternative sentence orders pass through the actual answer checker');
  const earned=await p.evaluate(()=>({xp:state.xp,coins:state.coins,badges:Object.keys(state.badges).length,completed:state.completed.length}));
  assert.equal(earned.xp,totals.tasks*5);assert.equal(earned.coins,totals.lessons*10+5);assert.equal(earned.badges,26);assert.equal(earned.completed,totals.lessons);
  await p.reload();
  assert.deepEqual(await p.evaluate(()=>({xp:state.xp,coins:state.coins,badges:Object.keys(state.badges).length,completed:state.completed.length})),earned);
  checks.push('Full-course mastery: correct XP, coins, 22 topic and 4 unit badges; retained after reload');
  await p.evaluate(()=>{reconcileRewards();reconcileRewards();save()});
  assert.equal(await p.evaluate(()=>state.coins),earned.coins);
  checks.push('Reconciling all rewards cannot award them again');
  await p.evaluate(()=>{state=initial();state.sound=false;session=null;flash=null;currentTab='home';save();render()});
  const click=(action,value)=>p.locator('[data-action="'+action+'"]'+(value===undefined?'':'[data-value="'+value+'"]')).first().click();
  for(const [tab,file] of [['home','01-home'],['course','02-course'],['words','03-words'],['profile','04-profile']]){
   await click('tab',tab);await p.screenshot({path:path.join(out,file+'.png')});
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),tab+': overflow');
  }
  await click('tab','words');
  await p.locator('#word-search').fill('рюкзак');
  assert((await p.locator('.vocab-card').count())>0);
  await p.locator('#word-search').fill('zzzzznoresults');
  assert.equal(await p.locator('.vocab-card').count(),0);
  await p.locator('#word-search').fill('');
  await p.locator('#vocab-unit').selectOption('4');
  assert((await p.locator('.vocab-card').count())>=10);
  checks.push('Real vocabulary search and unit filters work');
  await p.setViewportSize({width:360,height:800});
  for(const tab of ['home','course','words','profile']){await click('tab',tab);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),tab+' 360px overflow')}
  checks.push('360px and 390px phone layouts have no horizontal overflow');
  await p.evaluate(()=>{currentTab='home';render();start(CONTENT.lessons.find(l=>l.tasks.some(q=>q.type==='order')).id);session.index=session.lesson.tasks.findIndex(q=>q.type==='order');renderQuestion()});
  await p.screenshot({path:path.join(out,'05-sentence.png')});
  await click('hint');assert((await p.locator('.hint-text').innerText()).length>0);
  const token0=await p.evaluate(()=>session.lesson.tasks[session.index].tokens[0]);
  await click('pick',0);assert.match(await p.locator('.answer-tray').innerText(),new RegExp(token0.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  await click('unpick',0);assert.equal(await p.locator('.answer-tray .word-chip').count(),0);
  checks.push('Sentence buttons and hints are interactive');
  assert.deepEqual(errors,[]);
  const report={passed:true,totals,earned,checks,errors};
  fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
