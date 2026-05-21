import Dexie from 'dexie';

export const db = new Dexie('PhoenixPlatformDB');
db.version(1).stores({
  assessments: '++id, firstName, lastName, email, date, archetype, score',
  readiness: '++id, firstName, lastName, email, date, score',
  execution: '++id, firstName, lastName, email, date, score',
  testimonials: '++id, firstName, lastName, status, date'
});
