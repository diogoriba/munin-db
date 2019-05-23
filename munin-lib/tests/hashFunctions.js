import test from 'ava';
import Munin from '../src/munin';

const key = 'test-key';
const value = 'yay!';

test('get returns nil when key is not set', t => {
    const db = new Munin();
    const result = db.get(key);
    t.is(result, db.NIL);
});

test('set appropriately changes the value of a key', t => {
    const db = new Munin();
    const setResult = db.set(key, value);
    t.is(setResult, db.OK);
    const result = db.get(key);
    t.is(result, value);
});

test.cb('set will expire a key', t => {
    const db = new Munin();
    t.plan(3);
    const setResult = db.set(key, value, 1);
    t.is(setResult, db.OK);
    const result1 = db.get(key);
    t.is(result1, value);

    setTimeout(() => {
        const result2 = db.get(key);
        t.is(result2, db.NIL);
        t.end();
    }, 1000);
});

test('del appropriately removes a key', t => {
    const db = new Munin();
    const setResult = db.set(key, value);
    t.is(setResult, db.OK);
    const result1 = db.get(key);
    t.is(result1, value);
    const delResult = db.del(key);
    t.is(delResult, 1);
    const result2 = db.get(key);
    t.is(result2, db.NIL);
});

test('del can\'t remove a non-existent key', t => {
    const db = new Munin();
    const delResult = db.del(key);
    t.is(delResult, 0);
});

test('dbsize returns correct number of keys', t => {
    const db = new Munin();
    const result1 = db.dbsize();
    t.is(result1, 0);
    const setResult = db.set(key, value);
    t.is(setResult, db.OK);
    const result2 = db.dbsize();
    t.is(result2, 1);
});

test('incr increases the value of a key if it is not set', t => {
    const db = new Munin();
    const result = db.incr(key);
    t.is(result, 1);
    const getResult = db.get(key);
    t.is(getResult, 1);
});

test('incr increases the value of a key by 1', t => {
    const db = new Munin();
    const setResult = db.set(key, 10);
    t.is(setResult, db.OK);
    const result = db.incr(key);
    t.is(result, 11);
    const getResult = db.get(key);
    t.is(getResult, 11);
});

test('incr fails to increase the value of a key for which value is not a number', t => {
    const db = new Munin();
    const setResult = db.set(key, value);
    t.is(setResult, db.OK);
    const result = db.incr(key);
    t.is(result, db.NIL);
    const getResult = db.get(key);
    t.is(getResult, value);
});