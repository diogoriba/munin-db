### Munin REST web service

This package provides a RESTful interface to operations in the Munin database.

To initialize this module, run ```npm install``` in the munin-ws/ folder.

To start the service, run ```npm start```.

Postman request collection is available as a json file in this folder.
Documentation of available requests and how to use them is available at https://documenter.getpostman.com/view/7629499/S1TPcgPg?version=latest.

### Design choices

I'm using the same parser used on the CLI to detect which command is being executed for the endpoint that runs raw commands. Though it is not the purest design, it gets the job done and uses minimal additional code to perform a task that is common between both modules.

Also using api version prefixes to allow changes in the API futurely without requiring us to implement backwards compatibility in the same endpoints.

Ideally, upon further iteration, I would use routers to correctly resolve each API call, but for an initial implementation, this will work.

Practices like console.log and not using external environment configuration would not be acceptable in a production environment, but I assumed that would be ok for the exercise scope.