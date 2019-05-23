const { Munin, parserBuilder } = require('munin-lib');
const repl = require('repl');

const db = new Munin();
const outputDecorator = (fn) => {
    return function () {
        console.log(fn(...arguments));
    };
};

const handlers = {
    get: outputDecorator((context) => context.db.get(context.key)),
    set: outputDecorator((context) => context.db.set(context.key, context.value, context.expiration)),
    del: outputDecorator((context) => context.db.del(context.key)),
    dbsize: outputDecorator((context) => context.db.del(context.key)),
    incr: outputDecorator((context) => context.db.incr(context.key)),
    zadd: outputDecorator((context) => context.db.zadd(context.key, context.score, context.member)),
    zcard: outputDecorator((context) => context.db.zcard(context.key)),
    zrank: outputDecorator((context) => context.db.zrank(context.key, context.member)),
    zrange: outputDecorator((context) => context.db.zrange(context.key, context.start, context.stop))
}

const parser = parserBuilder(handlers);

const eval = function (cmd, replContext, filename, callback) {
    parser.parse(cmd, replContext, (err, a, b, output) => {
        callback(err);
    });
};

const replServer = repl.start({
    prompt: 'munin > ',
    eval: eval
});

replServer.context.db = db;
module.exports = replServer;