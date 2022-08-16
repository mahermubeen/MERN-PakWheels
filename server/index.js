require("dotenv").config();
const express = require("express");
const app = express();
var session = require("express-session");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const carRoutes = require("./routes/cars");
const authRoutes = require("./routes/auth");

// database connection
connection();

//XSS proteciton
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: true },
  })
);

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
