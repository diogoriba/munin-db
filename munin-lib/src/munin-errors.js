const CannotDeleteNonexistantKey = (function CannotDeleteNonexistantKey() {
    const ctor = function(key) {
        this.key = key;
    };

    ctor.prototype = Error.prototype;

    return ctor;
}());

module.exports = {
    CannotDeleteNonexistantKey
};