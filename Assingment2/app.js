const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const postsFile = path.join(__dirname, 'posts.json');

function readPosts() {
    if (!fs.existsSync(postsFile)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(postsFile, 'utf-8'));
}

function writePosts(posts) {
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
}

app.get('/posts', (req, res) => {
    const posts = readPosts();
    res.render('index', { posts });
});

app.get('/post', (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id === parseInt(req.query.id));
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render('post', { post });
});

app.get('/add-post', (req, res) => {
    res.render('add-post');
});

app.post('/add-post', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send('Title and Content are required');
    }

    const posts = readPosts();
    const newPost = {
        id: posts.length ? posts[posts.length - 1].id + 1 : 1,
        title,
        content
    };

    posts.push(newPost);
    writePosts(posts);
    res.redirect('/posts');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
