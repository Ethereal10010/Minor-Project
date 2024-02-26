const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const port = 5000;

mongoose.connect("mongodb://localhost:27017/StudentDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const students = await Student.find();
  res.render("index", { students });
});

app.post("/save", async (req, res) => {
  const { rollNo, name, degree, city } = req.body;
  const student = new Student({ rollNo, name, degree, city });
  await student.save();
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("edit", { student });
});

app.put("/edit/:id", async (req, res) => {
  const { rollNo, name, degree, city } = req.body;
  await Student.findByIdAndUpdate(req.params.id, {
    rollNo,
    name,
    degree,
    city,
  });
  console.log("Student updated successfully");
  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.listen(port, () =>
  console.log(`Server is running on port number: ${port}`)
);
