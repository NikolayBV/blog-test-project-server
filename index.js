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


const createPath = (page) => path.resolve(__dirname, 'dist', `${page}.html`);
const PORT = 5000;

app.listen(PORT, (err) => {
    err ? console.log(err): console.log(`listening port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send(posts);
})

app.get('/posts', (req, res) => {
    if(req.query){
        const pag = req.query.page;
        const lim = req.query.limit;
        if(lim == '10'){
            if(pag == '1') res.send(posts.slice(pag - 1, lim))
            else{
                const start = (pag - 1) * lim;
                const end = +start + +lim;
                res.send(posts.slice(start, end));
            }
        }
    }
    else{
        res.send(posts);
    }
});
app.get('/posts/all', (req, res) => {
    res.send(posts);
});

app.get('/users', (req, res) => {
    res.send(users);
});

app.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    res.send(posts[id - 1])//переписать на find
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
    if (!req.body) return res.sendStatus(400);
    else return res.sendStatus(200);
})

app.put('/posts/:id', (req, res) => {
    if (!req.body) return res.sendStatus(400);
    else return res.sendStatus(200);
})

// app.delete(() => {

// })
















// const PORT = 3000;

// const server = http.createServer((req, res) => {

//     res.setHeader('Content-type', 'application/json');

//     // const createPath = (page) => path.resolve(__dirname, 'dist', `${page}.html`);
//     // console.log(posts)
//     // fs.readFile('./frontend/dist/index.html', (err, data) => {
//     //     if(err){
//     //         console.log(err);
//     //         res.end();
//     //     }
//     //     else{
//     //         res.write(data);
//     //         res.end();
//     //     }
//     // })
//     fs.readFile('./server/posts.json', 'utf-8', (err, data) => {
//         if(!err){
//             res.end(data);
//             res.end();
//         }
//         else{
//             console.log(err);
//             res.end();
//         }
//     })   
// });


// server.listen(PORT, 'localhost', (error) => {
//     error ? console.log(error): console.log(`listening port ${PORT}`)
// })