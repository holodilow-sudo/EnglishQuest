/* Additive practice module. Original curriculum, reward IDs and storage origin stay intact. */
(() => {
  'use strict';
  const trip = window.TravelContent;
  const originalTasks = CONTENT.lessons.flatMap(l=>l.tasks.map(q=>({...q,lessonTitle:l.title})));
  const bank = [...originalTasks,...trip.tasks];
  const byId = new Map(bank.map(q=>[q.id,q]));
  let running = false, tick = 0, lastRun = null, timer = null;
  let settings = {mode:'blitz',source:'textbook',count:25};
  let travelSearch = '';
  const shuffle = items => {
    const result = [...items];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  };
  function data(){
    if(!state.training||typeof state.training!=='object'||Array.isArray(state.training))state.training={};
    const s=state.training;
    for(const key of ['tasks','topics'])if(!s[key]||typeof s[key]!=='object'||Array.isArray(s[key]))s[key]={};
    s.runs=Number(s.runs)||0;s.answers=Number(s.answers)||0;s.bestStreak=Number(s.bestStreak)||0;
    return s;
  }
  function active(){return data().active}
  function stopSpeech(){window.AndroidSpeech?.stop?.();window.speechSynthesis?.cancel()}
  function persist(){
    if(running&&active()&&!document.hidden){const now=performance.now();active().elapsedMs+=(now-tick);tick=now;}
    save();
  }
  function pause(){persist();running=false;clearInterval(timer);timer=null;stopSpeech()}
  function startTimer(){clearInterval(timer);timer=setInterval(()=>{const label=document.querySelector('[data-training-time]');if(running&&label&&!document.hidden)label.textContent=elapsed()},1000)}
  function available(mode=settings.mode,source=settings.source,topic=null){
    let pool=bank.filter(q=>source==='all'||(source==='travel'?q.travel:!q.travel));
    if(topic)pool=pool.filter(q=>q.topic===topic);
    if(mode==='blitz')pool=pool.filter(q=>q.type!=='order');
    if(mode==='errors')pool=pool.filter(q=>data().tasks[q.id]?data().tasks[q.id].difficult:(!q.travel&&q.wordId&&state.words[q.wordId]?.difficult));
    if(mode==='review')pool=pool.filter(q=>state.awarded[q.id]||data().tasks[q.id]||(!q.travel&&q.wordId&&state.words[q.wordId]));
    pool=shuffle(pool);
    if(mode==='review'||mode==='errors')pool.sort((a,b)=>{
      const aDue=(data().tasks[a.id]?.due??state.words[a.wordId]?.due??Infinity)<=Date.now();
      const bDue=(data().tasks[b.id]?.due??state.words[b.wordId]?.due??Infinity)<=Date.now();
      return Number(bDue)-Number(aDue);
    });
    return pool;
  }
  const action = (label,name,attrs='',style='primary')=>`<button class="${style}" data-training="${name}" ${attrs}>${label}</button>`;
  function shortcuts(){return '<div class="training-tabs" aria-label="Дополнительные разделы">'+[['training','bolt','Тренировки'],['travel','globe','Путешествия']].map(([id,ic,label])=>`<button data-action="tab" data-value="${id}" class="${currentTab===id?'active':''}" ${currentTab===id?'aria-current="page"':''}>${icon(ic,18)} ${label}</button>`).join('')+'</div>'}
  const coreShell=shell;
  shell=function(html){coreShell(html);document.querySelector('.topbar')?.insertAdjacentHTML('afterend',shortcuts())};
  const coreRender=render;
  render=function(){pause();if(currentTab==='training'){cityStop();cityScreen='training';hub();return}if(currentTab==='travel'){cityStop();cityScreen='travel';travel();return}coreRender()};
  function resumeCard(){
    const a=active();if(!a?.ids?.length)return '';
    return `<section class="training-resume"><span class="eyebrow">СЕРИЯ СОХРАНЕНА</span><h3>${esc(a.title)}</h3><p>${a.index+(a.checked?1:0)} из ${a.ids.length} ответов · можно продолжить с того же места</p>${action('Продолжить серию '+icon('arrow',17),'resume')}</section>`;
  }
  function hub(){
    const s=data(),count=available().length;
    const modes=[['blitz','Блиц','Быстрый выбор ответа. Счётчик времени без ограничения.'],['mixed','Большая тренировка','Переводы, пропуски и сборка предложений.'],['review','Повторение','Знакомые задания; сначала те, которые пора вспомнить.'],['errors','Мои ошибки','Вопросы и слова, с которыми было трудно.']];
    shell(header()+`<section class="training-hero"><span class="eyebrow">ТРЕНИРОВОЧНЫЙ ЦЕНТР</span><h1>Ещё один<br>личный рекорд.</h1><p>Большие серии, быстрые ответы и уверенный английский.</p><div class="training-stats"><span><b>${s.runs}</b> серий</span><span><b>${s.answers}</b> ответов</span><span><b>${s.bestStreak}</b> подряд</span></div></section>`+resumeCard()+
      `<h2 class="training-heading">Выбери режим</h2><div class="training-modes">${modes.map(([id,title,description])=>`<button data-training="mode" data-value="${id}" class="training-mode ${settings.mode===id?'selected':''}" aria-pressed="${settings.mode===id}"><strong>${title}</strong><small>${description}</small></button>`).join('')}</div>
      <section class="training-config"><label for="training-source">Откуда вопросы</label><select id="training-source"><option value="textbook" ${settings.source==='textbook'?'selected':''}>Учебник Enjoy English 6</option><option value="travel" ${settings.source==='travel'?'selected':''}>Путешествия</option><option value="all" ${settings.source==='all'?'selected':''}>Всё вместе</option></select><p>Длина серии</p><div class="training-lengths">${[10,25,50,100,'all'].map(n=>action(n==='all'?'Все':n,'count',`data-value="${n}" aria-pressed="${settings.count===n}"`,settings.count===n?'selected':'')).join('')}</div><p class="muted">${count?`Доступно ${count} заданий. В серии — ${settings.count==='all'?count:Math.min(settings.count,count)}, без повторов.`:settings.mode==='errors'?'Ошибок пока нет. Пройди блиц или большую тренировку.':'Пока нет знакомых заданий. Начни с блица или учебной миссии.'}</p>${action('Начать тренировку '+icon('arrow',18),'start',count?'':'disabled')}<p class="training-note">Можно сделать паузу в любой момент. Серия сохранится.</p></section>
      <button class="lesson-tile" data-action="review"><span class="tile-art mint">${icon('card',24)}</span><span class="tile-copy"><strong>Карточки слов</strong><small>Вспомни перевод и послушай произношение</small></span>${icon('chevron',18)}</button>`);
  }
  function mastered(topic){return trip.tasks.filter(q=>q.topic===topic).every(q=>state.awarded[q.id])}
  function phraseList(){
    const query=travelSearch.trim().toLocaleLowerCase();
    const matches=trip.topics.flatMap(t=>t.phrases.map(p=>({...p,topic:t.title}))).filter(p=>!query||`${p.en} ${p.ru} ${p.topic}`.toLocaleLowerCase().includes(query));
    const container=document.getElementById('travel-phrases');if(!container)return;
    container.innerHTML=matches.length?matches.map(p=>`<article class="travel-phrase"><small>${esc(p.topic)}</small><strong>${esc(p.en)}</strong><p>${esc(p.ru)}</p><div>${action(icon('speaker',18)+' Слушать','speak',`data-id="${p.id}"`,'text-link')}${action('Медленно','slow',`data-id="${p.id}"`,'text-link')}</div></article>`).join(''):'<p class="muted">Не найдено. Попробуй другое слово по-русски или по-английски.</p>';
  }
  function travel(){
    shell(header()+`<section class="training-hero travel-hero"><span class="eyebrow">ГОРОД ОТКРЫВАЕТ МИР</span><h1>Английский<br>для путешествий.</h1><p>От первого полёта до обратной дороги. Понимай людей и объясняй, что тебе нужно.</p><div class="training-stats"><span><b>${trip.topics.length}</b> тем</span><span><b>${trip.topics.reduce((n,t)=>n+t.phrases.length,0)}</b> фраз</span><span><b>${trip.tasks.length}</b> заданий</span></div></section>`+resumeCard()+
      `<div class="travel-actions">${action('Блиц по всем темам','travel-blitz')}${action('Повторить ошибки','travel-errors','','primary light')}</div><p class="training-note">Авторский разговорный курс. В каждой теме: перевод, выбор фразы по ситуации и сборка предложения.</p><h2 class="training-heading">Маршрут путешественника</h2><div class="travel-topics">${trip.topics.map((t,i)=>{
        const done=trip.tasks.filter(q=>q.topic===t.id&&state.awarded[q.id]).length;
        return `<article class="travel-topic"><span class="travel-number">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(t.title)}</h3><p>${esc(t.description)}</p><small>${done} / 30 освоено${mastered(t.id)?' · '+icon('check',14):''}</small><div class="travel-topic-progress"><span style="width:${done/30*100}%"></span></div>${action(done?'Тренировать тему':'Начать миссию','topic',`data-id="${t.id}"`,'text-link')}<details><summary>10 полезных фраз</summary><p class="training-note">${esc(t.tip)}</p>${t.phrases.map(p=>`<div class="travel-mini-phrase"><strong>${esc(p.en)}</strong><p>${esc(p.ru)}</p>${action(icon('speaker',16)+' Слушать','speak',`data-id="${p.id}"`,'text-link')}${action('Медленно','slow',`data-id="${p.id}"`,'text-link')}</div>`).join('')}</details></div></article>`;
      }).join('')}</div><section class="travel-phrasebook"><h2>Карманный разговорник</h2><label for="travel-search">Найти фразу или тему</label><input id="travel-search" type="search" placeholder="Например: отель, вода, ticket" value="${esc(travelSearch)}"><p class="training-note">Фразы и задания доступны без интернета. Озвучка новых фраз использует английский голос устройства.</p><div id="travel-phrases"></div></section>`);
    phraseList();
  }
  function requestStart(config){
    if(active()){
      window.__trainingNext=config;
      openModal(`<div class="modal-top"><h2>Начать новую серию?</h2></div><p>Сохранённая серия будет заменена. Верные ответы, ошибки и награды останутся.</p><div class="actions">${action('Продолжить прежнюю','resume','','primary light')}${action('Начать новую','replace')}</div>`);return;
    }
    begin(config);
  }
  function begin(config={}){
    dismiss();pause();cityStop();session=null;flash=null;
    const mode=config.mode||settings.mode,source=config.source||settings.source,topic=config.topic||null;
    const count=config.count||settings.count;
    let questions=config.ids?config.ids.map(id=>byId.get(id)).filter(Boolean):available(mode,source,topic);
    if(!questions.length){toast(mode==='errors'?'Ошибок пока нет — можно начать новую тренировку.':'В этом режиме пока нет заданий.');return}
    questions=questions.slice(0,count==='all'?questions.length:Number(count));
    const title=config.title||(topic?trip.topics.find(t=>t.id===topic).title:({blitz:'Блиц',review:'Повторение',errors:'Работа над ошибками',mixed:'Большая тренировка'}[mode]));
    data().active={version:1,ids:questions.map(q=>q.id),index:0,mode,source,topic,title,selected:null,answer:[],checked:false,correct:false,score:0,streak:0,bestStreak:0,xp:0,coins:0,mistakes:[],elapsedMs:0,options:null,tokens:null};
    running=true;tick=performance.now();startTimer();cityScreen='training-run';screen();persist();
  }
  function resume(){
    dismiss();const a=active();if(!a)return;
    if(a.version!==1||!a.ids?.length||a.ids.some(id=>!byId.has(id))||a.index>=a.ids.length){data().active=null;save();toast('Эта серия устарела. Начни новую — знания и награды сохранены.');return}
    cityStop();stopSpeech();session=null;flash=null;running=true;tick=performance.now();startTimer();cityScreen='training-run';screen();
  }
  function elapsed(){const a=active();const seconds=Math.floor((a.elapsedMs+(running?performance.now()-tick:0))/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
  function screen(){
    const a=active();if(!a)return;
    const q=byId.get(a.ids[a.index]);
    if(q.type==='order'){if(!a.tokens)a.tokens=shuffle(q.tokens.map((_,i)=>i))}
    else if(!a.options)a.options=shuffle(q.options);
    const prompt=q.travel?q.prompt:q.type==='order'?'Собери предложение':q.type==='gap'?'Заполни пропуск':q.reverse?'Как сказать по-английски?':'Выбери перевод';
    const title=q.type==='order'?q.ru:q.display||q.en;
    const content=q.type==='order'?`<div class="answer-tray" aria-label="Твоё предложение">${a.answer.map((j,i)=>action(esc(q.tokens[j]),'unpick',`data-index="${i}" ${a.checked?'disabled':''}`,'word-chip in-answer')).join('')}</div><div class="word-bank">${a.tokens.map(j=>action(esc(q.tokens[j]),'pick',`data-index="${j}" ${a.checked||a.answer.includes(j)?'disabled':''}`,'word-chip')).join('')}</div>`:
      `<div class="options">${a.options.map((o,i)=>action(`<span class="letter">${String.fromCharCode(65+i)}</span>${esc(o)}`,'select',`data-index="${i}" ${a.checked?'disabled':''}`,`option ${a.selected===i?'selected':''} ${a.checked&&o===q.answer?'correct':''} ${a.checked&&a.selected===i&&!a.correct?'incorrect':''}`)).join('')}</div>`;
    const explanation=a.checked?`<div class="feedback ${a.correct?'':'bad'}" role="status"><div class="feedback-title">${icon(a.correct?'check':'bulb',20)}${a.correct?'Верно!':'Разберём вместе'}</div>${a.correct?'':`<p>Правильный ответ: <strong>${esc(q.answer)}</strong></p>`}<p>${esc(q.explanation||'')}</p>${q.travel?action(icon('speaker',18)+' Послушать фразу','question-speech','','text-link')+action('Медленно','question-slow','','text-link'):''}</div>`:'';
    const disabled=q.type==='order'?!a.answer.length:a.selected===null;
    $('#app').innerHTML=`<main class="lesson-screen training-question"><div class="backbar">${action(icon('close',24),'pause','aria-label="Сохранить серию и выйти"','icon-button')}<div class="lesson-progress" role="progressbar" aria-valuenow="${a.index}" aria-valuemin="0" aria-valuemax="${a.ids.length}"><span style="width:${a.index/a.ids.length*100}%"></span></div><span class="lesson-count">${a.index+1} / ${a.ids.length}</span></div><div class="training-run-stats"><span>${icon('clock',15)} <span data-training-time>${elapsed()}</span></span><span>${a.score} верно</span><span>${icon('bolt',15)} ${a.streak} подряд</span></div><p class="lesson-context">${esc(a.title)} · ${q.travel?'ПУТЕШЕСТВИЯ':esc(q.lessonTitle||'Учебник')}</p><h1>${esc(prompt)}</h1><div class="question-word"><div><strong>${esc(title)}</strong>${q.type==='gap'?`<p class="gap-translation">${esc(q.ru||'')}</p>`:''}</div>${!q.reverse&&q.type!=='order'&&q.type!=='gap'?action(icon('speaker',23),'question-speech','aria-label="Послушать"','speaker'):''}</div>${content}${explanation}<div class="lesson-bottom">${action(a.checked?(a.index+1===a.ids.length?'Завершить серию':'Дальше '+icon('arrow',18)):'Проверить',a.checked?'next':'check',!a.checked&&disabled?'disabled':'',`primary ${a.checked&&a.correct?'green':''}`)}<p class="footnote">${a.mode==='blitz'?'В блице ответ проверяется одним нажатием. Время не ограничено.':'Ошибка — повод потренироваться. Прогресс сохраняется после каждого ответа.'}</p></div></main>`;
    window.scrollTo(0,0);
  }
  function checkAnswer(){
    const a=active();if(!running||!a||a.checked)return;
    const q=byId.get(a.ids[a.index]);
    if(q.type==='order'?!a.answer.length:a.selected===null)return;
    const actual=q.type==='order'?a.answer.map(i=>q.tokens[i]).join(' '):a.options[a.selected];
    a.correct=q.type==='order'?[q.answer,...(q.accepted||[])].some(x=>normalize(x)===normalize(actual)):actual===q.answer;
    a.checked=true;
    const progress=data().tasks[q.id]||{seen:0,level:0};progress.seen++;progress.difficult=!a.correct;
    const previousCoins=state.coins;
    if(a.correct){
      a.score++;a.streak++;a.bestStreak=Math.max(a.bestStreak,a.streak);
      if(!state.awarded[q.id]){state.awarded[q.id]=true;state.xp+=5;a.xp+=5;}
      // Early replays must not advance spaced repetition or postpone an existing due date.
      if(!progress.due||progress.due<=Date.now()){progress.level=Math.min(progress.level+1,5);progress.due=Date.now()+[0,1,3,7,14,30][progress.level]*86400000;}
      window.CitySFX?.correct();
    }else{
      a.streak=0;a.mistakes.push(q.id);progress.level=0;progress.due=Date.now()+600000;
      if(q.wordId)markDifficult(q.wordId);
    }
    data().tasks[q.id]=progress;data().answers++;data().bestStreak=Math.max(data().bestStreak,a.bestStreak);
    if(q.wordId)learnWord(q.wordId);
    recordAnswer('task:'+q.id,a.correct);
    for(const topic of trip.topics)if(mastered(topic.id)&&!data().topics[topic.id]){data().topics[topic.id]={date:dayKey()};addCoins(10);}
    a.coins+=state.coins-previousCoins;
    persist();screen();
  }
  function nextQuestion(){
    const a=active();if(!running||!a?.checked)return;
    if(a.index+1===a.ids.length){complete();return}
    stopSpeech();a.index++;a.selected=null;a.answer=[];a.checked=false;a.correct=false;a.options=null;a.tokens=null;persist();screen();persist();
  }
  function complete(){
    pause();const a=active();if(!a)return;
    lastRun=JSON.parse(JSON.stringify(a));data().runs++;data().lastRun={title:a.title,total:a.ids.length,score:a.score,bestStreak:a.bestStreak,elapsedMs:a.elapsedMs,date:new Date().toISOString()};data().active=null;save();
    cityResult({title:a.title,kind:a.source==='travel'?'ПУТЕШЕСТВИЯ':'ТРЕНИРОВКА',correct:a.score,total:a.ids.length,xp:a.xp,coins:a.coins,mastered:a.score===a.ids.length,scoreLabel:'верных ответов в этой серии'});
    document.querySelector('.city-result-actions')?.insertAdjacentHTML('afterbegin',`${a.mistakes.length?action('Разобрать ошибки · '+a.mistakes.length,'retry','','primary light'):''}${action('Ещё одна серия','again','','primary light')}${action('К тренировкам','hub','','text-link')}`);
  }
  const coreBack=window.CityIntegration.handleBack;
  window.CityIntegration.handleBack=function(){
    if(window.CityShare?.isOpen?.())return coreBack();
    if(document.querySelector('.modal-shade')){dismiss();return true}
    if(running){pause();currentTab=active()?.source==='travel'?'travel':'training';render();return true}
    if(currentTab==='training'||currentTab==='travel'){currentTab='home';render();return true}
    return coreBack();
  };
  document.addEventListener('click',event=>{
    const b=event.target.closest('[data-training]');if(!b||b.disabled)return;
    const name=b.dataset.training,a=active(),q=a?byId.get(a.ids[a.index]):null;
    if(name==='mode'){settings.mode=b.dataset.value;hub()}
    else if(name==='count'){settings.count=b.dataset.value==='all'?'all':Number(b.dataset.value);hub()}
    else if(name==='start')requestStart({...settings});
    else if(name==='replace'){const config=window.__trainingNext;delete window.__trainingNext;begin(config)}
    else if(name==='resume')resume();
    else if(name==='topic')requestStart({mode:'mixed',source:'travel',topic:b.dataset.id,count:'all'});
    else if(name==='travel-blitz'){settings={mode:'blitz',source:'travel',count:50};currentTab='training';render()}
    else if(name==='travel-errors'){settings={mode:'errors',source:'travel',count:25};currentTab='training';render()}
    else if(name==='pause'){pause();currentTab=a?.source==='travel'?'travel':'training';render()}
    else if(name==='select'&&running&&a&&!a.checked){a.selected=Number(b.dataset.index);if(a.mode==='blitz')checkAnswer();else{persist();screen()}}
    else if(name==='pick'&&running&&a&&!a.checked){const i=Number(b.dataset.index);if(!a.answer.includes(i))a.answer.push(i);persist();screen()}
    else if(name==='unpick'&&running&&a&&!a.checked){a.answer.splice(Number(b.dataset.index),1);persist();screen()}
    else if(name==='check')checkAnswer();
    else if(name==='next')nextQuestion();
    else if(name==='question-speech'||name==='question-slow'){
      if(q)speak(q.speechText||q.en||q.answer,name==='question-slow');
    }else if(name==='speak'||name==='slow'){
      const phrase=trip.topics.flatMap(t=>t.phrases).find(p=>p.id===b.dataset.id);if(phrase)speak(phrase.en,name==='slow');
    }else if(name==='retry'&&lastRun)begin({mode:'mixed',source:lastRun.source,count:'all',ids:[...new Set(lastRun.mistakes)],title:'Разбор ошибок'});
    else if(name==='again'&&lastRun)begin({mode:lastRun.mode,source:lastRun.source,topic:lastRun.topic,count:lastRun.ids.length});
    else if(name==='hub'){currentTab='training';render()}
  });
  document.addEventListener('change',e=>{if(e.target.id==='training-source'){settings.source=e.target.value;hub()}});
  document.addEventListener('input',e=>{if(e.target.id==='travel-search'){travelSearch=e.target.value;phraseList()}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(running&&active())active().elapsedMs+=performance.now()-tick;save();stopSpeech()}tick=performance.now()});
  window.addEventListener('pagehide',()=>{persist();stopSpeech()});
  window.CityTraining={begin,resume,pause,available,check:checkAnswer,next:nextQuestion,screen,get current(){return active()},get questions(){return bank}};
  data();save();if(!cityShowingSplash)render();
})();
