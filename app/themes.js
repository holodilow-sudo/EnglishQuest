/* Appearance is independent of learning progress and earned cosmetics. */
(() => {
  'use strict';
  const themes=[
    {id:'vice',name:'Неоновый закат',kind:'Основная · тёмная',colors:['#181327','#ff79c6','#69e5de']},
    {id:'porcelain',name:'Синий фарфор',kind:'Светлая',colors:['#eaf1fc','#246dce','#89b8f4']},
    {id:'amber',name:'Серебро и янтарь',kind:'Светлая',colors:['#e7e9ed','#e9aa12','#795307']},
    {id:'ice',name:'Лавандовый лёд',kind:'Светлая',colors:['#dfedf4','#8252c6','#96d9e5']},
    {id:'fuchsia',name:'Графит и фуксия',kind:'Тёмная',colors:['#292d39','#ed65a6','#b5b3f0']},
    {id:'carbon',name:'Карбон и бирюза',kind:'Тёмная',colors:['#252d32','#67ddd6','#83adb9']}
  ];
  const selected=()=>themes.find(t=>t.id===state.appearanceTheme)||themes[0];
  applyAppearance=function(){
    const t=selected();document.documentElement.dataset.theme=t.id;
    document.documentElement.dataset.appearance=t.kind==='Светлая'?'light':'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',t.colors[0]);
  };
  function select(id){
    if(!themes.some(t=>t.id===id))return;
    state.appearanceTheme=id;save();applyAppearance();
    document.querySelectorAll('[name="appearance-theme"]').forEach(r=>{r.checked=r.value===id});
    const status=document.querySelector('[data-theme-status]');if(status)status.textContent='Выбрана тема «'+selected().name+'»';
  }
  function picker(){
    return `<section class="appearance-settings" id="appearance-settings" aria-labelledby="appearance-title"><h2 id="appearance-title">Темы оформления</h2><p>Шесть тем на выбор. Все доступны бесплатно.</p><div class="appearance-grid">${themes.map(t=>`<label class="appearance-choice"><input type="radio" name="appearance-theme" value="${t.id}" ${selected().id===t.id?'checked':''}><span class="appearance-preview" style="--preview-bg:${t.colors[0]};--preview-accent:${t.colors[1]};--preview-secondary:${t.colors[2]}"><i></i><i></i><i></i></span><strong>${t.name}</strong><small>${t.kind}</small></label>`).join('')}</div><p class="appearance-status" data-theme-status role="status">Выбрана тема «${selected().name}»</p></section>`;
  }
  const previousProfile=profile;
  profile=function(){
    if(shopType==='theme')shopType='all';
    previousProfile();
    if(profileView==='progress'){
      const settings=document.querySelector('.settings');
      settings?.insertAdjacentHTML('beforebegin','<h2 class="settings-title">Настройки</h2>');
      settings?.insertAdjacentHTML('afterend',picker());
      document.querySelector('.profile-tabs')?.insertAdjacentHTML('afterend','<button class="text-link appearance-jump" data-appearance-open>Темы оформления '+icon('chevron',16)+'</button>');
    }
  };
  document.addEventListener('change',e=>{if(e.target.name==='appearance-theme')select(e.target.value)});
  document.addEventListener('click',e=>{if(e.target.closest('[data-appearance-open]'))document.getElementById('appearance-settings')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})});
  window.CityThemes={themes,select,get current(){return selected().id}};
  applyAppearance();if(!cityShowingSplash)render();
})();
