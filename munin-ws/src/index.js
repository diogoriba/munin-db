const express = require('express');
const bodyParser = require('body-parser');
const range = require('express-range');
const { Munin, parserBuilder } = require('munin-lib');

const app = express();
const db = new Munin();
const outputDecorator = (fn) => {
    return (context) => {
        const result = fn(context);
        console.log(`RAW COMMAND '${context.commandString}' = ${result}`);
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
    parser.parse(commandString, { commandString, request, response, db });
});

app.get('/v1.0/:key/:member?', range({ accept: 'score', limit: '1000' }), (request, response) => {
    if (request.params.member) {
        const result = db.zrank(request.params.key, request.params.member);
        console.log(`ZRANK ${request.params.key} ${request.params.member} = ${result}`);
        response.json(result);
    } else if (request.headers.range) {
        response.range({
            unit: response.range.unit,
            first: response.range.first,
            last: response.range.last
        });

        if (request.range.unit == 'score' && request.range.first < request.range.last) {
            const result = db.zrange(request.params.key, request.range.first, request.range.last);
            console.log(`ZRANGE ${request.params.key} ${request.range.first} ${request.range.last} = ${result}`);
            response.json(result);
        } else {
            response.status(416).send('Provided range is not satisfiable. Please use "score" as a unit and use a valid range.');
        }
    } else {
        const result = db.get(request.params.key);
        if (result instanceof Munin.SortedSet) {
            response.status(500).send('GET result could not be serialized, since content of this key is a sorted set.');
        } else {
            console.log(`GET ${request.params.key} = ${result}`);
            response.json(result);
        }
    }
});

app.put('/v1.0/:key', (request, response) => {
    if (request.body.score && request.body.member) {
        const result = db.zadd(request.params.key, request.body.score, request.body.member);
        console.log(`ZADD ${request.params.key} ${request.body.score} ${request.body.member} = ${result}`);
        response.json(result);
    } else if (request.body.value) {
        const result = db.set(request.params.key, request.body.value, request.body.expiration); 
        console.log(`SET ${request.params.key} ${request.body.value} ${request.body.expiration} = ${result}`);
        response.json(result);
    } else {
        response.status(400).send('A PUT request should either include "value" in its body for \
            setting the value of a key or it should include "score" and "member" for manipulating sets');
    }
});

app.delete('/v1.0/:key', (request, response) => {
    const result = db.del(request.params.key);
    console.log(`DELETE ${request.params.key} = ${result}`);
    response.json(result);
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});