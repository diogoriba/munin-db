import test from 'ava';
import Munin from '../src/munin';
import SortedSet from 'redis-sorted-set';

const key = 'test-key';
const member = 'test-member';

test('zadd adds a new set at key, with given score/member', t => {
    const db = new Munin();
    const zaddResult = db.zadd(key, 10, member);
    t.is(zaddResult, 1);
    const getResult = db.get(key);
    t.true(getResult instanceof SortedSet);
    t.is(getResult.length, 1);
    t.is(getResult.score(member), 10);
});

test('zcard tracks cardinality of a set', t => {
    const db = new Munin();
    db.zadd(key, 1, 'test-member-1');
    db.zadd(key, 1, 'test-member-2');
    db.zadd(key, 2, 'test-member-3');
    db.zadd(key, 2, 'test-member-4');
    db.zadd(key, 3, 'test-member-5');

    const result = db.zcard(key);
    t.is(result, 5);
});

test('zcard returns 0 for a key that does not have a set', t => {
    const db = new Munin();
    const setResult = db.set(key, 10);
    t.is(setResult, db.OK);
    const result = db.zcard(key);
    t.is(result, 0);
});

test('zcard returns 0 for a key that is not set', t => {
    const db = new Munin();
    const result = db.zcard(key);
    t.is(result, 0);
});

test('zcard returns 0 for a key that is set to undefined', t => {
    const db = new Munin();
    const setResult = db.set(key, undefined);
    t.is(setResult, db.OK);
    const result = db.zcard(key);
    t.is(result, 0);
});

test('zrank tracks the rank of a member in a set', t => {
    const db = new Munin();
    db.zadd(key, 1, 'test-member-1');
    db.zadd(key, 2, 'test-member-2');
    db.zadd(key, 3, 'test-member-3');

    const result = db.zrank(key, 'test-member-3');
    t.is(result, 2);
});

test('zrange yields the list of members within a score range', t => {
    const db = new Munin();
    db.zadd(key, 5, 'test-member-1');
    db.zadd(key, 2, 'test-member-2');
    db.zadd(key, 3, 'test-member-3');
    db.zadd(key, 1, 'test-member-4');
    db.zadd(key, 4, 'test-member-5');

    const result = db.zrange(key, 2, 4);
    t.is(result.length, 3);
    t.is(result[0], 'test-member-3');
    t.is(result[1], 'test-member-5');
    t.is(result[2], 'test-member-1');
});