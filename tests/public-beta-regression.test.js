const fs=require('fs');
const path=require('path');
const assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

for(const id of ['map','searchForm','ribbonInput','dateInput','chipTrees','chipCloud','chipCompare','chipFinder','scanBtn','sheet']){
  assert(html.includes(`id="${id}"`),`Missing UI control #${id}`);
}
assert(!html.includes('Promise.any('),'Map endpoints must not be raced');
assert(html.includes("searchInput').addEventListener('input', ()=>$('searchResults').classList.remove('open'))"),'Input handler should only close stale results');
assert(!html.includes('setTimeout(()=>doSearch'),'Search must not run per keystroke');
assert(html.includes("searchForm').addEventListener('submit'"),'Search submit handler missing');
assert(html.includes('Weather forecast unavailable for this date.'),'Unavailable-weather notice missing');
assert(html.includes('access or seating not guaranteed'),'Zone access disclaimer missing');
assert(html.includes('Weather: <a href="https://open-meteo.com/">Open-Meteo</a>'),'Open-Meteo attribution missing');
assert(html.includes("location.hash.match(/p="),'Shared hash startup missing');
assert(html.includes('picked.length>=5'),'Five-result scan cap missing');
console.log('Passed public-beta UI wiring and safety-source checks.');

