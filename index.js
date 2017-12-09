// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var shopifyAPI = require('shopify-node-api');

var databaseUri = 'mongodb://heroku_qphgm0pv:269fjf9ulntucikkqav9h4jb6i@ds117316.mlab.com:17316/heroku_qphgm0pv';


var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'rrenterprisesklj20fj902knopi',
  masterKey: process.env.MASTER_KEY || 'lkjklJO209Klkjo3lkLqz038', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  enableAnonymousUsers: process.env.ANON_USERS || false,
  allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || false,
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});

// var Shopify = new shopifyAPI({
//     shop: 'https://rapidware.myshopify.com',// MYSHOP.myshopify.com
//     shopify_api_key: 'e2f4c217881b1ac594b692be0817b461', // Your API key
//     access_token: '1d473411cd507320627284dad7797ace' // Your API password
// });
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website1.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
