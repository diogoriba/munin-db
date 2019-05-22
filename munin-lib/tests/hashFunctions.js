import test from 'ava';
import Munin from '../src/munin';

test.beforeEach(t => {
    console.log('creating new instance of db');
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
    const result0 = t.context.db.get(key);
    t.is(result0, t.context.db.NIL);
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