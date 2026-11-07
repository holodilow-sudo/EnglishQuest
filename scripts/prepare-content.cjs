const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const fullPath=path.join(root,'content-full.json');
if(fs.existsSync(fullPath)){
 const full=JSON.parse(fs.readFileSync(fullPath,'utf8'));
 fs.writeFileSync(path.join(root,'app/content.js'),'/* Textbook themes; original practice exercises. */\nconst CONTENT = '+JSON.stringify(full,null,2)+';\n');
 console.log(`Prepared full course: ${full.words.length} words, ${full.lessons.length} lessons, ${full.lessons.reduce((n,l)=>n+l.tasks.length,0)} tasks.`);
 process.exit(0);
}
const draft=JSON.parse(fs.readFileSync(path.join(root,'content-draft.json'),'utf8'));
const words=draft.lessons.slice(0,2).flatMap(l=>l.items.map(x=>({id:x.id,en:x.english,ru:x.russian,ipa:'',example:x.example,exampleRu:x.exampleRu,page:x.sourcePage})));
const sentenceWords=['travel-01','travel-02','go-09','travel-10',null,null,'go-01',null,null,null];
const acceptedOrders={
 'sentence-03':['We go by bus to school.','By bus we go to school.'],
 'sentence-06':['In the park I took photos.'],
 'sentence-08':['I have done my homework already.','I already have done my homework.']
};
const lessons=draft.lessons.map((l,i)=>({id:l.id,title:['Собираемся в поездку','Один go — много смыслов','Собираем предложения'][i],subtitle:['Слова о путешествиях','Прогулки, покупки и дорога','От слов к целой фразе'][i],icon:['case','cycle','bubbles'][i],pages:i===1?'19':'13–19',wordIds:i===2?[...new Set(sentenceWords.filter(Boolean))]:l.items.map(x=>x.id),tasks:l.items.map((x,j)=>{
 const base={id:x.id,type:x.type==='build'?'order':x.type,wordId:i===2?sentenceWords[j]:x.id,page:x.sourcePage,explanation:x.note,answer:x.answer,en:x.english,ru:x.russian,prompt:x.prompt};
 if(x.type==='build')return {...base,tokens:x.tokens,hint:`Начни с «${x.subject}». ${x.note}`,accepted:acceptedOrders[x.id]||[]};
 return {...base,options:x.options,reverse:x.answer===x.english,display:x.type==='gap'?x.prompt.split(' — ')[0]:x.id==='go-03'?'go out with friends':x.answer===x.english?x.russian:x.english};
})}));
const content={version:1,units:draft.courseMap.map((u,i)=>({id:i+1,title:u.title,ru:u.titleRu,page:u.startsAtPage,sections:u.sections})),words:[...words.filter(w=>w.id.startsWith('go-')),...words.filter(w=>w.id.startsWith('travel-'))],lessons,source:{title:draft.source.title,edition:draft.source.edition}};
fs.writeFileSync(path.join(root,'app/content.js'),'/* Verified textbook vocabulary; original practice exercises. */\nconst CONTENT = '+JSON.stringify(content,null,2)+';\n');
console.log(`Prepared ${content.words.length} words and ${lessons.reduce((n,l)=>n+l.tasks.length,0)} tasks.`);
