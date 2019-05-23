const express = require('express');
const { Munin, parserBuilder } = require('munin-lib');

const app = express();
const db = new Munin();
const outputDecorator = (fn) => {
    return (context) => {
        const result = fn(context);
        context.response.send(result);
    }
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
app.get('/', (request, response) => {
    const commandString = request.query.cmd;
    parser.parse(commandString, { request, response, db });
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});