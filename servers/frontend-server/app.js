var path = require('path');
var express = require('express');

var app = express();

app.use(express.static(path.join(__dirname, '/dist')));

app.get('/*', function (req, res) {
    res.sendfile("index.html", { root: path.join(__dirname, '/dist') });
});

app.listen(3000, function () {
    console.log("Frontend App is running at localhost: 3000")
});