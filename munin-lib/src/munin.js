const errors = require('./munin-errors.js');

const muninLib = (function muninLib() {
    const ctor = function() {
        this.hashStorage = new Map();
    };

    ctor.prototype.get = function get(key) {
        return this.hashStorage.get(key);
    };

    ctor.prototype.set = function set(key, value) {
        return this.hashStorage.set(key, value);
    };

    ctor.prototype.del = function del(key) {
        if (this.hashStorage.has(key)) {
            return this.hashStorage.delete(key);
        } else {
            throw new errors.CannotDeleteInexistentKey(key);
        }
    };

    return ctor;
}());

module.exports = muninLib;
