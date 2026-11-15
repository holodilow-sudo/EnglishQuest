const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
module.exports=function(root=path.resolve(__dirname,'..')){
 const context=vm.createContext({window:{}});
 const sections=fs.readdirSync(path.join(root,'app')).filter(n=>/^textbook-u\d-s\d\.js$/.test(n)).sort();
 for(const file of ['content.js','textbook-pages.js','textbook-content.js','textbook-dialogues.js','textbook-translations.js','textbook-extra.js','textbook-builder.js',...sections,'textbook-practice.js'])vm.runInContext(fs.readFileSync(path.join(root,'app',file),'utf8'),context,{filename:file});
 return {content:vm.runInContext('CONTENT',context),study:context.window.TextbookStudy,pages:context.window.TextbookPages};
};
if(require.main===module)process.stdout.write(JSON.stringify(module.exports()));
