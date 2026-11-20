const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/textbook-review');fs.mkdirSync(out,{recursive:true});
const loaded=require('./load-content.cjs')(root),{content,study,pages}=loaded;
const original=vm.runInNewContext(fs.readFileSync(path.join(root,'app/content.js'),'utf8')+';CONTENT;');
const json=x=>JSON.parse(JSON.stringify(x));
assert.deepEqual(json(content.lessons.slice(0,original.lessons.length)),json(original.lessons));
assert.deepEqual(json(content.words.slice(0,original.words.length)),json(original.words));
const ids=study.materials.map(m=>m.id);assert.equal(new Set(ids).size,ids.length);
for(const m of study.materials){assert(m.unit>=1&&m.unit<=4);assert(m.section>=1&&m.section<=content.units[m.unit-1].sections.length);assert(m.page>=1&&m.page<=pages.pageCount);for(const l of m.lines){assert(l.en&&l.ru,m.id);assert(!/undefined|NaN/.test(l.en+l.ru),m.id)}}
assert.equal(study.materials.find(m=>m.id==='host-70').lines.length,4);
assert.equal(study.materials.find(m=>m.id==='host-59').lines.length,20);
for(const p of pages.pages)assert(fs.statSync(path.join(root,'app',p.file)).size>1000);
for(const u of content.units)u.sections.forEach((_,i)=>assert(study.materials.some(m=>m.unit===u.id&&m.section===i+1),`Missing study material ${u.id}.${i+1}`));
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await ctx.newPage();
 const errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
 try{
  await p.goto(pathToFileURL(path.join(root,'app/index.html')).href);
  await p.evaluate(()=>{state=initial();state.city={welcome:true};state.sound=false;state.xp=75;state.coins=27;state.awarded['travel-01']=true;state.completed=['travel-words'];state.words['travel-01']={level:3,due:123456,seen:4,difficult:false};save();currentTab='course';courseUnit=1;courseSection=4;render()});
  const before=await p.evaluate(()=>({xp:state.xp,coins:state.coins,awarded:state.awarded,completed:state.completed,words:state.words}));
  await p.locator('[data-textbook="section"]').click();assert(await p.getByRole('heading',{name:'A Host Family',exact:true}).count());
  await p.screenshot({path:path.join(out,'01-host-family.png'),fullPage:false});
  await p.locator('[data-textbook="material"][data-id="host-59"]').click();
  assert.equal(await p.locator('.tb-line').count(),20);
  assert.equal(await p.locator('.tb-translation[open]').count(),0);
  await p.locator('.tb-translation summary').first().click();assert(await p.getByText('Привет, мама! Как дела?',{exact:true}).isVisible());
  await p.screenshot({path:path.join(out,'02-dialogue.png')});
  await p.locator('#tb-role').selectOption('Melissa');assert.equal(await p.locator('.tb-my-role').count(),10);
  assert.equal(await p.locator('.tb-my-role .tb-recall[open]').count(),0);
  await p.locator('.tb-my-role summary').first().click();assert(await p.locator('.tb-my-role p[lang=en]').first().isVisible());
  await p.evaluate(()=>{window.testSpeech=[];window.AndroidSpeech={speak:t=>testSpeech.push(t),speakSlow:t=>testSpeech.push('slow:'+t),stop(){}}});
  await p.locator('.tb-my-role [data-textbook=speak]').first().click();assert.equal(await p.evaluate(()=>testSpeech[0]),'Hi, Mum! How are you?');
  await p.screenshot({path:path.join(out,'03-role.png')});
  await p.locator('[data-textbook=read]').click();
  await p.locator('[data-textbook=page]').click();await p.locator('.tb-page-image img').evaluate(img=>img.decode());
  assert.equal(await p.locator('#tb-page').inputValue(),'25');
  await p.locator('[data-textbook=zoom]').click();assert(await p.locator('.tb-page-image').evaluate(e=>e.scrollWidth>e.clientWidth));
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.locator('[data-textbook=zoom]').click();await p.screenshot({path:path.join(out,'04-original-page.png')});
  await p.locator('#tb-page').fill('212');await p.locator('[data-textbook=jump]').click();assert(await p.locator('[data-textbook=next]').isDisabled());
  await p.evaluate(()=>Textbook.open());await p.locator('#tb-search').fill('A Host Family');assert.equal(await p.locator('[data-textbook=section]').count(),1);
  await p.locator('#tb-search').fill('hospitable');assert(await p.locator('[data-textbook=material]').count());
  for(const width of [320,360,430]){await p.setViewportSize({width,height:844});await p.evaluate(()=>Textbook.openMaterial('host-59'));assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await p.setViewportSize({width:390,height:844});await p.reload();
  assert.equal(await p.evaluate(()=>state.textbook.read['host-59']),true);
  assert.deepEqual(await p.evaluate(()=>({xp:state.xp,coins:state.coins,awarded:state.awarded,completed:state.completed,words:state.words})),before);
  // Exercise renderer/checker end to end, all newly added questions, no duplicate rewards.
  const completed=await p.evaluate(()=>{
    let n=0;for(const l of CONTENT.lessons.filter(l=>l.id.startsWith('tb-'))){start(l.id);for(let i=0;i<l.tasks.length;i++){session.index=i;session.checked=false;session.correct=false;const q=session.lesson.tasks[i];session.selected=q.options.indexOf(q.answer);check();if(!session.correct)throw Error(q.id);const xp=state.xp;check();if(state.xp!==xp)throw Error('duplicate reward');n++}}
    session=null;currentTab='textbook';cityScreen='textbook';Textbook.openSection(1,4);return n;
  });
  const expected=content.lessons.filter(l=>l.id.startsWith('tb-')).reduce((n,l)=>n+l.tasks.length,0);assert.equal(completed,expected);
  await p.locator('[data-textbook=blitz]').click();
  const run=await p.evaluate(()=>({ids:CityTraining.current.ids,expected:CONTENT.lessons.filter(l=>l.unit===1&&l.section===4).flatMap(l=>l.tasks).filter(q=>q.type!=='order').map(q=>q.id)}));
  assert.deepEqual([...run.ids].sort(),[...run.expected].sort());assert.equal(new Set(run.ids).size,run.ids.length);
  await p.evaluate(()=>CityTraining.pause());await p.reload();assert.deepEqual(await p.evaluate(()=>state.training.active.ids),run.ids);
  await p.evaluate(()=>Textbook.openSection(1,4));await p.locator('[data-textbook=blitz]').click();assert(await p.getByRole('heading',{name:'Начать блиц по этой теме?'}).isVisible());await p.locator('[data-action=dismiss]').click();
  await p.evaluate(()=>Textbook.open());await p.locator('#tb-search').fill('');await p.screenshot({path:path.join(out,'05-library.png')});
  assert.equal(await p.evaluate(()=>Textbook.ranges.length),22);
  assert.equal(errors.length,0,errors.join('\n'));assert.equal(requests.length,0,'Offline study must not make network requests');
  const report={passed:true,pages:pages.pageCount,materials:study.materials.length,lines:study.materials.reduce((n,m)=>n+m.lines.length,0),newQuestionsChecked:completed,oldContentUnchanged:true,readingPreservesProgress:true,offline:true,narrowWidths:[320,360,430],errors};
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
