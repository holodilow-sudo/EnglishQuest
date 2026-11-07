/* Native Android reminder preferences are separate from learning progress. */
(() => {
  'use strict';
  const defaults=()=>({native:false,configured:false,enabled:false,allowed:false,permission:false,
    weekdays:['11:00','19:00'],weekends:['11:00','13:00','17:00','19:00'],scheduled:0});
  const previewKey=STORE+'-reminders-preview';
  let status=defaults();
  function refresh(){
    try {
      const raw=window.AndroidReminders?JSON.parse(AndroidReminders.getStatus()):JSON.parse(localStorage.getItem(previewKey)||'{}');
      status={...defaults(),...raw,native:!!window.AndroidReminders};
    }catch{status={...defaults(),native:!!window.AndroidReminders,error:true}}
  }
  function statusText(){
    if(status.error)return 'Не удалось прочитать настройки. Попробуй открыть их снова.';
    if(!status.configured)return 'Включи напоминания, чтобы находить время для слов.';
    if(!status.enabled)return 'Напоминания выключены.';
    if(!status.native)return 'Предпросмотр: расписание сохранено. Уведомления появятся в Android-приложении.';
    if(!status.allowed)return 'Android пока не разрешает эти уведомления. Разреши их в настройках телефона.';
    if(status.scheduleError||!status.scheduled)return 'Расписание сохранено, но уведомление не назначено. Попробуй сохранить ещё раз.';
    return 'Ближайшее: '+new Date(status.scheduled).toLocaleString('ru-RU',{weekday:'long',hour:'2-digit',minute:'2-digit'})+'.';
  }
  function summary(){return `<div class="reminder-schedule"><span>Пн–Пт</span><strong>${status.weekdays.map(esc).join(' · ')}</strong><span>Сб–Вс</span><strong>${status.weekends.map(esc).join(' · ')}</strong></div>`}
  function card(){return `<section class="reminder-card" data-reminder-card><div class="reminder-title">${icon('clock',23)}<h3>Пора повторить слова</h3></div>${summary()}<p>${esc(statusText())}</p><button class="text-link" data-reminders="settings">${status.configured?'Настроить напоминания':'Включить напоминания'} ${icon('chevron',17)}</button></section>`}
  function decorate(){
    document.querySelectorAll('[data-reminder-card]').forEach(e=>e.remove());
    if(!['home','training','profile'].includes(currentTab))return;
    const main=document.querySelector('#app>.screen');if(!main)return;
    const anchor=currentTab==='training'?main.querySelector('.training-config'):currentTab==='home'?main.querySelector('.city-home-story'):main.querySelector('.profile-tabs');
    if(anchor)anchor.insertAdjacentHTML('afterend',card());else main.insertAdjacentHTML('beforeend',card());
  }
  function form(){
    refresh();
    const fields=(key,label)=>`<fieldset class="reminder-times"><legend>${label}</legend>${status[key].map((time,i)=>`<label>Напоминание ${i+1}<input type="time" data-reminder-time="${key}" aria-label="${label}: напоминание ${i+1}" value="${esc(time)}" required></label>`).join('')}</fieldset>`;
    openModal(`<div class="modal-top"><h2>Напоминания о словах</h2><button class="icon-button" data-action="dismiss" aria-label="Закрыть">${icon('close')}</button></div><div id="reminder-form"><label class="reminder-toggle"><span><strong>Напоминать о повторении</strong><small>По местному времени телефона</small></span><input id="reminder-enabled" type="checkbox" ${(!status.configured||status.enabled)?'checked':''}></label>${fields('weekdays','Будни · Пн–Пт')}${fields('weekends','Выходные · Сб–Вс')}<p class="reminder-form-note">По нажатию откроются слова из Enjoy English 6. Android может доставить напоминание немного позже выбранного времени.</p><p class="reminder-native-status" role="status">${esc(statusText())}</p><p class="reminder-error" role="alert"></p><button class="primary" data-reminders="save">Сохранить расписание ${icon('check',18)}</button><div class="reminder-tools"><button class="text-link" data-reminders="test">${status.native?'Проверить уведомление':'Посмотреть уведомление'}</button>${status.native?'<button class="text-link" data-reminders="phone-settings">Настройки Android</button>':''}</div>${status.native&&!status.permission?'<button class="primary light" data-reminders="permission">Разрешить уведомления</button>':''}${status.native?'':'<p class="reminder-form-note">Это пробная версия в браузере. Она не отправляет системные уведомления.</p>'}</div>`);
    document.querySelector('.modal')?.classList.add('reminders-modal');
  }
  function times(key){
    const values=[...document.querySelectorAll(`[data-reminder-time="${key}"]`)].map(el=>el.value);
    if(values.length!==(key==='weekdays'?2:4)||values.some(t=>!/^([01]\d|2[0-3]):[0-5]\d$/.test(t)))throw Error('Заполни все поля времени.');
    if(new Set(values).size!==values.length)throw Error('Укажи разное время для каждого напоминания в одной группе.');
    return values.sort();
  }
  function saveSettings(){
    try {
      const weekdays=times('weekdays'),weekends=times('weekends'),enabled=document.querySelector('#reminder-enabled').checked;
      if(window.AndroidReminders){AndroidReminders.configure(enabled,weekdays.join(','),weekends.join(','));return}
      status={...defaults(),configured:true,enabled,weekdays,weekends};
      localStorage.setItem(previewKey,JSON.stringify(status));dismiss();decorate();toast('Расписание сохранено в пробной версии.');
    }catch(error){const node=document.querySelector('.reminder-error');if(node)node.textContent=error.message}
  }
  function preview(){
    openModal(`<div class="modal-top"><h2>Так выглядит напоминание</h2><button class="icon-button" data-reminders="settings" aria-label="Назад к настройкам">${icon('close')}</button></div><button class="reminder-notification" data-reminders="open-review"><span class="reminder-app">${icon('book',19)} English City Quest · сейчас</span><strong>Ученик, пора повторить слова!</strong><span>Пара минут английского — и слова станут знакомее. Нажми, чтобы повторить.</span><b>Повторить слова →</b></button><p class="reminder-form-note">Образец уведомления. В Android его оформление зависит от телефона.</p>`);
  }
  function goReview(){
    dismiss();window.CityShare?.close();window.CityTraining?.pause();cityStop();session=null;
    cityShowingSplash=false;ensureCity().welcome=true;save();currentTab='training';
    if(flash&&flash.index<flash.queue.length){cityScreen='review';reviewScreen();return true}
    flash=null;
    let words=dueWords().slice(0,20);
    if(!words.length)words=CONTENT.words.filter(w=>!state.words[w.id]).slice(0,10);
    if(!words.length)words=[...CONTENT.words].sort((a,b)=>(state.words[a.id]?.due||0)-(state.words[b.id]?.due||0)).slice(0,10);
    startReview(words.map(w=>w.id));return true;
  }
  function openReview(){
    if(session&&!document.querySelector('.result')){
      openModal(`<div class="modal-top"><h2>Перейти к словам?</h2></div><p class="reminder-form-note">Ответы и награды сохранены. К текущему уроку можно будет вернуться с начала.</p><div class="actions"><button class="primary light" data-action="dismiss">Остаться в уроке</button><button class="primary" data-reminders="review-now">Повторить слова</button></div>`);return true;
    }
    return goReview();
  }
  function nativeChanged(value,message=''){
    status={...defaults(),...value,native:true};
    const node=document.querySelector('.reminder-native-status');if(node)node.textContent=statusText();
    decorate();
    if(message==='saved'){dismiss();toast(status.enabled?'Расписание сохранено.':'Напоминания выключены.');}
    else if(message==='invalid')toast('Не удалось сохранить расписание. Проверь время и попробуй снова.');
    else if(message==='test-sent')toast('Проверочное уведомление отправлено на этот телефон.');
    else if(message==='blocked')toast('Разреши уведомления для приложения в настройках Android.');
    else if(message==='settings-error')toast('Открой настройки уведомлений через настройки телефона.');
  }
  const originalShell=shell;
  shell=function(html){originalShell(html);refresh();decorate()};
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-reminders]');if(!button||button.disabled)return;
    switch(button.dataset.reminders){
      case 'settings':form();break;
      case 'save':saveSettings();break;
      case 'test':if(window.AndroidReminders)AndroidReminders.test();else preview();break;
      case 'permission':window.AndroidReminders?.requestPermission();break;
      case 'phone-settings':window.AndroidReminders?.openSettings();break;
      case 'open-review':openReview();break;
      case 'review-now':goReview();break;
    }
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refresh();decorate()}});
  window.CityReminders={openReview,nativeChanged,settings:form,preview,refresh};
  refresh();decorate();
})();
