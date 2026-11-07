// Extract only pronounceable English curriculum phrases, preserving existing WAVs.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const output = path.join(root, 'android/src/main/assets/speech');
fs.mkdirSync(output, {recursive:true});
const sourceArgument = process.argv.indexOf('--content');
const source = sourceArgument >= 0 ? path.resolve(root,process.argv[sourceArgument+1]) : path.join(root,'app/content.js');
const sourceText = fs.readFileSync(source,'utf8');
const data = source.endsWith('.js') ? JSON.parse(vm.runInNewContext(sourceText+'\nJSON.stringify(CONTENT);', {}, {timeout:5000})) : JSON.parse(sourceText);
const phrases = new Map();
const overrides = JSON.parse(fs.readFileSync(path.join(__dirname,'pronunciation-overrides.json'),'utf8')).entries;
function add(text) {
  if (typeof text !== 'string') return;
  text = text.trim().replace(/\s+/g,' ');
  if (!/[a-z]/i.test(text) || /[а-яё_]/i.test(text) || text.length > 1200) return;
  const key = text.toLowerCase();
  const override = overrides[key];
  const sapiXml = override ? `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><phoneme alphabet="ipa" ph="${override.ipa}">${text}</phoneme></speak>` : undefined;
  // An override changes its asset name so an older ambiguous pronunciation is not reused.
  const stem = crypto.createHash('sha256').update(key+(sapiXml?'\0'+sapiXml:'')).digest('hex').slice(0,24);
  if (!phrases.has(key)) phrases.set(key,{key,text,file:stem+'.m4a',sourceFile:stem+'.wav',...(sapiXml?{sapiXml,pronunciationMeaning:override.meaning}:{})});
}
const spokenKeys = new Set(['en','english','example','answer','accepted','display','correctSentence','questionEnglish','sentence','textEn','speechText']);
function walk(value, key) {
  if (typeof value === 'string') { if(spokenKeys.has(key)) add(value); return; }
  if (Array.isArray(value)) { for(const item of value) walk(item,key); return; }
  if (value && typeof value === 'object') for(const [k,v] of Object.entries(value)) walk(v,k);
}
walk(data,'');
// City dialogue/navigation recordings join the same offline speech index.
const citySpeechPath=path.join(root,'app/city-speech.json');
if(process.argv.includes('--include-city')&&fs.existsSync(citySpeechPath))for(const text of JSON.parse(fs.readFileSync(citySpeechPath,'utf8')).phrases)add(text);
// Static speaker buttons are UI text rather than curriculum data. Include their
// literal data-value payloads; dynamic esc()/template expressions are not speech.
const appCode=fs.readFileSync(path.join(root,'app/app.js'),'utf8');
for(const match of appCode.matchAll(/data-action="speak(?:-slow)?"\s+data-value="([^"]*)"/g)) {
  if(/^[A-Za-z][A-Za-z0-9 ,.!?:;’'()-]*$/.test(match[1])) add(match[1]);
}
const list = [...phrases.values()].sort((a,b)=>a.key.localeCompare(b.key,'en'));
fs.writeFileSync(path.join(output,'phrases.json'),JSON.stringify(list,null,2));
fs.writeFileSync(path.join(output,'index.json'),JSON.stringify({version:2,voice:'Microsoft Zira',language:'en-US',source:'Windows SAPI',encoding:'AAC-LC 64kbps mono',entries:Object.fromEntries(list.map(p=>[p.key,p.file]))},null,2));
console.log(JSON.stringify({phrases:list.length,existing:list.filter(p=>fs.existsSync(path.join(output,p.file))).length,output}));
