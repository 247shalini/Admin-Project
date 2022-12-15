const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require("./api/routes/index");
const session = require("express-session");
const bodyParser = require("body-parser");
const seeders = require("./seeders/index");
const cors = require('cors')
dotenv.config();

// express code 
const app = express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));

// connect router
app.use('/', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// mongodb connection code
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected successfully...");
    seeders.superAdmin();
  })
  .catch((e) => {
    console.log("Database connection error", e);
  });

//  create a server code 
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
