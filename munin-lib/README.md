## Munin Lib

This component is the core set of functions that will allow you to operate a redis-like in-memory key-value db.

It is not in the npm registry, but it can be installed as an npm module from the filesystem:

```npm i <path-to>/munin-lib/ --save```

To initialize this module, run ```npm install``` in the munin-lib/ folder.

To run unit tests on it, use ```npm test```.

### Some design choices and the reasoning behind them

Regarding atomicity: nodejs and javascript in general are single-threaded by design, but can execute concurrent operations through the event loop. The event loop resolves the operations serially, in the order they were added to it, which will guarantee atomic access to the operations. If we wanted to take this one step further, a use of a locking mechanism as a lockfile or another I/O based mutex would be ideal. This could be added by simply wrapping the prototype functions of munin-lib into a module that holds execution if the mutex is locked.

I used a third party library that implements the sorted sets akin to the ones in redis, by using skip lists as a base data structure. I chose this because I understand what the underlying logic of this module is doing to accomplish this, and the benefits/penalties we get from it, both performance-wise and memory-usage-wise. I could have implemented my own version of it, but given the time I had available for this test, it would be merely a shadow of what I wanted it to be, much simpler, and basically a list of lists, ordered by rank on write. This does not give us the benefit of the lookup/write speeds that the skip lists implementation yield, and would look careless to anyone reviewing it.