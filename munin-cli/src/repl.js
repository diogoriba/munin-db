const Munin = require('munin-lib');
const repl = require('repl');
const yargs = require('yargs');

const db = new Munin();

const parser = 
    yargs
    .command({
        command: 'GET <key>',
        handler: (context) => {
            console.log(context.db.get(context.key));
        }
    })
    .command({
        command: 'SET <key> <value>',
        handler: (context) => {
            console.log(context.db.set(context.key, context.value));
        }
    })
    .command({
        command: 'DEL <key>',
        handler: (context) => {
            console.log(context.db.del(context.key));
        }
    })
    .command({
        command: 'DBSIZE',
        handler: (context) => {
            console.log(context.db.dbsize());
        }
    })
    .command({
        command: 'INCR <key>',
        handler: (context) => {
            console.log(context.db.incr(context.key));
        }
    })
    .command({
        command: 'ZADD <key> <score> <member>',
        handler: (context) => {
            console.log(context.db.zadd(context.key, context.score, context.member));
        }
    })
    .command({
        command: 'ZCARD <key>',
        handler: (context) => {
            console.log(context.db.zcard(context.key));
        }
    })
    .command({
        command: 'ZRANK <key> <member>',
        handler: (context) => {
            console.log(context.db.zrank(context.key, context.member));
        }
    })
    .command({
        command: 'ZRANGE <key> <start> <stop>',
        handler: (context) => {
            console.log(context.db.zrange(context.key, context.start, context.stop));
        }
    })
    .help('HELP');

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