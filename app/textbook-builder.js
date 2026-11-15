/* Shared authoring helpers for the reviewed section-by-section expansion. */
(() => {
 'use strict';
 const d=window.TextbookStudy;
 d.sectionCoverage={ '1.4':{first:56,last:76,homework:['9','10'],status:'reviewed'} };
 d.extraLessons=[];d.extraWords=[];
 const lines=rows=>rows.trim().split('\n').map(r=>r.split('|'));
 const clean=s=>s.replace(/\\n/g,'\n');
 window.TextbookBuilder={
  coverage(unit,section,first,last,homework){d.sectionCoverage[unit+'.'+section]={first,last,homework,status:'reviewed'}},
  activities(unit,section,rows){for(const [exercise,page,title,instruction,help,audio] of lines(rows))d.activities.push({id:`tb-ex-${unit}-${exercise}`,unit,section,exercise,page:Number(page),title,instruction,help,audio:audio==='audio'})},
  rule(unit,section,id,page,exercise,title,text,rows){d.rules.push({id,unit,section,page,exercise,title,text,examples:lines(rows)})},
  text(unit,section,id,page,exercise,title,rows,note='',kind='reading'){
   d.materials.push({id,unit,section,page,exercise,title,kind,instruction:kind==='poem'?'Прочитай по строфам, разбери перевод и воспроизведи по памяти.':'Прочитай материал, разбери перевод и выполни связанные задания ниже.',note,lines:lines(rows).map(([speaker,en,ru])=>({speaker,en:clean(en),ru:clean(ru)}))});
  },
  quiz(unit,section,id,title,rows){const tasks=lines(rows).map(([en,ru,answer,w1,w2,explanation,page],i)=>({id:id+'-q'+(i+1),study:true,type:'choice',en,ru,display:en,answer,options:[answer,w1,w2],prompt:'Проверь понимание',explanation,page:Number(page)}));d.extraLessons.push({id,unit,section,title,subtitle:'Разбор заданий учебника',icon:'book',wordIds:[],pages:[...new Set(tasks.map(q=>q.page))].join(', '),tasks,study:true})},
  vocabulary(unit,section,id,title,rows){
   const words=lines(rows).map(([en,ru,example,exampleRu,page],i)=>({id:id+'-w'+(i+1),unit,section,en,ru,example,exampleRu,page:Number(page)}));
   if(words.length<4)throw Error('Vocabulary group needs distinct distractors: '+id);
   d.extraWords.push(...words);
   const tasks=words.flatMap((w,i)=>[false,true].map(reverse=>{const key=reverse?'en':'ru';return {id:w.id+(reverse?'-en':'-ru'),type:'choice',wordId:w.id,en:w.en,ru:w.ru,page:w.page,reverse,display:reverse?w.ru:w.en,prompt:'Выбери перевод',answer:w[key],options:[w[key],...words.filter(x=>x.id!==w.id).slice(0,3).map(x=>x[key])],explanation:w.example+' — '+w.exampleRu}}));
   d.extraLessons.push({id,unit,section,title,subtitle:'Слова и выражения раздела',icon:'book',wordIds:words.map(w=>w.id),pages:[...new Set(words.map(w=>w.page))].join(', '),tasks,study:true});
  }
 };
})();
