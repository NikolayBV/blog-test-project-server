import path from 'path';
import express from 'express';
import posts from './data/posts.json' assert {type: 'json'};
import users from './data/users.json' assert {type: 'json'};
import cors from 'cors';

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
        res.send(arrayPosts.slice(start, end));
    }
    else if(Object.keys(req.query).length === 0){
        res.send(arrayPosts);
    }

    //todo: удалить условия
});


app.get('/users', (req, res) => {
    res.send(arrayUsers);
});

app.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    let post = arrayPosts.find(item => item.id == id)
    res.send(post)
    //todo: переписать на find
});

app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    res.send(arrayUsers.find(item => item.id === id))
    //todo: переписать на find
});

// app.get('/posts/:id/:user', (req, res) => {
//     let id = req.params.id;
//     let user = users.find((item) => {
//         return item.id == posts[id].userId;
//     });
//     res.send(user);
// });

app.put('/posts/:id', (req, res) => {
    try{
        arrayPosts = arrayPosts.map((post) => {
            if(post.id === req.body.id){
                post.id = req.body.id
                post.title = req.body.title
                post.body = req.body.body
            }
            return post;
        })
        //todo: использовать find и обработать ошибку, сгенерировать новый id;
        //post - добавление, put - измененеи
        res.sendStatus(200);
    }
    catch (e){
        res.sendStatus(404);
    }
})


// app.post('/posts/add/:id', (req, res) => {
//     const post = {
//         id: req.body.id,
//         title: req.body.title,
//         body: req.body.body,
//         author: req.body.author
//     }
//     arrayPosts = [...arrayPosts, post];
//     res.sendStatus(200);
// })

// todo: app.put();
app.put('/create', (req, res) => {
    const post= {
        id: Date.now(),
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
