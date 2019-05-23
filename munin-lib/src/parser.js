const yargs = require('yargs');

const parserBuilder = function (handlers) {
    return (yargs
    .command({
        command: 'GET <key>',
        handler: handlers.get
    })
    .command({
        command: 'SET <key> <value> [EX] [expiration]',
        handler: handlers.set
    })
    .command({
        command: 'DEL <key>',
        handler: handlers.del
    })
    .command({
        command: 'DBSIZE',
        handler: handlers.dbsize
    })
    .command({
        command: 'INCR <key>',
        handler: handlers.incr
    })
    .command({
        command: 'ZADD <key> <score> <member>',
        handler: handlers.zadd
    })
    .command({
        command: 'ZCARD <key>',
        handler: handlers.zcard
    })
    .command({
        command: 'ZRANK <key> <member>',
        handler: handlers.zrank
    })
    .command({
        command: 'ZRANGE <key> <start> <stop>',
        handler: handlers.zrange
    }));
};

module.exports = parserBuilder;