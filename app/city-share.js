/* A local result card and explicit, user-controlled sharing. No contacts or analytics. */
(() => {
  'use strict';
  let overlay = null, previousFocus = null, pending = null, sequence = 0;
  const safeText = (value, length = 100) => String(value == null ? '' : value).replace(/[\u0000-\u001f]/g, ' ').slice(0, length);
  const count = value => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(999999, Math.floor(value))) : null;
  const wordLabel = n => n % 100 >= 11 && n % 100 <= 14 ? 'СЛОВ ПОВТОРЕНО' : n % 10 === 1 ? 'СЛОВО ПОВТОРЕНО' : n % 10 >= 2 && n % 10 <= 4 ? 'СЛОВА ПОВТОРЕНО' : 'СЛОВ ПОВТОРЕНО';
  function normalize(source = {}) {
    if (!source || typeof source !== 'object') source = {};
    const total = count(source.total), correct = count(source.correct);
    const first = typeof source.firstAttempt === 'object' && source.firstAttempt !== null
      ? count(source.firstAttempt.correct) : count(source.firstAttempt);
    const date = source.date ? new Date(source.date) : new Date();
    return {
      title: safeText(source.title || 'Английский в городе', 120),
      kind: safeText(source.kind || 'Миссия', 50),
      total, correct: correct == null || total == null ? correct : Math.min(correct, total),
      xp: count(source.xp), coins: count(source.coins),
      words: Array.isArray(source.words) ? source.words.length : count(source.words),
      first: first == null || total == null ? first : Math.min(first, total),
      date: Number.isNaN(date.getTime()) ? new Date() : date
    };
  }

  function rounded(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  }

  function label(ctx, text, x, y, size, color, weight = 700, align = 'left') {
    ctx.font = `${weight} ${size}px Arial, sans-serif`;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  function lines(ctx, text, x, y, maxWidth, size, height, maxLines = 2, color = '#fff') {
    ctx.font = `800 ${size}px Arial, sans-serif`;
    const words = text.split(/\s+/).filter(Boolean), rows = [];
    let row = '';
    for (const word of words) {
      if (row && ctx.measureText(row + ' ' + word).width > maxWidth) { rows.push(row); row = word; }
      else row += (row ? ' ' : '') + word;
    }
    if (row) rows.push(row);
    rows.slice(0, maxLines).forEach((value, i) => {
      if (i === maxLines - 1 && rows.length > maxLines) value += '…';
      while (ctx.measureText(value).width > maxWidth && value.length > 1) value = value.slice(0, -2) + '…';
      label(ctx, value, x, y + height * i, size, color, 800);
    });
  }

  function palm(ctx, x, y, scale, color) {
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 16; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 280); ctx.bezierCurveTo(12, 180, -10, 70, 0, 0); ctx.stroke();
    const fronds = [[-125,15,-90,-65],[-100,-65,-55,-100],[0,-100,-28,-75],[95,-70,50,-100],[135,5,85,-60],[94,55,55,-15],[-100,75,-65,-20]];
    fronds.forEach(([endX,endY,cx,cy]) => {
      ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(cx,cy,endX,endY); ctx.quadraticCurveTo(cx*.65,cy+28,0,0); ctx.fill();
    });
    ctx.restore();
  }

  function drawCard(data) {
    const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const bg = ctx.createLinearGradient(0,0,200,1350);
    bg.addColorStop(0,'#222b62'); bg.addColorStop(.28,'#bb579d'); bg.addColorStop(.5,'#f9a783'); bg.addColorStop(.51,'#23152f'); bg.addColorStop(1,'#100e22');
    ctx.fillStyle = bg; ctx.fillRect(0,0,1080,1350);
    const panelBg = ctx.createLinearGradient(0,650,0,1350); panelBg.addColorStop(0,'#20162f'); panelBg.addColorStop(1,'#100e22');
    ctx.fillStyle = panelBg; ctx.fillRect(0,650,1080,700);
    const sun = ctx.createRadialGradient(735,365,5,735,365,220);
    sun.addColorStop(0,'#ffe6ab'); sun.addColorStop(.65,'#ffd4a0'); sun.addColorStop(1,'rgba(255,201,154,0)');
    ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(735,365,220,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fbcfa9'; ctx.beginPath(); ctx.arc(735,365,126,0,Math.PI*2); ctx.fill();
    for (let i=0;i<20;i++) {
      const h = 55 + ((i*53)%150), x = i*58 - 10;
      ctx.fillStyle = i%2 ? '#5b386c' : '#3c2f5b'; ctx.fillRect(x,620-h,45,h);
      ctx.fillStyle = 'rgba(255,196,136,.34)';
      for (let y=625-h; y<602; y+=24) for (let n=0;n<3;n++) ctx.fillRect(x+7+n*11,y,4,9);
    }
    palm(ctx,92,370,1.05,'#191a38'); palm(ctx,989,327,1.2,'#201a3b');
    ctx.fillStyle = '#161329'; ctx.beginPath(); ctx.moveTo(0,610); ctx.lineTo(540,565); ctx.lineTo(1080,610); ctx.lineTo(1080,690); ctx.lineTo(0,690); ctx.fill();
    ctx.strokeStyle = '#fc89b3'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0,641); ctx.lineTo(1080,641); ctx.stroke();
    label(ctx,'ENGLISH',62,105,61,'#fff',900);
    label(ctx,'CITY QUEST',62,174,61,'#fff',900);
    rounded(ctx,810,63,208,56,28,'rgba(17,16,38,.6)','rgba(255,255,255,.25)');
    label(ctx,'МОЙ ПРОГРЕСС',914,99,20,'#f3c4e3',800,'center');
    label(ctx,'АРСЕНИЙ',62,310,86,'#fff',900);
    label(ctx,'ПАП, СМОТРИ, ЧТО Я СДЕЛАЛ!',66,358,25,'#fff3df',700);
    rounded(ctx,62,440,956,146,27,'rgba(23,18,45,.82)','rgba(255,227,246,.27)');
    label(ctx,data.kind.toLocaleUpperCase('ru-RU'),88,478,19,'#81e7df',800);
    lines(ctx,data.title,88,523,900,35,42,2);
    const hasScore = data.correct !== null && data.total !== null && data.total > 0;
    label(ctx,'РЕЗУЛЬТАТ ЗАНЯТИЯ',62,709,24,'#bcadc8',700);
    if (hasScore) {
      label(ctx,`${data.correct} / ${data.total}`,62,820,91,'#fff',900);
      label(ctx,'верных ответов',64,866,30,'#dfd2e6',500);
      const percent = Math.round(data.correct / data.total * 100);
      rounded(ctx,62,894,956,14,7,'#382a49');
      if (percent) rounded(ctx,62,894,Math.max(14,956*percent/100),14,7,'#7ee7d9');
      if (data.first !== null) label(ctx,`С первой попытки: ${data.first} из ${data.total}`,1018,864,25,'#c6b7d1',500,'right');
    } else {
      label(ctx,'ЕЩЁ ОДИН ШАГ ВПЕРЁД',62,807,52,'#fff',900);
      label(ctx,'Практика английского завершена',64,863,30,'#dfd2e6',500);
    }
    const stats = [];
    if (data.xp !== null) stats.push({value:`+${data.xp}`,text:'ОПЫТА',color:'#85e9dd'});
    if (data.coins !== null) stats.push({value:`+${data.coins}`,text:'МОНЕТ',color:'#ffcf83'});
    if (data.words !== null) stats.push({value:`${data.words}`,text:wordLabel(data.words),color:'#f5a4d0'});
    if (!stats.length) stats.push({value:'ENGLISH',text:'ПРАКТИКА КАЖДЫЙ ДЕНЬ',color:'#85e9dd'});
    const gap=20, boxWidth=(956-(stats.length-1)*gap)/stats.length;
    stats.forEach((stat,i)=>{
      const x=62+i*(boxWidth+gap);
      rounded(ctx,x,949,boxWidth,163,23,'#251d37','#49314e');
      label(ctx,stat.value,x+boxWidth/2,1027,stats.length===1?49:58,stat.color,900,'center');
      label(ctx,stat.text,x+boxWidth/2,1074,stats.length===3?19:22,'#d5c3df',700,'center');
    });
    const perfect = hasScore && data.correct === data.total;
    label(ctx,perfect?'Разобрался и дошёл до финиша.':'Продолжаю учиться. Следующая миссия ждёт!',62,1190,30,'#f7eaf7',700);
    label(ctx,data.date.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}),62,1280,25,'#a99ab9',500);
    label(ctx,'ENGLISH CITY QUEST',1018,1280,21,'#a99ab9',700,'right');
    return canvas;
  }

  function message(text) {
    const status = overlay && overlay.querySelector('[data-share-status]');
    if (status) status.textContent = text;
  }
  function enable() {
    const button = overlay && overlay.querySelector('[data-share-send]');
    if (button) { button.disabled = false; button.textContent = 'Поделиться с папой'; }
  }
  function close() {
    if (pending) { clearTimeout(pending.timer); pending = null; }
    if (overlay) { overlay.remove(); overlay = null; }
    document.removeEventListener('keydown', keydown);
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    previousFocus = null;
  }
  function keydown(event) {
    if (!overlay) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key === 'Tab') {
      const buttons = [...overlay.querySelectorAll('button:not(:disabled),a[href]')];
      const first = buttons[0], last = buttons[buttons.length-1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  function nativeResult(id, status) {
    if (!pending || pending.id !== id) return;
    clearTimeout(pending.timer); pending = null; enable();
    message(status === 'opened'
      ? 'Открыт выбор приложения. Выбери MAX или другой мессенджер, затем чат с папой.'
      : status === 'busy' ? 'Карточка ещё готовится. Попробуй через секунду.'
      : status === 'unavailable' ? 'Нет приложения для отправки картинки. Установи нужный мессенджер и попробуй снова.'
      : 'Не удалось открыть отправку. Попробуй ещё раз. Результат занятия сохранён.');
  }

  function open(source) {
    close();
    const data = normalize(source), canvas = drawCard(data), dataUrl = canvas.toDataURL('image/png');
    previousFocus = document.activeElement;
    overlay = document.createElement('div'); overlay.className = 'city-share-overlay';
    overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true'); overlay.setAttribute('aria-labelledby','city-share-title');
    overlay.innerHTML = `<section class="city-share-panel"><header class="city-share-head"><div><span class="city-share-eyebrow">МОЙ РЕЗУЛЬТАТ</span><h2 id="city-share-title">Покажи папе!</h2></div><button class="city-share-close" type="button" aria-label="Закрыть">×</button></header><div class="city-share-preview"><img alt="Карточка с результатом ученика" /></div><p class="city-share-hint">Не забудь поделиться результатом с папой. Выбери MAX или другой мессенджер и нужный чат.</p><button class="city-share-send" data-share-send type="button"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V3m0 0L7 8m5-5 5 5M5 13v7h14v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Поделиться с папой</button><p class="city-share-status" data-share-status role="status" aria-live="polite">Карточка готова. Отправку подтверждаешь ты.</p></section>`;
    overlay.querySelector('img').src = dataUrl;
    overlay.querySelector('.city-share-close').addEventListener('click',close);
    overlay.addEventListener('click',event=>{ if(event.target===overlay) close(); });
    let file = null;
    // Prepare the file before the click, preserving browser transient user activation.
    const binary = atob(dataUrl.split(',')[1]), bytes = new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
    const blob = new Blob([bytes],{type:'image/png'});
    if(typeof File==='function') file = new File([blob],'Alex-English-City-Quest.png',{type:'image/png'});
    const download = () => {
      const link=document.createElement('a'); link.href=dataUrl; link.download='Alex-English-City-Quest.png'; document.body.appendChild(link); link.click(); link.remove();
      message('Начато сохранение PNG. Прикрепи эту картинку к сообщению папе в MAX или другом мессенджере.');
    };
    if (!(window.AndroidShare && typeof window.AndroidShare.shareImage==='function')) {
      const save=document.createElement('button'); save.className='city-share-save'; save.type='button'; save.textContent='Сохранить картинку';
      save.addEventListener('click',download);
      overlay.querySelector('[data-share-status]').before(save);
    }
    overlay.querySelector('[data-share-send]').addEventListener('click',async event=>{
      const button=event.currentTarget; button.disabled=true; button.textContent='Открываем отправку…';
      if(window.AndroidShare && typeof window.AndroidShare.shareImage==='function') {
        const id=`share-${Date.now()}-${++sequence}`;
        pending={id,timer:setTimeout(()=>{pending=null;enable();message('Не удалось открыть отправку. Попробуй ещё раз.');},15000)};
        try { window.AndroidShare.shareImage(dataUrl,id); }
        catch(error){ nativeResult(id,'error'); }
        return;
      }
      let canShare=false;
      try { canShare=!!(file && navigator.share && navigator.canShare && navigator.canShare({files:[file]})); } catch(error){}
      if(canShare) {
        try { await navigator.share({files:[file],title:'Результат ученика — English City Quest'}); message('Окно отправки закрыто. Доставку можно проверить в выбранном мессенджере.'); }
        catch(error) { message(error.name==='AbortError'?'Отправка отменена. Карточку можно отправить позже.':'Не удалось открыть отправку. Попробуй ещё раз или сохрани карточку.'); }
        finally { enable(); }
      } else {
        download(); enable();
      }
    });
    document.body.appendChild(overlay); document.addEventListener('keydown',keydown);
    overlay.querySelector('.city-share-close').focus();
    return overlay;
  }
  window.CityShare = Object.freeze({open,close,isOpen:()=>!!overlay,nativeResult,createCard:source=>drawCard(normalize(source))});
})();
