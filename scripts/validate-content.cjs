// Structural checks that catch broken exercises, missing lessons and stale references.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const content = vm.runInNewContext(fs.readFileSync(path.join(root, 'app/content.js'), 'utf8') + ';CONTENT;');
const norm = s => s.toLowerCase().replace(/[.!?,]/g, '').replace(/\s+/g, ' ').trim();
const bag = s => norm(s).split(' ').sort().join('|');
const unique = (list, label) => assert.equal(new Set(list).size, list.length, 'Duplicate ' + label);
const nonempty = (s, label) => assert(typeof s === 'string' && s.trim(), 'Missing ' + label);
unique(content.words.map(w => w.id), 'word IDs');
unique(content.lessons.map(l => l.id), 'lesson IDs');
unique(content.lessons.flatMap(l => l.tasks.map(q => q.id)), 'task IDs');
const words = new Map(content.words.map(w => [w.id, w]));
assert.equal(content.units.length, 4);
assert.equal(content.units.reduce((n, u) => n + u.sections.length, 0), 22);
const report = [];
for (const unit of content.units) {
  unit.sections.forEach((section, index) => {
    const lessons = content.lessons.filter(l => l.unit === unit.id && l.section === index + 1);
    assert(lessons.length >= 2, `Unit ${unit.id} Section ${index + 1}: fewer than two lessons`);
    const ids = new Set(lessons.flatMap(l => l.wordIds));
    assert(ids.size >= 10, `Unit ${unit.id} Section ${index + 1}: fewer than ten words`);
    report.push({unit:unit.id, section:index+1, title:typeof section === 'string' ? section : section.title,
      lessons:lessons.length, words:ids.size, tasks:lessons.reduce((n,l)=>n+l.tasks.length,0)});
  });
}
for (const word of content.words) {
  for (const key of ['id','en','ru']) nonempty(word[key], `${word.id}.${key}`);
  if (!word.dictionary) for (const key of ['example','exampleRu']) nonempty(word[key], `${word.id}.${key}`);
  assert(Number(word.page) >= 6 && Number(word.page) <= 215, `${word.id}: source page`);
}
for (const lesson of content.lessons) {
  nonempty(lesson.title, `${lesson.id}.title`);
  assert(lesson.tasks.length >= (lesson.unit === -1 ? 5 : 8), `${lesson.id}: too few tasks`);
  for (const id of lesson.wordIds) assert(words.has(id), `${lesson.id}: unknown word ${id}`);
  for (const q of lesson.tasks) {
    for (const key of ['answer','explanation','prompt','en','ru']) nonempty(q[key], `${q.id}.${key}`);
    if (q.wordId) assert(words.has(q.wordId), `${q.id}: word reference`);
    assert(['choice','gap','order'].includes(q.type), `${q.id}: task type`);
    if (q.type === 'order') {
      assert.equal(bag(q.tokens.join(' ')), bag(q.answer), `${q.id}: token multiset`);
      for (const answer of q.accepted || []) assert.equal(bag(answer), bag(q.answer), `${q.id}: accepted tokens`);
      nonempty(q.hint, `${q.id}.hint`);
    } else {
      assert(q.options.length >= 3, `${q.id}: options`);
      unique(q.options.map(norm), `${q.id} options`);
      assert.equal(q.options.filter(a => a === q.answer).length, 1, `${q.id}: exactly one answer`);
    }
  }
}
const result = {passed:true, units:content.units.length, sections:report.length, words:content.words.length,
  lessons:content.lessons.length, tasks:content.lessons.reduce((n,l)=>n+l.tasks.length,0), coverage:report};
fs.mkdirSync(path.join(root,'preview/full'),{recursive:true});
fs.writeFileSync(path.join(root,'preview/full/content-validation.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
