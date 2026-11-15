const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {content,study}=require('./load-content.cjs')();
const rows=[];
for(const u of content.units)for(let s=1;s<=u.sections.length;s++){
 const key=u.id+'.'+s,c=study.sectionCoverage[key];assert(c,key);
 const activities=study.activities.filter(x=>x.unit===u.id&&x.section===s);
 const numbers=activities.flatMap(x=>String(x.exercise).match(/^\d+$/)?[Number(x.exercise)]:[]);
 for(let i=c.first;i<=c.last;i++)assert(numbers.includes(i),key+' exercise '+i);
 for(const n of c.homework)assert(activities.some(x=>String(x.exercise).startsWith('ДЗ ')&&(String(x.exercise).match(/\d+/g)||[]).includes(n)),key+' homework '+n);
 const materials=study.materials.filter(x=>x.unit===u.id&&x.section===s);
 const rules=study.rules.filter(x=>(x.unit||1)===u.id&&(x.section||4)===s);
 const lessons=content.lessons.filter(x=>x.unit===u.id&&x.section===s&&x.id.startsWith('tb-'));
 assert(materials.length&&rules.length&&lessons.length,key);
 for(const a of activities){assert(a.instruction&&a.help&&a.page,key+' incomplete activity')}
 rows.push({section:key,first:c.first,last:c.last,activities:activities.length,materials:materials.length,rules:rules.length,newQuestions:lessons.reduce((n,l)=>n+l.tasks.length,0),missingSourceExercises:c.missingSourceExercises||[]});
}
assert.equal(rows.length,22);
assert.equal(new Set(study.activities.map(x=>x.id)).size,study.activities.length,'Activity IDs');
assert.equal(new Set(study.rules.map(x=>x.id)).size,study.rules.length,'Rule IDs');
const report={passed:true,sections:rows,totalActivities:study.activities.length,sourceGaps:study.sourceGaps};
fs.mkdirSync(path.join(__dirname,'../work/textbook-review'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'../work/textbook-review/coverage.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
