import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessions, sessionSchema, totals, sportStats, calendar, filterSessions, volumeLevel, paceLabel, type Session } from '../src/lib/data';
const run:Session={id:'test-run',date:'2026-01-01',sport:'Running',title:'Test',minutes:42,km:7,effort:'Easy',demo:true};
const strength:Session={id:'test-strength',date:'2026-01-01',sport:'Strength',title:'Test force',minutes:25,effort:'Moderate',demo:true,exercises:[{name:'Squat',sets:3,reps:8,kg:40}]};
test('les agrégats additionnent seulement les données disponibles',()=>{
 assert.deepEqual(totals([run,strength]),{count:2,minutes:67,km:7});assert.deepEqual(totals([]),{count:0,minutes:0,km:0});
 const stats=sportStats([strength,run]);assert.equal(stats.running.count,1);assert.equal(stats.strength.minutes,25);assert.deepEqual(stats.strength.exercises,['Squat']);assert.deepEqual(stats.running.records,[]);assert.equal(paceLabel(run),'6:00 /km');assert.equal(paceLabel({...run,km:undefined}),undefined);
});
test('le schéma rejette les dates, disciplines et valeurs incohérentes',()=>{
 for(const bad of [{minutes:-1},{date:'2026-02-31'},{date:'2025-02-29'},{sport:'Cycling'},{sport:'Strength',km:5},{id:'../bad'},{demo:false},{exercises:[]}])assert.equal(sessionSchema.safeParse({...run,...bad}).success,false);
 assert.equal(sessionSchema.safeParse({...run,date:'2024-02-29'}).success,true);
 assert.equal(sessionSchema.safeParse({...strength,exercises:[{name:'Squat',sets:0,reps:8}]}).success,false);
 assert.equal(sessionSchema.safeParse({...strength,exercises:[{name:'Squat',sets:3,kg:40}]}).success,false);
});
test('une journée combine plusieurs séances et les filtres changent le volume',()=>{
 const combined=calendar([run,strength],2026,'2026-10-29');const jan1=combined.find(day=>day.date===run.date)!;
 assert.equal(jan1.minutes,67);assert.equal(jan1.level,3);assert.equal(jan1.activities.length,2);
 assert.equal(calendar([run,strength],2026,'2026-10-29','Running').find(day=>day.date===run.date)!.minutes,42);
 assert.equal(calendar([run,strength],2026,'2026-10-29','Strength').find(day=>day.date===run.date)!.level,1);
});
test('le calendrier gère les années bissextiles et les semaines chevauchantes',()=>{
 for(const [year,count] of [[2024,366],[2025,365],[2026,365],[2027,365],[2012,366]]){
  const days=calendar([],year!,'2026-10-29');assert.equal(days.filter(day=>!day.outside).length,count);assert.equal(days.length%7,0);assert.equal(new Date(days[0]!.date).getUTCDay(),1);assert.equal(new Set(days.map(day=>day.date)).size,days.length);assert.ok(days.find(day=>day.date===`${year}-01-01`));assert.ok(days.find(day=>day.date===`${year}-12-31`));
 }
 assert.ok(calendar([],2024).some(day=>day.date==='2024-02-29'));assert.ok(!calendar([],2025).some(day=>day.date==='2025-02-29'));
});
test('les dates futures et les autres années ne deviennent pas de l’activité',()=>{
 const future={...run,id:'future',date:'2026-12-31'};assert.equal(filterSessions([run,future],2026).length,1);assert.equal(filterSessions([run],2025).length,0);
 const day=calendar([future],2026).find(day=>day.date===future.date)!;assert.equal(day.future,true);assert.equal(day.minutes,0);assert.equal(calendar([run],2027).filter(day=>!day.outside&&!day.future).length,0);
 assert.throws(()=>calendar([],2026,'bad'));assert.throws(()=>calendar([],2026.5));
});
test('les seuils sont fixes et le jeu de démonstration est intègre',()=>{
 assert.deepEqual([0,1,29,30,59,60,89,90,150].map(volumeLevel),[0,1,1,2,2,3,3,4,4]);assert.equal(new Set(sessions.map(session=>session.id)).size,sessions.length);assert.ok(sessions.every(session=>session.demo));
 const filtered=filterSessions(sessions,2026);assert.equal(calendar(sessions,2026).reduce((sum,day)=>sum+day.minutes,0),totals(filtered).minutes);
});
