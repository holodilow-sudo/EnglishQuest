// Mirrors the speech values in wordRows, openWord, renderReview, renderQuestion
// and literal speaker controls. Does not modify app state or curriculum files.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const source=fs.readFileSync(path.join(root,'app/content.js'),'utf8');
const data=JSON.parse(vm.runInNewContext(source+'\nJSON.stringify(CONTENT);',{}, {timeout:5000}));
const index=JSON.parse(fs.readFileSync(path.join(root,'android/src/main/assets/speech/index.json'),'utf8'));
const used=[];
for(const w of data.words){used.push({kind:'word',id:w.id,text:w.speechText||w.en});if(w.example)used.push({kind:'example',id:w.id,text:w.example});}
for(const lesson of data.lessons)for(const q of lesson.tasks){
 if(q.type!=='order'&&q.type!=='gap'&&!q.reverse)used.push({kind:'question',id:q.id,text:q.speechText||q.display||q.en});
}
const app=fs.readFileSync(path.join(root,'app/app.js'),'utf8');
for(const match of app.matchAll(/data-action="speak(?:-slow)?"\s+data-value="([^"]*)"/g))if(/^[A-Za-z][A-Za-z0-9 ,.!?:;’'()-]*$/.test(match[1]))used.push({kind:'static-ui',text:match[1]});
const missing=used.filter(item=>!index.entries[item.text.trim().replace(/\s+/g,' ').toLowerCase()]);
const assetDirectory=path.join(root,'android/src/main/assets/speech');
const missingFiles=Object.values(index.entries).filter(file=>!fs.existsSync(path.join(assetDirectory,file)));
const result={voice:index.voice,language:index.language,audioKeys:Object.keys(index.entries).length,
 controls:used.length,words:data.words.length,examples:used.filter(v=>v.kind==='example').length,
 questions:used.filter(v=>v.kind==='question').length,staticUi:used.filter(v=>v.kind==='static-ui').map(v=>v.text),missing,missingFiles};
fs.writeFileSync(path.join(root,'preview/android/tts/speech-coverage.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
if(missing.length||missingFiles.length)process.exitCode=1;
