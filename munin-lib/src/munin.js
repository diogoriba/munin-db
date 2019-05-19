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

    return ctor;
}());

module.exports = muninLib;
