import test from 'ava';
import Munin from '../src/munin';
import SortedSet from 'redis-sorted-set';

test.beforeEach(t => {
    t.context.db = new Munin();
});

const key = 'test-key';
const member = 'test-member';

test.serial('zadd adds a new set at key, with given score/member', t => {
    const result = t.context.db.zadd(key, 10, member);
    t.is(result, 1);
    const set = t.context.db.get(key);
    t.true(set instanceof SortedSet);
    t.is(set.length, 1);
    t.is(set.score(member), 10);
});