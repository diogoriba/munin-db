import test from 'ava';
import munin from '../src/munin';

test.beforeEach(t => {
    t.context.db = new munin();
});

const key = 'test-key';
const value = 'yay!';

test('get returns nil when key is not set', t => {
    const result = t.context.db.get(key);
    t.is(result, undefined);
});

test('set appropriately changes the value of a key', t => {
    t.context.db.set(key, value);
    const result = t.context.db.get(key);
    t.is(result, value);
});

test('del appropriately removes a key', t => {
    const result0 = t.context.db.get(key);
    t.is(result0, undefined);
    t.context.db.set(key, value);
    const result1 = t.context.db.get(key);
    t.is(result1, value);
    t.context.db.del(key);
    const result2 = t.context.db.get(key);
    t.is(result2, undefined);
});