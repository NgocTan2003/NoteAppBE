require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/utils/connectDB');
const authRoutes = require('./src/routers/Auth router/auth.router');
const noteRouter = require('./src/routers/Note router/note.router')

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", }))

connectDB.connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use('/api/auth', authRoutes);
app.use('/api/note', noteRouter);

app.listen(8000);
module.exports = app;
