const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");


const userRoute = require("./routes/v1/user.route");
const semesterRoute = require("./routes/v1/semester.route");
const marksRoute = require("./routes/v1/marks.route");
// const hiringManagerRoute = require("./routes/v1/hiringManager.route");
// const verifyToken = require("./middleware/verifyToken");
// const candidateRoute = require("./routes/v1/candidate.route");
// const adminRoute = require("./routes/v1/admin.route");

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/semester", semesterRoute);
app.use("/api/v1/marks", marksRoute);
// app.use("/api/v1/candidate", candidateRoute);
// app.use("/api/v1/admin", verifyToken, adminRoute);


app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});

module.exports = app;




