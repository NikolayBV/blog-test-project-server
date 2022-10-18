import path from 'path';
import express from 'express';
import posts from './data/posts.json' assert {type: 'json'};
import users from './data/users.json' assert {type: 'json'};
import cors from 'cors';
import fs from 'fs';

const app = express();
const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let arrayPosts = posts;
let arrayUsers = users;

//todo: изменять сами файлы;

const PORT = 5000;

app.listen(PORT, (err) => {
    err ? console.log(err): console.log(`listening port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send(arrayPosts);
})

app.get('/posts', (req, res) => {
    if(Object.keys(req.query).length !== 0){
        const pag = req.query.page;
        const lim = req.query.limit;

        const start = (pag - 1) * lim;
        const end = +start + +lim;
        res.send({posts: arrayPosts.slice(start, end), count: posts.length});
    }
    else{
        res.send({posts: arrayPosts, count: posts.length});
    }

    //todo: удалить условия - done
});

app.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    let post = arrayPosts.find(item => item.id == id)
    res.send(post)
    //todo: переписать на find - done
});

app.post('/posts/:id', (req, res) => {
    arrayPosts = arrayPosts.map((item) => {
            if(item.id === req.body.id){
                item.id = req.body.id
                item.title = req.body.title
                item.body = req.body.body
                return item;
            }
            return item;
    });
    fs.writeFile('./data/posts.json', JSON.stringify(arrayPosts), (err) => {
        if(err) res.sendStatus(404)
        res.send(req.body);
    })
});

app.delete('/posts/:id',(req, res) => {
    const id = req.params.id;
    arrayPosts = arrayPosts.filter((post) => {
        return String(post.id) !== id;
    })
    fs.writeFile('./data/posts.json', JSON.stringify(arrayPosts), (err) => {
        if(err) res.sendStatus(404)
        res.send(req.body);
    })
});

app.get('/users', (req, res) => {
    res.send(arrayUsers);
});

app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    res.send(arrayUsers.find(item => item.id === id))
    //todo: переписать на find
});

app.post('/users/:id', (req, res) => {
    arrayUsers = arrayUsers.map((item) => {
        if(item.id === req.body.id){
            item.id = req.body.id
            item.title = req.body.title
            item.body = req.body.body
            return item;
        }
        return item;
    });
    fs.writeFile('./data/users.json', JSON.stringify(arrayUsers), (err) => {
        if(err) res.sendStatus(404)
        res.send(req.body);
    })
});

app.delete('/users/:id',(req, res) => {
    const id = req.params.id;
    arrayPosts = arrayPosts.filter((user) => {
        return String(user.id) !== id;
    })
    fs.writeFile('./data/users.json', JSON.stringify(arrayUsers), (err) => {
        if(err) res.sendStatus(404)
        res.send(req.body);
    })
});



// todo: app.put();
app.put('/posts', (req, res) => {
    const post= {
        id: Date.now(),
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    }
    arrayPosts = [...arrayPosts, post];
    fs.writeFile('./data/posts.json', JSON.stringify(arrayPosts), (err) => {
        if(err) res.sendStatus(404)
        res.send(req.body);
    })
})

