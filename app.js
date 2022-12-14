const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
const userRoute = require("./routes/v1/user.route");
const semesterRoute = require("./routes/v1/semester.route");
const marksRoute = require("./routes/v1/marks.route");
const studentResultRoute = require("./routes/v1/studentResult.route");
const verifyToken = require("./middleware/verifyToken");
const courseRoute = require("./routes/v1/course.route");
const hallRoute = require("./routes/v1/hall.route");
const courseApplicationRoute = require("./routes/v1/courseApplication.route");
const projectApplicationRoute = require("./routes/v1/projectApplication.route");
const profileRoute = require("./routes/v1/profile.route");
const paymentRoute = require("./routes/v1/payment.route");



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
app.use("/api/v1/course-application", courseApplicationRoute);
app.use("/api/v1/project-application", projectApplicationRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/payment", paymentRoute);



app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});

module.exports = app;




