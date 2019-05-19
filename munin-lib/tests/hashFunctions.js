import test from 'ava';
import munin from '../src/munin';

test.beforeEach(t => {
    t.context.db = new munin();
});

test('get returns nil when key is not set', t => {
    const result = t.context.db.get('test-key');
    t.is(result, undefined);
});

test('set appropriately changes the value of a key', t => {
    const value = 'yay!';
    t.context.db.set('test-key', value);
    const result = t.context.db.get('test-key');
    t.is(result, value);
});