const dotenv = require(`dotenv`);
const express = require(`express`);
dotenv.config({ path: `./.env` });
const db = require('./config/db');
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

const { createUserTable } = require('./models/user.js');

// Server
const PORT = process.env.PORT || 8000;

// Routes
app.get(`/`, (req, res) => {
    res.send(`Backend deployed`);
});
app.use('/api', require('./api/routes/Routes'))

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});



db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err.stack);
        return;
    }
    console.log('Connected to the database with connection ID: ', db.threadId);
});
createUserTable();

