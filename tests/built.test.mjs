import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';
async function htmlFiles(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?htmlFiles(join(dir,e.name)):e.name.endsWith('.html')?[join(dir,e.name)]:[]))).flat();}
test('toutes les pages générées et leurs liens internes existent',async()=>{
 const sessions=JSON.parse(await readFile('src/data/sessions.json','utf8'));
 const posts=(await readdir('src/content/posts')).filter(file=>file.endsWith('.md'));
 const pages=await htmlFiles('dist');assert.equal(pages.length,11+sessions.length+posts.length);
 for(const page of pages){const html=await readFile(page,'utf8');assert.match(html,/<html lang="en"/);assert.match(html,/<h1[ >]/);for(const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)/g)){let path=join('dist',decodeURIComponent(match[1]));if(match[1].endsWith('/'))path=join(path,'index.html');assert.ok((await stat(path)).isFile(),`${page} → ${match[1]}`);}}
});
