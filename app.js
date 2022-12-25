require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || 5000;

//connect to mongoDB
const db = require("./utils/database");

app.use(cors({ credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
});

//routes import
const userRouter = require("./routes/user.routes");

//routes
app.use('/api/user', userRouter);

app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});
