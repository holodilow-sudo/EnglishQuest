/* Rebuild the offline app corpus from the reviewed thematic course and dictionary scans.
   No PDF/image data is included. IDs depend on vocabulary, not merge order. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'tmp', 'dictionary');
const normalize = text => String(text || '').normalize('NFKC').toLowerCase().replace(/ё/g, 'е').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
const hash = text => crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
const keyFor = e => normalize(e.en) + '|' + normalize(e.ru);
const base = JSON.parse(fs.readFileSync(path.join(root, 'content-full.json'), 'utf8').replace(/^\uFEFF/, ''));
if (base.dictionaryUnit || base.words.some(w => w.dictionary)) throw Error('content-full.json must remain the thematic base only');
const files = fs.readdirSync(dir).filter(f => /^entries-.*\.json$/.test(f)).sort((a, b) => a.localeCompare(b, 'en', {numeric: true}));
const seen = new Map(), verified = new Set(), sourceNotes = [], duplicates = [], alternateSources = [];
for (const file of files) {
  const part = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8').replace(/^\uFEFF/, ''));
  if (!Array.isArray(part.entries)) throw Error('Missing entries: ' + file);
  for (const p of part.sourceVerifiedPages || []) if (Number.isFinite(p)) verified.add(p);
  for (const note of part.notes || []) sourceNotes.push({file, note});
  if (part.sourceEdition) alternateSources.push({file,edition:part.sourceEdition,url:part.sourceURL,verifiedPrintedPages:part.sourceVerifiedAlternatePages||[],verifiedPdfPages:part.sourceVerifiedAlternatePdfPages||[],restoredRange:part.restoredRange||null,note:part.sourceNote||''});
  for (const raw of part.entries) {
    const e = {...raw, en: String(raw.en || '').trim(), ru: String(raw.ru || '').trim()};
    if (!e.en || !e.ru || !Number.isFinite(e.page)) throw Error('Invalid dictionary entry: ' + file + ' ' + e.en);
    // Distinguish the /z/ verb from the /s/ adverb in native audio lookup.
    if (normalize(e.en)==='close' && e.partOfSpeech==='verb') e.speechText='to close';
    if (normalize(e.en)==='close' && e.partOfSpeech==='adverb') e.speechText='close';
    const key = keyFor(e);
    if (seen.has(key)) {
      const existing = seen.get(key);
      duplicates.push({en:e.en, ru:e.ru, page:e.page, keptPage:existing.page});
      for (const [field, value] of Object.entries(e)) if (existing[field] == null || existing[field] === '') existing[field] = value;
    } else seen.set(key, e);
  }
}
const entries = [...seen.values()].sort((a, b) => a.page - b.page);
if (!entries.length) throw Error('Dictionary is empty');
const pages = [...new Set(entries.map(e => e.page))].sort((a,b)=>a-b);
const originalPrintedPages = [...new Set(entries.filter(e=>Number.isFinite(e.sourcePdfPage)).map(e=>e.page))].sort((a,b)=>a-b);
const expectedPages = Array.from({length:24},(_,i)=>192+i);
const dictionary = {
  version:1, title:'Enjoy English 6 — Vocabulary', entries,
  sourceVerifiedPages:[...verified].sort((a,b)=>a-b), printedPages:pages,
  originalPrintedPages, missingPrintedPages:expectedPages.filter(p=>!originalPrintedPages.includes(p)),
  uncoveredPrintedPageSlots:expectedPages.filter(p=>!pages.includes(p)),
  alternateSources, supplementedEntries:entries.filter(e=>e.sourceEdition).length,
  sourceNotes, duplicatesRemoved:duplicates,
  extraction:'Headwords and subphrases from the user-provided textbook dictionary. The lexical gap of missing printed page 207 is supplemented from the 2014 edition; page-by-page identity is not asserted. Scan images are not included.'
};
fs.writeFileSync(path.join(root, 'content-dictionary.json'), JSON.stringify(dictionary,null,2)+'\n');

// A conservative pool avoids plausible synonyms and nearly identical answers.
// The pool deliberately uses concrete, distant concepts; it never uses another
// sense of the current English headword or an answer sharing a Russian root.
const anchors = [
 ['banana','банан','fruit|plantain'], ['carrot','морковь','vegetable'],
 ['mirror','зеркало','reflection'], ['pillow','подушка','cushion'],
 ['scissors','ножницы','shears'], ['ladder','лестница','stairs|staircase|steps'],
 ['snow','снег','snowfall'], ['rainbow','радуга','spectrum'],
 ['island','остров','isle'], ['wallet','кошелёк','purse'],
 ['Monday','понедельник','weekday|week'], ['November','ноябрь','month|autumn'],
 ['fourteen','четырнадцать','number|fourteenth'], ['chess','шахматы','board game'],
 ['cucumber','огурец','vegetable'], ['giraffe','жираф','animal'],
 ['bicycle','велосипед','bike|cycle'], ['butterfly','бабочка','insect'],
 ['volcano','вулкан','mountain'], ['suitcase','чемодан','case|luggage|baggage'],
 ['spoon','ложка','cutlery'], ['roof','крыша','rooftop'],
 ['watermelon','арбуз','melon|fruit'], ['umbrella','зонт','parasol']
].map(([en,ru,related])=>({en,ru,related:related.split('|')}));
const stop = new Set(['что','чем','как','или','это','его','она','для','при','сам','так','быть','либо','ли','не','во','по','на','к','с','и','в','у','о','а','то']);
const roots = ru => normalize(ru).replace(/\([^)]*\)/g,'').match(/[а-я]+/g)?.filter(w=>w.length>2&&!stop.has(w)).map(w=>w.slice(0,Math.min(4,w.length))) || [];
const overlaps = (a,b) => { const ar=roots(a), br=roots(b); return ar.some(x=>br.some(y=>x.startsWith(y)||y.startsWith(x))); };
const enTokens = en => new Set(normalize(en).match(/[a-z]+/g) || []);
function optionsFor(e) {
  const tokens=enTokens(e.en), id=hash(keyFor(e));
  const candidates=anchors.filter(a=>{
    const at=enTokens(a.en+' '+a.related.join(' '));
    return ![...tokens].some(t=>at.has(t))&&!overlaps(e.ru,a.ru)&&normalize(e.ru)!==normalize(a.ru);
  }).sort((a,b)=>hash(id+'|'+a.en).localeCompare(hash(id+'|'+b.en)));
  const distractors=[];
  for(const c of candidates){if(!distractors.some(d=>overlaps(d,c.ru)))distractors.push(c.ru);if(distractors.length===3)break;}
  if(distractors.length!==3)throw Error('Not enough unambiguous distractors for '+e.en);
  const options=[...distractors];options.splice(parseInt(id.slice(0,2),16)%4,0,e.ru);return options;
}
const sectionGroups = pages.map(page=>({page, entries:entries.filter(e=>e.page===page)}));
const dictionaryUnit = {id:-1,title:'Vocabulary',ru:'Словарь учебника',sections:sectionGroups.map(g=>({id:g.page,title:g.entries[0].en+' — '+g.entries.at(-1).en,ru:g.entries[0].sourceEdition?'Дополнение · издание '+g.entries[0].sourceEdition:'Печатная страница '+g.page,page:g.page,sourceEdition:g.entries[0].sourceEdition||null}))};
const words = entries.map(e=>({...e,id:'dict-'+hash(keyFor(e)),unit:-1,section:e.page,dictionary:true,sourcePageKind:e.sourceEdition?'alternate-printed':'printed',example:e.example||'',exampleRu:e.exampleRu||'',speechText:e.speechText||e.en}));
const wordsByKey = new Map(words.map(w=>[keyFor(w),w]));
const lessons=[];
for(const group of sectionGroups){
  const chunkCount=Math.ceil(group.entries.length/12), chunkSize=Math.floor(group.entries.length/chunkCount), extra=group.entries.length%chunkCount;
  let cursor=0;
  for(let index=0;index<chunkCount;index++){
    const count=chunkSize+(index<extra?1:0), chunk=group.entries.slice(cursor,cursor+count), first=cursor+1;cursor+=count;
    if(count<5&&group.entries.length>=5)throw Error('Short dictionary lesson');
    const tasks=chunk.map(e=>{
      const w=wordsByKey.get(keyFor(e));
      return {id:'dict-task-'+hash(keyFor(e)),type:'choice',wordId:w.id,unit:-1,dictionary:true,page:e.page,sourcePdfPage:e.sourcePdfPage,sourceEdition:e.sourceEdition||null,sourceAlternatePage:e.sourceAlternatePage||null,sourcePageKind:e.sourceEdition?'alternate-printed':'printed',prompt:'Выбери перевод на русский',en:e.en,display:e.en,ru:e.ru,answer:e.ru,options:optionsFor(e),reverse:false,speechText:w.speechText,ipa:e.ipa||'',partOfSpeech:e.partOfSpeech||'',forms:e.forms||'',explanation:e.en+' — '+e.ru+'.'};
    });
    lessons.push({id:'dict-p'+group.page+'-'+String(index+1).padStart(2,'0'),unit:-1,section:group.page,dictionary:true,title:'Слова '+first+'–'+cursor,subtitle:chunk[0].en+' — '+chunk.at(-1).en,sectionTitle:'Словарь · '+(chunk[0].sourceEdition?'дополнение издания '+chunk[0].sourceEdition:'страница '+group.page),pages:String(group.page),sourceEdition:chunk[0].sourceEdition||null,sourceAlternatePages:[...new Set(chunk.map(e=>e.sourceAlternatePage).filter(Number.isFinite))].sort((a,b)=>a-b),sourcePageKind:chunk[0].sourceEdition?'alternate-printed':'printed',icon:'book',wordIds:tasks.map(q=>q.wordId),tasks});
  }
}
const combined={...base,dictionaryUnit,words:[...base.words,...words],lessons:[...base.lessons,...lessons],dictionaryCoverage:{entryCount:entries.length,lessonCount:lessons.length,taskCount:entries.length,printedPages:pages,originalPrintedPages,missingPrintedPages:dictionary.missingPrintedPages,uncoveredPrintedPageSlots:dictionary.uncoveredPrintedPageSlots,sourceVerifiedPages:dictionary.sourceVerifiedPages,alternateSources,supplementedEntries:dictionary.supplementedEntries,note:'В исходном PDF отсутствует печатная страница 207. Лексический промежуток piano…purring дополнен по изданию 2014 года; тождество страниц разных изданий не подтверждено.'}};
const ids=new Set();for(const q of combined.lessons.flatMap(l=>l.tasks)){if(ids.has(q.id))throw Error('Duplicate task ID '+q.id);ids.add(q.id)}
fs.writeFileSync(path.join(root,'app','content.js'),'/* Generated from reviewed thematic content and textbook vocabulary. No PDF pages included. */\nconst CONTENT = '+JSON.stringify(combined,null,2)+';\n');
console.log(JSON.stringify({thematicWords:base.words.length,thematicLessons:base.lessons.length,thematicTasks:base.lessons.reduce((s,l)=>s+l.tasks.length,0),dictionaryEntries:entries.length,dictionaryLessons:lessons.length,words:combined.words.length,lessons:combined.lessons.length,tasks:ids.size,printedPages:pages,missingPrintedPages:dictionary.missingPrintedPages,duplicatesRemoved:duplicates.length},null,2));
