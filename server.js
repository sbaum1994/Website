var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');
var dataPath = path.resolve(__dirname, 'data');

// point to static assets
app.use(express.static(publicPath));

// run
app.listen(port, function () {
  console.log('Server running on port ' + port);
});

// send the data
app.get('/data', function (req, res) {
  fs.readFile('data/data.json', 'utf8', function (err, data) {
    if (err) throw err;
    return res.json(JSON.parse(data));
  });
})
