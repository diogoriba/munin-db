## Munin REPL tool

This tool can be called from a command prompt to interact with a Munin database.

To initialize this module, run ```npm install``` in the munin-cli/ folder.

To run the REPL tool, you can invoke either ```npm start``` or ```node src/repl.js``` from a nodejs-enabled terminal.

### Available commands

Commands are case-sensitive.

```
SET key value
SET key value EX expiration
GET key
DEL key
DBSIZE
INCR key
ZADD key score member
ZCARD key
ZRANK key member
ZRANGE key start stop
```