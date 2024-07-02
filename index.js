// middlewares are functions which perform operations that are r
// required to be executed in the middle of the req-res such as authentication , authorisation
const express = require("express");``
const mongoose = require("mongoose");
const app = express();
//creating the Server
app.listen(8000, () => console.log("Server Started"));
//syntax to write a middleware
app.use((req, res, next) => {
  next(); // used to call the next middleware or route
});
//lets work with a database
/** Define a Schema - Model
 * Using the model we will do the CRUD operations
 */
// connect the database
mongoose
  .connect("mongodb://127.0.0.1:27017/demoDB")
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log("Error in connecting", err));
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
const User = mongoose.model("user", userSchema);
// inbuilt middleware to parse form data
app.use(express.urlencoded({ extended: false }));
// get request to read the the data from the data base
app.get("/users", async (req, res) => {
  const data = await User.find({});
  const html = `<ul>
${data.map((user) => `<li>${user.first_name}-${user.email}</li>`).join("")}  
  </ul>`;
  return res.send(html);
});

// inserting values in database
// middleware to validate entries
app.use((req, res, next) => {
  const data = req.body;
  if (!data.first_name || !data.last_name || !data.email) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  next();
});
// create a post request to insert the form data

app.post("/users", async (req, res) => {
  const data = req.body;
  const result = await User.create({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
  });
  console.log("inserted into dp", result);
  return res.status(201).json({ msg: "sucess" });
});
