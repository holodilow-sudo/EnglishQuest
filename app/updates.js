/* Downloaded APK state is native; learning progress stays in its original store. */
(() => {
  'use strict';
  let info={state:'preview',installed:'1.2.2',native:false,inApp:true},prompted=new Set(),timer;
  const hasVersion=()=>/^\d+\.\d+\.\d+$/.test(info.version||'');
  const ready=()=>['ready','install-permission','installing'].includes(info.state)&&hasVersion();
  const busy=()=>['downloading','verifying'].includes(info.state);
  const active=()=>hasVersion()&&['available','downloading','verifying','ready','install-permission','installing'].includes(info.state);
  const percent=()=>Math.max(0,Math.min(100,Math.floor(Number(info.progress)||0)));
  function refresh(){try{if(window.AndroidUpdates)info={...JSON.parse(AndroidUpdates.getStatus()),native:true}}catch{info={state:'error',native:true}}}
  function title(){return ready()?'Обновление готово':busy()?'Скачиваем обновление':active()?'Есть обновление':'Обновления приложения'}
  function description(){
    if(info.message)return info.message;
    if(info.state==='downloading')return 'Версия '+info.version+' скачивается в приложении. Можно продолжать заниматься.';
    if(info.state==='verifying')return 'Проверяем файл и подпись приложения…';
    if(info.state==='install-permission')return 'Один раз разреши установку из English City Quest в настройках Android. Затем вернись сюда и нажми «Установить».';
    if(info.state==='installing')return 'Подтверди обновление в системном окне Android.';
    if(ready())return 'Версия '+info.version+' скачана и проверена. Осталось установить.';
    if(info.state==='available')return 'Новая версия доступна. Можно повторить загрузку прямо здесь.';
    if(info.state==='checking')return 'Проверяем новую версию в GitHub…';
    if(info.state==='current')return 'Установлена актуальная версия.';
    if(info.state==='unpublished')return 'Обновления ещё не опубликованы в GitHub.';
    if(info.state==='error')return 'Сейчас проверить не получилось. Занятия доступны как обычно.';
    return 'При открытии проверяем GitHub и скачиваем новую версию. Ты подтверждаешь только установку.';
  }
  function meter(){return info.state==='downloading'?`<div class="update-meter" role="progressbar" aria-label="Загрузка обновления" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent()}"><span style="width:${percent()}%"></span></div><p class="update-percent">${percent()}% · ${Math.ceil((info.bytes||0)/1024/1024)} МБ</p>`:''}
  function action(){
    if(info.state==='downloading')return '<button class="text-link" data-updates="cancel">Остановить загрузку</button>';
    if(info.state==='verifying')return '<button class="primary" disabled>Проверяем файл…</button>';
    if(info.state==='install-permission')return '<button class="primary" data-updates="settings">Разрешить установку</button>';
    if(ready())return '<button class="primary" data-updates="install">Установить</button>';
    if(active())return '<button class="primary" data-updates="download">Повторить загрузку</button>';
    return `<button class="text-link" data-updates="check" ${info.state==='checking'?'disabled':''}>Проверить сейчас</button>`;
  }
  function card(){return `<section class="update-card" data-update-card><div class="update-heading"><span class="update-symbol">${ready()?'✓':'↓'}</span><h3>${title()}</h3></div><p>${esc(description())}</p>${meter()}<small>Установлена ${esc(info.installed||'—')} · GitHub</small>${action()}</section>`}
  function decorate(){
    document.querySelectorAll('[data-update-card]').forEach(e=>e.remove());
    const main=document.querySelector('#app>.screen');
    if(!main||!(currentTab==='profile'||currentTab==='home'&&active())||session||flash||document.querySelector('.lesson-screen'))return;
    main.insertAdjacentHTML(currentTab==='home'?'afterbegin':'beforeend',card());
  }
  function safeToPrompt(){return !document.hidden&&!cityShowingSplash&&['home','profile'].includes(currentTab)&&!session&&!flash&&!document.querySelector('.modal-shade,.lesson-screen,.result')&&!window.CityShare?.isOpen()}
  function modalBody(){return `<div class="update-badge">Версия ${esc(info.version)} · ${Math.ceil((info.bytes||0)/1024/1024)} МБ</div><p class="update-description">${esc(description())}</p>${meter()}${ready()?'<div class="update-verified">✓ Файл и подпись проверены</div>':''}<p class="update-preserve">Прогресс, слова и награды сохранятся. Обновление установится поверх приложения.</p><div class="update-actions">${action()}<button class="primary light" data-action="dismiss">Позже</button></div><p class="update-footnote">Установку подтвердит Android.<br>Обновления из публичного GitHub · без входа и ключей</p>`}
  function details(){
    if(!active())return;
    if(ready())prompted.add(info.version);
    openModal(`<div class="modal-top"><h2>${title()}</h2><button class="icon-button" data-action="dismiss" aria-label="Закрыть">${icon('close')}</button></div><div data-update-modal-body>${modalBody()}</div>`);
    document.querySelector('.modal')?.classList.add('update-modal');
  }
  function maybePrompt(){clearTimeout(timer);if(info.state==='ready'&&!prompted.has(info.version)&&safeToPrompt())timer=setTimeout(()=>{if(info.state==='ready'&&!prompted.has(info.version)&&safeToPrompt())details()},250)}
  function nativeChanged(value){
    info={...value,native:true};decorate();
    const body=document.querySelector('[data-update-modal-body]');
    if(body&&active()){body.innerHTML=modalBody();document.querySelector('.update-modal h2').textContent=title();}
    if(value.manual&&!active())toast(value.message||(value.state==='current'?'Установлена актуальная версия.':description()));
    maybePrompt();
  }
  const originalShell=shell;
  shell=function(html){originalShell(html);refresh();decorate();maybePrompt()};
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-updates]');if(!button||button.disabled)return;
    if(!window.AndroidUpdates){toast('Это обзор. Загрузка и установка доступны в Android-приложении.');return;}
    const actions={check:'check',download:'download',install:'install',settings:'installSettings',cancel:'cancelDownload'};
    const method=actions[button.dataset.updates];
    if(method){if(method==='install')save();AndroidUpdates[method]?.();}
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refresh();decorate();maybePrompt()}});
  window.CityUpdates={nativeChanged};
  refresh();decorate();maybePrompt();
})();
