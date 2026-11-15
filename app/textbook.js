/* Offline textbook reader, bilingual study and section-specific practice. */
(() => {
  'use strict';
  const data=window.TextbookStudy, book=window.TextbookPages;
  const ranges=[[1,1,6,12],[1,2,13,19],[1,3,20,23],[1,4,24,29],[1,5,30,36],[1,6,37,40],[2,1,50,55],[2,2,56,61],[2,3,62,69],[2,4,70,74],[3,1,84,89],[3,2,90,97],[3,3,98,105],[3,4,106,110],[3,5,111,116],[3,6,117,122],[3,7,123,131],[4,1,141,149],[4,2,150,157],[4,3,158,162],[4,4,163,171],[4,5,172,175]];
  let view={type:'library'}, stack=[], query='', role='', zoom=1;
  const button=(label,action,attrs='',cls='primary light')=>`<button class="${cls}" data-textbook="${action}" ${attrs}>${label}</button>`;
  const section=(u,s)=>sectionsFor(u).find(x=>x.id===Number(s));
  const range=(u,s)=>ranges.find(x=>x[0]===Number(u)&&x[1]===Number(s));
  const exerciseOrder=(a,b)=>(a.page-b.page)||String(a.exercise).localeCompare(String(b.exercise),'ru',{numeric:true});
  function progress(){state.textbook||={};state.textbook.read||={};return state.textbook}
  function stop(){window.AndroidSpeech?.stop?.();window.speechSynthesis?.cancel()}
  function go(next,push=true){stop();window.CityTraining?.pause();cityStop();dismiss();session=null;flash=null;if(push&&currentTab==='textbook')stack.push(view);else if(currentTab!=='textbook')stack=[];view=next;currentTab='textbook';cityScreen='textbook';draw();window.scrollTo(0,0)}
  function back(){stop();if(stack.length){view=stack.pop();draw();window.scrollTo(0,0)}else{currentTab='course';render()}}
  function head(title,sub){return `<div class="tb-head">${button('← Назад','back','','text-link')}<p class="eyebrow">ENJOY ENGLISH · 6 КЛАСС</p><h1>${esc(title)}</h1><p>${esc(sub)}</p></div>`}
  function pageButton(page,label='Открыть задание в учебнике'){return button(label,'page',`data-page="${page}"`)}
  function materialCard(m){return `<button class="lesson-tile" data-textbook="material" data-id="${m.id}"><span class="tile-art purple">${icon(m.kind==='dialogue'?'bubbles':'book',22)}</span><span class="tile-copy"><strong>${esc(m.title)}</strong><small>Упр. ${esc(m.exercise)} · стр. PDF ${m.page} · ${progress().read[m.id]?'прочитано':'текст и перевод'}</small></span>${icon('chevron',17)}</button>`}
  function library(){
    const q=query.trim().toLocaleLowerCase();
    const cards=ranges.filter(([u,s])=>{const t=section(u,s);return !q||(t.title+' '+t.ru+' '+u+'.'+s).toLocaleLowerCase().includes(q)}).map(([u,s,a,b])=>{const t=section(u,s),ms=data.materials.filter(m=>m.unit===u&&m.section===s);return `<button class="lesson-tile" data-textbook="section" data-unit="${u}" data-section="${s}"><span class="tile-art">${u}.${s}</span><span class="tile-copy"><strong>${esc(t.title)}</strong><small>${t.ru?esc(t.ru)+' · ':''}стр. PDF ${a}–${b}<br>Задания учебника${ms.length?' · '+ms.length+' материалов с переводом':''}</small></span>${icon('chevron',17)}</button>`}).join('');
    const found=q?data.materials.filter(m=>(m.title+' '+m.exercise+' '+m.lines.map(l=>l.en+' '+l.ru).join(' ')).toLocaleLowerCase().includes(q)).map(materialCard).join(''):'';
    shell(head('Учебник целиком','Все страницы вашего PDF, задания и иллюстрации — без интернета.')+`<label class="tb-search">Найти тему, реплику или номер упражнения<input id="tb-search" type="search" value="${esc(query)}" placeholder="A Host Family, homework…"></label><div id="tb-results">${cards||'<p class="muted">Темы не найдены.</p>'}${found?'<h2>В текстах и диалогах</h2>'+found:''}</div><section class="tb-panel"><h2>Другие страницы</h2><p>Домашние задания, проверочные работы, грамматика и словарь также включены. Номер PDF может отличаться от напечатанного на странице.</p>${pageButton(progress().lastPage||3,'Открыть книгу с закладки')}<div class="tb-actions">${pageButton(41,'Домашние задания Unit 1')}${pageButton(75,'Домашние задания Unit 2')}${pageButton(132,'Домашние задания Unit 3')}${pageButton(176,'Домашние задания Unit 4')}${pageButton(185,'Справочные страницы')}</div></section><p class="tb-note">В исходном PDF отсутствуют печатные страницы 175 (упражнения 98–99 Unit 4) и 207 (словарь). Эти пробелы отмечены в приложении. Тексты взяты из предоставленного издания 2019 года. Озвучка приложения синтезированная; оригинальные аудиозаписи издательства не входят в PDF.</p>`);
  }
  function topic(){
    const {unit:u,section:s}=view,t=section(u,s),r=range(u,s),ms=data.materials.filter(m=>m.unit===u&&m.section===s).sort(exerciseOrder),rs=data.rules.filter(m=>(m.unit||1)===u&&(m.section||4)===s).sort(exerciseOrder),as=data.activities.filter(m=>m.unit===u&&m.section===s).sort(exerciseOrder);
    const ls=CONTENT.lessons.filter(l=>unitOf(l)===u&&sectionOf(l)===s),words=[...new Set(ls.flatMap(l=>l.wordIds))];
    shell(head(t.title,`Unit ${u} · Section ${s}${t.ru?' · '+t.ru:''}`)+`<section class="tb-panel"><h2>Задания из книги</h2><p>Тексты, рисунки, таблицы и задания на страницах ${r[2]}–${r[3]} PDF.</p>${pageButton(r[2],'Читать раздел учебника')}<div class="tb-actions">${button('Блиц по этой теме','blitz',`data-unit="${u}" data-section="${s}"`)}${button('Повторить слова ('+words.length+')','words',`data-unit="${u}" data-section="${s}"`)}</div></section>${ms.length?'<h2>Читать · слушать · говорить</h2>'+ms.map(materialCard).join(''):''}${rs.length?'<h2>Разбираем правила</h2>'+rs.map(m=>`<section class="tb-panel"><p class="eyebrow">УПР. ${esc(m.exercise)}</p><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p>${m.examples.map(([en,ru])=>`<p lang="en">${esc(en)}</p><p class="tb-ru">${esc(ru)}</p>`).join('')}${pageButton(m.page,'Посмотреть правило в книге')}</section>`).join(''):''}${as.length?'<h2>Работаем по упражнениям</h2>'+as.map(m=>`<details class="tb-exercise"><summary><strong>${m.exercise}. ${esc(m.title)}</strong></summary><p>${esc(m.instruction)}</p>${pageButton(m.page)}<details class="tb-help"><summary>Подсказка и проверка</summary><p>${esc(m.help)}</p></details></details>`).join(''):''}<h2>Тренировки темы</h2>${ls.map(l=>`<button class="lesson-tile" data-action="start" data-value="${l.id}"><span class="tile-copy"><strong>${esc(l.title)}</strong><small>${l.tasks.length} заданий${lessonMastered(l)?' · освоено':''}</small></span>${icon('chevron',17)}</button>`).join('')}`);
  }
  function material(){
    const m=data.materials.find(x=>x.id===view.id);if(!m){go({type:'library'},false);return}
    const speakers=[...new Set(m.lines.map(l=>l.speaker).filter(Boolean))];
    shell(head(m.title,`Unit ${m.unit} · Section ${m.section} · упр. ${m.exercise} · стр. PDF ${m.page}`)+`<p>${esc(m.instruction)}</p>${m.note?'<p class="tb-note">'+esc(m.note)+'</p>':''}<section class="tb-panel"><label for="tb-role">Режим чтения</label><select id="tb-role"><option value="" ${role===''?'selected':''}>Читаю все реплики</option><option value="*" ${role==='*'?'selected':''}>Вспоминаю весь английский текст</option>${speakers.map(s=>`<option value="${esc(s)}" ${role===s?'selected':''}>Моя роль: ${esc(s)}</option>`).join('')}</select><p class="muted">Перевод раскрывается отдельно. В режиме роли сначала произнеси свою реплику, затем открой и проверь её.</p></section><div class="tb-lines">${m.lines.map((l,i)=>{const hidden=role==='*'||(role&&l.speaker===role);return `<article class="tb-line ${hidden?'tb-my-role':''}">${l.speaker?'<p class="tb-speaker">'+esc(l.speaker)+'</p>':''}${hidden?`<details class="tb-recall"><summary>Показать мою реплику</summary><p lang="en">${esc(l.en)}</p>${button('Прослушать','speak',`data-id="${m.id}" data-line="${i}"`,'text-link')}</details>`:`<p lang="en">${esc(l.en)}</p><div class="tb-actions">${button('Слушать','speak',`data-id="${m.id}" data-line="${i}"`,'text-link')}${button('Медленно','speak',`data-id="${m.id}" data-line="${i}" data-slow="1"`,'text-link')}</div>`}<details class="tb-translation"><summary>Перевод</summary><p>${esc(l.ru)}</p></details></article>`}).join('')}</div><div class="tb-actions">${button(progress().read[m.id]?'Прочитано ✓':'Отметить прочитанным','read',`data-id="${m.id}"`)}${pageButton(m.page,'Сверить с учебником')}</div><p class="tb-note">Перевод помогает понять текст. Сначала попробуй прочитать самостоятельно. Прослушивание использует английский голос телефона или браузера.</p>`);
  }
  function reader(){
    const n=Math.max(1,Math.min(book.pageCount,Number(view.page)||1));view.page=n;progress().lastPage=n;save();
    const p=book.pages[n-1];
    shell(head('Страница учебника',`PDF ${n} из ${book.pageCount}. Печатный номер виден на самой странице.`)+`<div class="tb-reader-tools"><label>Страница PDF<input id="tb-page" type="number" min="1" max="${book.pageCount}" value="${n}"></label>${button('Перейти','jump')}${button(zoom===1?'Увеличить ×2':'Вместить','zoom')}</div><div class="tb-page-image" tabindex="0" aria-label="Страница учебника. При увеличении можно прокручивать в стороны."><img src="${p.file}" width="${p.width}" height="${p.height}" alt="Учебник, страница PDF ${n}" style="width:${zoom*100}%;max-width:none"></div><div class="tb-actions">${button('← Предыдущая','previous',n<=1?'disabled':'')}${button('Следующая →','next',n>=book.pageCount?'disabled':'')}</div><p class="tb-note">При увеличении перемещай страницу пальцем. Для крупного текста с переводом открой материал раздела.</p>`);
  }
  function draw(){if(view.type==='section')topic();else if(view.type==='material')material();else if(view.type==='page')reader();else library()}
  const coreRender=render;render=function(){stop();if(currentTab==='textbook'){cityStop();cityScreen='textbook';draw();return}coreRender()};
  const coreCourse=course;course=function(){coreCourse();if(Number(courseUnit)<1)return;document.querySelector('.unit-heading')?.insertAdjacentHTML('afterend',`<section class="tb-panel">${button('Учебник: тексты, диалоги и задания','library','','primary')}</section>`);const slot=document.querySelector('.course-section.open .section-lessons');if(slot)slot.insertAdjacentHTML('afterbegin',button('Изучить тему по учебнику','section',`data-unit="${courseUnit}" data-section="${courseSection}"`));};
  const coreBack=window.CityIntegration.handleBack;window.CityIntegration.handleBack=function(){if(currentTab==='textbook'&&!session&&!flash&&cityScreen==='textbook'){back();return true}return coreBack()};
  document.addEventListener('click',event=>{
    const b=event.target.closest('[data-textbook]');if(!b||b.disabled)return;
    const a=b.dataset.textbook,u=Number(b.dataset.unit),s=Number(b.dataset.section);
    if(a==='library')go({type:'library'});
    else if(a==='section'){courseUnit=u;courseSection=s;go({type:'section',unit:u,section:s})}
    else if(a==='back')back();
    else if(a==='material'){role='';go({type:'material',id:b.dataset.id})}
    else if(a==='page'){zoom=1;go({type:'page',page:Number(b.dataset.page)})}
    else if(a==='previous'||a==='next'){view.page+=a==='next'?1:-1;draw();window.scrollTo(0,0)}
    else if(a==='jump'){const input=document.getElementById('tb-page');if(!input.reportValidity())return;view.page=Number(input.value);draw()}
    else if(a==='zoom'){zoom=zoom===1?2:1;reader()}
    else if(a==='speak'){const line=data.materials.find(m=>m.id===b.dataset.id)?.lines[Number(b.dataset.line)];if(line)speak(line.en,b.dataset.slow==='1')}
    else if(a==='read'){progress().read[b.dataset.id]=true;save();b.textContent='Прочитано ✓'}
    else if(a==='words'){const ids=[...new Set(CONTENT.lessons.filter(l=>unitOf(l)===u&&sectionOf(l)===s).flatMap(l=>l.wordIds))];stop();startReview(ids)}
    else if(a==='blitz'){
      const ids=CONTENT.lessons.filter(l=>unitOf(l)===u&&sectionOf(l)===s).flatMap(l=>l.tasks).filter(q=>q.type!=='order').map(q=>q.id);
      const run=()=>{stop();window.CityTraining.begin({mode:'blitz',source:'textbook',ids,count:'all',title:section(u,s).title})};
      if(window.CityTraining.current?.ids?.length){openModal('<h2>Начать блиц по этой теме?</h2><p>Он заменит сохранённую серию. Уже заработанные XP и ответы сохранятся.</p><div class="actions">'+button('Начать','confirm-blitz',`data-unit="${u}" data-section="${s}"`)+ '<button class="primary light" data-action="dismiss">Отмена</button></div>')}else run();
    }else if(a==='confirm-blitz'){const ids=CONTENT.lessons.filter(l=>unitOf(l)===u&&sectionOf(l)===s).flatMap(l=>l.tasks).filter(q=>q.type!=='order').map(q=>q.id);stop();window.CityTraining.begin({mode:'blitz',source:'textbook',ids,count:'all',title:section(u,s).title})}
  });
  document.addEventListener('change',e=>{if(e.target.id==='tb-role'){role=e.target.value;stop();material()}});
  document.addEventListener('input',e=>{if(e.target.id!=='tb-search')return;const pos=e.target.selectionStart;query=e.target.value;library();const input=document.getElementById('tb-search');input.focus();try{input.setSelectionRange(pos,pos)}catch{}});
  window.Textbook={open:()=>go({type:'library'}),openSection:(unit,section)=>go({type:'section',unit,section}),openMaterial:id=>{role='';go({type:'material',id})},ranges,get view(){return view}};
})();
