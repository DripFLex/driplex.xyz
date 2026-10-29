import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sessions,sessionSchema,totals,calendar} from '../src/lib/data';
test('les totaux reflètent les séances locales',()=>{assert.deepEqual(totals(sessions),{count:6,minutes:282,km:30.7});assert.deepEqual(totals(sessions.filter(s=>s.sport==='Strength')),{count:2,minutes:100,km:0});assert.deepEqual(totals([]),{count:0,minutes:0,km:0});});
test('le schéma rejette les données incohérentes',()=>{const s=sessions[0]!;for(const bad of [{minutes:-1},{date:'2026-02-31'},{sport:'Cycling'},{sport:'Strength',km:5},{id:'../bad'}])assert.equal(sessionSchema.safeParse({...s,...bad}).success,false);});
test('le calendrier est aligné lundi et contient chaque séance',()=>{const days=calendar(sessions);assert.equal(new Date(days[0]!.date).getUTCDay(),1);assert.equal(days.length,35);assert.equal(days.filter(d=>d.minutes>0).length,6);assert.equal(days.reduce((n,d)=>n+d.minutes,0),282);assert.equal(new Set(days.map(d=>d.date)).size,35);});
