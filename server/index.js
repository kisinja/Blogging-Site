import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
import commentRouter from './routes/comment.js';
import webHookRouter from './routes/webhooks.js';
import authRouter from './routes/auth.js';
import generateAndSaveEmbeddings from './embeddings.js';

import connectDB from './db.js';

const app = express();

app.use(clerkMiddleware());
app.use(cors({
    origins: [process.env.CLIENT_URL_DEVELOPMENT, process.env.CLIENT_URL_PRODUCTION],
}));
app.use('/webhooks', webHookRouter);
app.use(express.json());
app.use(morgan('common'));
/* app.use(bodyParser.json()); */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware to allow sending of public files
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

const port = process.env.PORT || 4000;

dotenv.config();

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* app.get('/', (req, res) => {
    res.send('Hello World');
}); */

/* app.get('/protect', (req, res) => {
    const { userId } = req.auth;

    if (!userId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    res.json({ message: 'content' });
}); */

/* app.get('/protect', requireAuth(), (req, res) => {
    res.json({ message: 'content' });
}); */

/* app.get('/auth-state', (req, res) => {
    const authState = req.auth;
    res.json(authState);
}); */

// Error handling middleware instead of try-catch block
app.use((error, req, res, next) => {
    res.status(error.status || 500)
        .json({
            message: error.message || "Something went wrong!", status: error.status,
            stack: error.stack
        });
});

app.listen(port, () => {
    connectDB();
    //generateAndSaveEmbeddings();
    console.log(`Server is running on ${port}`);
});