/* Queue identity is separate from progress/reward IDs: saved progress is never merged. */
(() => {
  'use strict';
  const clean = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
  const wordKey = w => JSON.stringify([clean(w.en),clean(w.ru)]);
  function isTranslation(q){
    return q.type==='choice' && q.en && q.ru &&
      [clean(q.en),clean(q.ru)].includes(clean(q.display || q.en)) &&
      [clean(q.en),clean(q.ru)].includes(clean(q.answer));
  }
  function taskKey(q){
    if(isTranslation(q)||q.phraseId)return 'translation:'+wordKey(q);
    return JSON.stringify([q.type,clean(q.prompt),clean(q.display||q.en||q.ru),clean(q.answer)]);
  }
  function unique(items,key){const seen=new Set();return items.filter(item=>{const k=key(item);if(seen.has(k))return false;seen.add(k);return true})}
  function shuffle(items){
    const result=[...items];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}
    return result;
  }
  // Keep every exercise in full lessons/marathons, but separate mirrored translations.
  function spread(items,key=taskKey){
    const result=[...items];
    for(let i=1;i<result.length;i++){
      const recent=new Set(result.slice(Math.max(0,i-3),i).map(key));
      if(!recent.has(key(result[i])))continue;
      let next=result.findIndex((q,j)=>j>i&&!recent.has(key(q)));
      if(next<0&&key(result[i])===key(result[i-1]))next=result.findIndex((q,j)=>j>i&&key(q)!==key(result[i-1]));
      if(next>=0)[result[i],result[next]]=[result[next],result[i]];
    }
    if(!result.some((q,i)=>i&&key(q)===key(result[i-1])))return result;
    // A frequent word can otherwise accumulate at the end of the queue.
    const groups=new Map();
    for(const q of items){const k=key(q);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(q)}
    const balanced=[];let previous;
    while(balanced.length<items.length){
      let chosen,largest=0;
      for(const [k,group] of groups)if(k!==previous&&group.length>largest){chosen=k;largest=group.length}
      // Repetition is unavoidable only when no other distinct exercise remains.
      if(chosen===undefined)for(const [k,group] of groups)if(group.length){chosen=k;break}
      balanced.push(groups.get(chosen).shift());previous=chosen;
    }
    return balanced;
  }
  window.PracticeQueue={wordKey,taskKey,isTranslation,unique,shuffle,spread};
})();
