const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../app');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf'};
const port=Number(process.env.QUEST_PORT||4173);
const server=http.createServer((req,res)=>{let url;try{url=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end();return}const file=path.resolve(root,'.'+(url==='/'?'/index.html':url));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data)})});
server.listen(port,'127.0.0.1',()=>console.log(`English Quest preview: http://127.0.0.1:${port}`));
