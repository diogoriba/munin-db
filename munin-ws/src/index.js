const express = require('express');
const bodyParser = require('body-parser');
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

app.use(bodyParser.json());

app.get('/', (request, response) => {
    const commandString = request.query.cmd;
    parser.parse(commandString, { request, response, db });
});

app.get('/v1.0/:key', (request, response) => {
    const result = db.get(request.params.key);
    console.log(`GET ${request.params.key} = ${result}`);
    response.json(result);
});

app.put('/v1.0/:key', (request, response) => {
    const result = db.set(request.params.key, request.body.value, request.body.expiration); 
    console.log(`SET ${request.params.key} ${request.body.value} ${request.body.expiration} = ${result}`);
    response.json(result);
});

app.delete('/v1.0/:key', (request, response) => {
    const result = db.del(request.params.key);
    console.log(`DELETE ${request.params.key} = ${result}`);
    response.json(result);
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});