const errors = require('./munin-errors.js');

const Munin = (function muninLib() {
    const ctor = function() {
        this.hashStorage = new Map();
    };

    const OK = "OK";
    const NIL = "(nil)";

    // public
    ctor.prototype.OK = OK;
    ctor.prototype.NIL = NIL;

    ctor.prototype.get = function get(key) {
        if (this.hashStorage.has(key)) { 
            return this.hashStorage.get(key);
        } else {
            return NIL;
        }
    };

    ctor.prototype.set = function set(key, value) {
        this.hashStorage.set(key, value);
        return OK;
    };

    ctor.prototype.del = function del(...keys) {
        const result = keys.reduce((accumulator, key) => {
            if (this.hashStorage.delete(key)) {
                return accumulator + 1;
            } else {
                return accumulator;
            }
        }, 0);
        return result;
    };

    ctor.prototype.dbsize = function dbsize() {
        return this.hashStorage.size;
    };

    return ctor;
}());

module.exports = Munin;
