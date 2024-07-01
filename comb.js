const express = require('express');
const fs = require('fs').promises;
const bcrypt = require("bcrypt");
const collection = require("./config");
const getCollegeRecommendation = require('./openai');

const app = express();
const PORT = 8085; // Use a single port

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

// Homepage Route
app.get("/home", (req, res) => {
  res.render("home"); // Assuming your homepage file is named home.ejs
});
app.get("/", (req, res) => {
  res.redirect("/home"); // Redirects the base URL to the homepage
});

// Login and Signup Routes
app.get("/login", (req, res) => {
  console.log("Login route hit");
  res.render("login");
});

app.get("/colleges", (req, res) => {
  console.log("Colleges route hit");
  res.render("colleges");
});

app.get("/couns", (req, res) => {
  console.log("Couns route hit");
  res.render("couns");
});

app.get("/about", (req, res) => {
  console.log("About route hit");
  res.render("about");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password
  };

  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exists. Please choose a different username.");
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;
    const userdata = await collection.insertMany(data);
    console.log(userdata);
    res.render("login");
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.name });
    if (!check) {
      res.send("User name not found");
    } else {
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (isPasswordMatch) {
        res.render("person");
      } else {
        res.send("Wrong password");
      }
    }
  } catch {
    res.send("wrong details");
  }
});

// Recommendation Route
app.post('/recommendationEndpoint', async (req, res) => {
  try {
    const formData = req.body;
    const recommendation = await getCollegeRecommendation(
      formData.course,
      formData.major,
      formData.country,
      formData.budget,
      formData.expense,
      formData.weather
    );

    res.json({
      message: 'Form data received successfully',
      recommendation: recommendation
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get recommendation' });
  }
});

// Fallback for Serving person.ejs on Specific Route
app.get('/person', async (req, res) => {
  try {
    const data = await fs.readFile('person.ejs', 'utf8');
    res.send(data);
  } catch (error) {
    res.status(404).send('Error: File not found');
  }
});

app.listen(PORT, () => {
  console.log('Server is listening on port ' + PORT);
});
