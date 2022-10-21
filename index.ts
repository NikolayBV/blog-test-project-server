import express from "express";
import posts from "./data/posts.json";
import users from "./data/users.json";
import cors from "cors";
import fs from "fs";
import {IPost, IUser} from "./data/models/models";

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

app.listen(PORT, () => {
    console.log(`listening port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send(arrayPosts);
})

interface PostsObjSend{
    posts: Array<IPost>,
    count: number
}

app.get<PostsObjSend>('/posts', (req, res) => {
    if(Object.keys(req.query).length !== 0){
        const pag: string = String(req.query.page);
        const lim: string = String(req.query.limit);

        const start: number = (Number(pag) - 1) * Number(lim);
        const end: number = +start + +lim;
        res.send({posts: arrayPosts.slice(start, end), count: posts.length});
    }
    else{
        res.send({posts: arrayPosts, count: posts.length});
    }

    //todo: удалить условия - done
});


app.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    const post: Array<IPost> = arrayPosts.filter((item: IPost) => item.id === Number(id)); //use filter - not find
    const myObj: IPost = {
        id: post[0].id,
        title: post[0].title,
        body: post[0].body
    }
    res.send(myObj)
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
        const myObj: object = req.body;
        res.send(myObj)
    })
});

app.delete('/posts/:id',(req, res) => {
    const id: string = req.params.id;
    arrayPosts = arrayPosts.filter((post: IPost) => {
        return String(post.id) !== id;
    })
    fs.writeFile('./data/posts.json', JSON.stringify(arrayPosts), (err) => {
        if(err) res.sendStatus(404)
        const myObj: object = req.body;
        res.send(myObj);
    })
});

app.get<Array<IUser>>('/users', (req, res) => {
    res.send(arrayUsers);
});

app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    res.send(arrayUsers.find((item) => item.id === Number(id)))
    //todo: переписать на find
});

app.post('/users/:id', (req, res) => {
    arrayUsers = arrayUsers.map((item) => {
        if(item.id === req.body.id){
            //do something
            return item;
        }
        return item;
    });
    fs.writeFile('./data/users.json', JSON.stringify(arrayUsers), (err) => {
        if(err) res.sendStatus(404)
        const myObj: object = req.body;
        res.send(myObj)
    })
});

app.delete('/users/:id',(req, res) => {
    const id = req.params.id;
    arrayPosts = arrayPosts.filter((user) => {
        return String(user.id) !== id;
    })
    fs.writeFile('./data/users.json', JSON.stringify(arrayUsers), (err) => {
        if(err) res.sendStatus(404)
        const myObj: object = req.body;
        res.send(myObj)
    })
});



// todo: app.put();
app.put('/posts', (req, res) => {
    const findPost = users.find((user) => user.name === req.body.author);
    if(!findPost) res.send(404);
    const post = {
        id: Date.now(),
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    }
    arrayPosts = [...arrayPosts, post];
    fs.writeFile('./data/posts.json', JSON.stringify(arrayPosts), (err) => {
        if(err) res.sendStatus(404)
        const myObj: object = req.body;
        res.send(myObj)
    })
})

