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

test.serial('zcard tracks cardinality of a set', t => {
    t.context.db.zadd(key, 1, 'test-member-1');
    t.context.db.zadd(key, 1, 'test-member-2');
    t.context.db.zadd(key, 2, 'test-member-3');
    t.context.db.zadd(key, 2, 'test-member-4');
    t.context.db.zadd(key, 3, 'test-member-5');

    const result = t.context.db.zcard(key);
    t.is(result, 5);
});

test.serial('zcard returns 0 for a key that does not have a set', t => {
    t.context.db.set(key, 10);
    const result = t.context.db.zcard(key);
    t.is(result, 0);
});

test.serial('zcard returns 0 for a key that is not set', t => {
    const result = t.context.db.zcard(key);
    t.is(result, 0);
});

test.serial('zcard returns 0 for a key that is set to undefined', t => {
    t.context.db.set(key, undefined);
    const result = t.context.db.zcard(key);
    t.is(result, 0);
});

test.serial('zrank tracks the rank of a member in a set', t => {
    t.context.db.zadd(key, 1, 'test-member-1');
    t.context.db.zadd(key, 2, 'test-member-2');
    t.context.db.zadd(key, 3, 'test-member-3');

    const result = t.context.db.zrank(key, 'test-member-3');
    t.is(result, 2);
});

test.serial('zrange yields the list of members within a score range', t => {
    t.context.db.zadd(key, 5, 'test-member-1');
    t.context.db.zadd(key, 2, 'test-member-2');
    t.context.db.zadd(key, 3, 'test-member-3');
    t.context.db.zadd(key, 1, 'test-member-4');
    t.context.db.zadd(key, 4, 'test-member-5');

    const result = t.context.db.zrange(key, 2, 4);
    t.is(result.length, 3);
    t.is(result[0], 'test-member-3');
    t.is(result[1], 'test-member-5');
    t.is(result[2], 'test-member-1');
});