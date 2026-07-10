const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
function extractFunction(name){
  const start=html.indexOf(`function ${name}(`);
  assert(start>=0,`Missing function ${name}`);
  const next=html.indexOf('\nfunction ',start+10);
  assert(next>start,`Unclosed function ${name}`);
  return html.slice(start,next).trim();
}
const context={Intl,Date,console}; vm.createContext(context);
for(const name of ['zonedParts','civilDateTimeToUtc','parseHeight']) vm.runInContext(extractFunction(name),context);

const cases=[
  ['Europe/Dublin','2026-01-15',720,'2026-01-15T12:00:00.000Z'],
  ['Europe/Madrid','2026-01-15',720,'2026-01-15T11:00:00.000Z'],
  ['America/New_York','2026-01-15',720,'2026-01-15T17:00:00.000Z'],
  ['Asia/Tokyo','2026-01-15',720,'2026-01-15T03:00:00.000Z'],
  ['Europe/Dublin','2026-07-15',720,'2026-07-15T11:00:00.000Z'],
  ['Europe/Madrid','2026-07-15',720,'2026-07-15T10:00:00.000Z'],
  ['America/New_York','2026-07-15',720,'2026-07-15T16:00:00.000Z'],
  ['Asia/Tokyo','2026-07-15',720,'2026-07-15T03:00:00.000Z']
];
for(const [zone,key,minutes,expected] of cases){
  assert.strictEqual(context.civilDateTimeToUtc(key,minutes,zone).toISOString(),expected,`${zone} conversion`);
}

const close=(actual,expected)=>assert(Math.abs(actual-expected)<0.001,`${actual} != ${expected}`);
close(context.parseHeight({height:'10 m'},9).h,10);
close(context.parseHeight({height:'30 ft'},9).h,9.144);
close(context.parseHeight({height:"30'"},9).h,9.144);
close(context.parseHeight({'building:levels':'3'},9).h,10.6);
assert.deepStrictEqual(JSON.parse(JSON.stringify(context.parseHeight({},9))),{h:9,hasData:false});
console.log(`Passed ${cases.length} timezone and 5 height parsing checks.`);

