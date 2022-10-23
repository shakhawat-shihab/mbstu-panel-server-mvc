const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");


const userRoute = require("./routes/v1/user.route");
const semesterRoute = require("./routes/v1/semester.route");
const marksRoute = require("./routes/v1/marks.route");
const studentResultRoute = require("./routes/v1/studentResult.route");
const verifyToken = require("./middleware/verifyToken");
const courseRoute = require("./routes/v1/course.route");
const hallRoute = require("./routes/v1/hall.route");


//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/semester", semesterRoute);
app.use("/api/v1/marks", marksRoute);
app.use("/api/v1/student-result", studentResultRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/hall", hallRoute);



app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});

module.exports = app;




