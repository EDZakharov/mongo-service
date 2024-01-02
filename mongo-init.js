const myDB = db.getSiblingDB('mongotest');

myDB.createUser({
    user: 'ro',
    pwd: 'readonly',
    roles: [{ role: 'read', db: 'mongotest' }],
});

myDB.createUser({
    user: 'admin',
    pwd: 'admin123',
    roles: ['root'],
});

myDB.createUser({
    user: 'rw',
    pwd: 'readwrite',
    roles: [{ role: 'readWrite', db: 'mongotest' }],
});
