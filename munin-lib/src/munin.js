const muninLib = (function muninLib() {
    const ctor = function() {
        this.hashStorage = new Map();
    };

    ctor.prototype.get = function get(key) {
        return this.hashStorage.get(key);
    };

    return ctor;
}());

module.exports = muninLib;
