const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const PORT = process.env.PORT || 8080;

// connect to DB
mongoose
  .connect(process.env.DB_CONNENT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.get("/", (req, res) => {
  res.send();
});

app.all("*", (req, res) => {
  res.status(404).send({ success: false, message: "找不到" });
});

app.listen(PORT, () => {
  console.log("Server running on port 8080.");
});
