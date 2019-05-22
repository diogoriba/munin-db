import test from 'ava';
import Munin from '../src/munin';

test.beforeEach(t => {
    t.context.db = new Munin();
});

const key = 'test-key';
const value = 'yay!';

test.serial('get returns nil when key is not set', t => {
    const result = t.context.db.get(key);
    t.is(result, t.context.db.NIL);
});

test.serial('set appropriately changes the value of a key', t => {
    t.context.db.set(key, value);
    const result = t.context.db.get(key);
    t.is(result, value);
});

test.serial('del appropriately removes a key', t => {
    t.context.db.set(key, value);
    const result1 = t.context.db.get(key);
    t.is(result1, value);
    const delResult = t.context.db.del(key);
    t.is(delResult, 1);
    const result2 = t.context.db.get(key);
    t.is(result2, t.context.db.NIL);
});

test.serial('del can\'t remove a non-existent key', t => {
    const delResult = t.context.db.del(key);
    t.is(delResult, 0);
});

test.serial('dbsize returns correct number of keys', t => {
    const result1 = t.context.db.dbsize();
    t.is(result1, 0);
    t.context.db.set(key, value);
    const result2 = t.context.db.dbsize();
    t.is(result2, 1);
});

test.serial('incr increases the value of a key by 1', t => {
    t.context.db.set(key, 10);
    const result = t.context.db.incr(key);
    t.is(result, 11);
    const getResult = t.context.db.get(key);
    t.is(getResult, 11);
});

test.serial('incr fails to increase the value of a key for which value is not a number', t => {
    t.context.db.set(key, value);
    const result = t.context.db.incr(key);
    t.is(result, t.context.db.NIL);
    const getResult = t.context.db.get(key);
    t.is(getResult, value);
});