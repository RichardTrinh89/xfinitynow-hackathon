var settings = require('./settings');
var Hapi = require('hapi'),
    Blipp = require('blipp'),
    routes = require('./routes');

var server = new Hapi.Server({
})


// Define PORT number You can change it if you want
server.connection({
    port: settings.SERVER_PORT,
    router: {
        isCaseSensitive: false,
        stripTrailingSlash: true  
    },
    routes: {
        cors: true
    }
});

var swaggerOptions = {
    pathPrefixSize: "2"
}

// Register Swagger Plugin ( Use for documentation and testing purpose )
server.register([
    require('inert'),
    require('vision'),
    {
    register: require('hapi-swagger'),
    options: swaggerOptions
}], function(err) {
    if (err) {
        server.log(['error'], 'hapi-swagger load error: ' + err);
    } else {
        server.log(['start'], 'hapi-swagger interface loaded');
    }
});

// Register Good Plugin ( Use to log API url's hit on server )
server.register({
        register: require('good'),
        options: {
            ops: {
                interval: 60000
            },
            reporters: {
                console: [
                    {
                        module: 'good-console'
                    }, 'stdout'
                ]
            }
        }
    }, (err) => {
        if (err) {
            console.error(err);
        }
    }
);

server.register({
  register: Blipp,
  options: {
    showAuth: true
  }
})

// Register routes
routes.set(server);

// Lets start the server
server.start(function() {
    console.log('Server running at:', server.info.uri);
});
