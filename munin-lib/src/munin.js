const errors = require('./munin-errors.js');
const SortedSet = require('redis-sorted-set');
const Moment = require('moment');

const MuninSelfEvalFunction = (function muninLib() {
    const Munin = function() {
        this.hashStorage = new Map();
    };

    const OK = "OK";
    const NIL = "(nil)";

    // public
    Munin.prototype.OK = OK;
    Munin.prototype.NIL = NIL;
    Munin.SortedSet = SortedSet;

    Munin.prototype.get = function get(key) {
        if (this.hashStorage.has(key)) { 
            const entry = this.hashStorage.get(key);
            // checking for expiration on get is slightly taxing on the get method.
            // alternatively, it could be done by adding a function to the event loop in the set method,
            // i.e. setTimeout(() => { this.del(key) }, expiration * 1000);
            // but it would clog the event queue, which is undesirable for services that may deal
            // with a large number of requests already.
            if (!entry.expiration || Moment().isBefore(entry.expiration)) {
                return entry.value;
            } else {
                this.del(key);
            }
        }
        return NIL;
    };

    Munin.prototype.set = function set(key, value, expiration) {
        const entry = { value };
        if (expiration > 0) {
            entry.expiration = Moment().add(expiration, 'seconds');
        }
        this.hashStorage.set(key, entry);
        return OK;
    };

    Munin.prototype.del = function del(...keys) {
        const result = keys.reduce((accumulator, key) => {
            if (this.hashStorage.delete(key)) {
                return accumulator + 1;
            } else {
                return accumulator;
            }
        }, 0);
        return result;
    };

    Munin.prototype.dbsize = function dbsize() {
        return this.hashStorage.size;
    };

    Munin.prototype.incr = function incr(key) {
        let value = this.get(key);
        if (value !== NIL && !(isNaN(value))) {
            const tempValue = value + 1;
            this.set(key, tempValue);
            return tempValue;
        } else {
            return NIL;
        }
    };

    Munin.prototype.zadd = function zadd(key, score, member) {
        let sortedSet = this.get(key);
        if (sortedSet === NIL) {
            sortedSet = new SortedSet();
            this.set(key, sortedSet);
        }

        if (!(sortedSet instanceof SortedSet)) {
            return 0;
        } else {
            sortedSet.add(member, score);
            return 1;
        }
    };

    Munin.prototype.zcard = function zcard(key) {
        const sortedSet = this.get(key);
        if (sortedSet !== NIL && sortedSet instanceof SortedSet) {
            return sortedSet.card();
        }

        return 0;
    };

    Munin.prototype.zrank = function zrank(key, member) {
        let sortedSet = this.get(key);
        if (sortedSet !== NIL && sortedSet instanceof SortedSet) {
            return sortedSet.rank(member);
        }

        return NIL;
    };

    Munin.prototype.zrange = function zrange(key, start, stop) {
        let sortedSet = this.get(key);
        if (sortedSet !== NIL && sortedSet instanceof SortedSet) {
            return sortedSet.range(start, stop);
        }

        return NIL;
    }

    return Munin;
}());

module.exports = MuninSelfEvalFunction;
