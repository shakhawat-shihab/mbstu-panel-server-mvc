const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");


const userRoute = require("./routes/v1/user.route");
const semesterRoute = require("./routes/v1/semester.route");
const marksRoute = require("./routes/v1/marks.route");
const studentResult = require("./routes/v1/studentResult.route");
const verifyToken = require("./middleware/verifyToken");
const courseResult = require("./routes/v1/course.route");


//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/semester", semesterRoute);
app.use("/api/v1/marks", verifyToken, marksRoute);
app.use("/api/v1/student-result", studentResult);
app.use("/api/v1/course", courseResult);



app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});

module.exports = app;




