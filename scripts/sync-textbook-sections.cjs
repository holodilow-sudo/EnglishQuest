const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const files=fs.readdirSync(path.join(root,'app')).filter(n=>/^textbook-u\d-s\d\.js$/.test(n)).sort();
const file=path.join(root,'app/index.html');let text=fs.readFileSync(file,'utf8');
const block='  <!-- textbook sections:start -->\n  <script src="textbook-builder.js"></script>\n'+files.map(n=>'  <script src="'+n+'"></script>').join('\n')+'\n  <!-- textbook sections:end -->';
if(text.includes('<!-- textbook sections:start -->'))text=text.replace(/  <!-- textbook sections:start -->[\s\S]*?  <!-- textbook sections:end -->/,block);
else text=text.replace('  <script src="textbook-practice.js"></script>',block+'\n  <script src="textbook-practice.js"></script>');
fs.writeFileSync(file,text);console.log('Loaded detailed sections: '+files.length);
