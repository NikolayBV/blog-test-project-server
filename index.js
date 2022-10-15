import path from 'path';
import express from 'express';
import posts from './data/posts.json' assert {type: 'json'};
import users from './data/users.json' assert {type: 'json'};
import cors from 'cors';

const app = express();
const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let arrayPosts = posts;
const createPath = (page) => path.resolve(__dirname, 'dist', `${page}.html`);
const PORT = 5000;

app.listen(PORT, (err) => {
    err ? console.log(err): console.log(`listening port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send(arrayPosts);
})

app.get('/posts', (req, res) => {
    if(req.query){
        const pag = req.query.page;
        const lim = req.query.limit;
        if(lim == '10'){
            if(pag == '1') res.send(arrayPosts.slice(pag - 1, lim))
            else{
                const start = (pag - 1) * lim;
                const end = +start + +lim;
                res.send(arrayPosts.slice(start, end));
            }
        }
    }
    else{
        res.send(arrayPosts);
    }
});
app.get('/posts/all', (req, res) => {
    res.send(arrayPosts);
});

app.get('/users', (req, res) => {
    res.send(users);
});

app.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    res.send(arrayPosts[id - 1])//переписать на find
});

app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    res.send(users[id - 1])
});

app.get('/posts/:id/:user', (req, res) => {
    let id = req.params.id;
    let user = users.find((item) => {
        return item.id == posts[id].userId;
    });
    res.send(user);
});

app.post('/posts/:id', (req, res) => {
    arrayPosts = arrayPosts.map((post) => {
        if(post.id == req.body.id){
            post.title = req.body.title
            post.body = req.body.body
        }
        return post;
    })
    res.sendStatus(200);
})

app.post('/posts/add/:id', (req, res) => {
    const post = {
        id: req.body.id,
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    }
    arrayPosts = [...arrayPosts, post];
    res.sendStatus(200);
})


app.delete('/posts/:id',(req, res) => {
    const id = req.params.id;
    arrayPosts = arrayPosts.filter((post) => {
        return String(post.id) !== id;
    })
    res.sendStatus(200);
})
