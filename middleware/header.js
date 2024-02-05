// ref: https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
// Add headers before the routes are defined
module.exports = function (req, res, next) {

    // Website you wish to allow to connect
    // If this is set to a wildcard '*' then the withCredentials
    // property for cookies will NOT work!
    // BE CAREFUL! SERIOUS STUFF!
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'x-access-token,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
}

