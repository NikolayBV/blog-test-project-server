"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var express_1 = require("express");
var posts_json_1 = require("./data/posts.json");
var users_json_1 = require("./data/users.json");
var cors_1 = require("cors");
var fs_1 = require("fs");
var app = (0, express_1["default"])();
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
};
app.use((0, cors_1["default"])(corsOptions));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
var arrayPosts = posts_json_1["default"];
var arrayUsers = users_json_1["default"];
//todo: изменять сами файлы;
var PORT = 5000;
app.listen(PORT, function () {
    console.log("listening port ".concat(PORT));
});
app.get('/', function (req, res) {
    res.send(arrayPosts);
});
app.get('/posts', function (req, res) {
    if (Object.keys(req.query).length !== 0) {
        var pag = String(req.query.page);
        var lim = String(req.query.limit);
        var start = (Number(pag) - 1) * Number(lim);
        var end = +start + +lim;
        res.send({ posts: arrayPosts.slice(start, end), count: posts_json_1["default"].length });
    }
    else {
        res.send({ posts: arrayPosts, count: posts_json_1["default"].length });
    }
    //todo: удалить условия - done
});
app.get('/posts/:id', function (req, res) {
    var id = req.params.id;
    var post = arrayPosts.filter(function (item) { return item.id === Number(id); }); //use filter - not find
    res.send(post);
    //todo: переписать на find - done
});
app.post('/posts/:id', function (req, res) {
    arrayPosts = arrayPosts.map(function (item) {
        if (item.id === req.body.id) {
            item.id = req.body.id;
            item.title = req.body.title;
            item.body = req.body.body;
            return item;
        }
        return item;
    });
    fs_1["default"].writeFile('./data/posts.json', JSON.stringify(arrayPosts), function (err) {
        if (err)
            res.sendStatus(404);
        var myObj = req.body;
        res.send(myObj);
    });
});
app["delete"]('/posts/:id', function (req, res) {
    var id = req.params.id;
    arrayPosts = arrayPosts.filter(function (post) {
        return String(post.id) !== id;
    });
    fs_1["default"].writeFile('./data/posts.json', JSON.stringify(arrayPosts), function (err) {
        if (err)
            res.sendStatus(404);
        var myObj = req.body;
        res.send(myObj);
    });
});
app.get('/users', function (req, res) {
    res.send(arrayUsers);
});
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    res.send(arrayUsers.find(function (item) { return item.id === Number(id); }));
    //todo: переписать на find
});
app.post('/users/:id', function (req, res) {
    arrayUsers = arrayUsers.map(function (item) {
        if (item.id === req.body.id) {
            //do something
            return item;
        }
        return item;
    });
    fs_1["default"].writeFile('./data/users.json', JSON.stringify(arrayUsers), function (err) {
        if (err)
            res.sendStatus(404);
        var myObj = req.body;
        res.send(myObj);
    });
});
app["delete"]('/users/:id', function (req, res) {
    var id = req.params.id;
    arrayPosts = arrayPosts.filter(function (user) {
        return String(user.id) !== id;
    });
    fs_1["default"].writeFile('./data/users.json', JSON.stringify(arrayUsers), function (err) {
        if (err)
            res.sendStatus(404);
        var myObj = req.body;
        res.send(myObj);
    });
});
// todo: app.put();
app.put('/posts', function (req, res) {
    var findPost = users_json_1["default"].find(function (user) { return user.name === req.body.author; });
    if (!findPost)
        res.send(404);
    var post = {
        id: Date.now(),
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    };
    arrayPosts = __spreadArray(__spreadArray([], arrayPosts, true), [post], false);
    fs_1["default"].writeFile('./data/posts.json', JSON.stringify(arrayPosts), function (err) {
        if (err)
            res.sendStatus(404);
        var myObj = req.body;
        res.send(myObj);
    });
});
