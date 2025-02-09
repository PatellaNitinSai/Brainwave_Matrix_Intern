var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Use environment variables in the MongoDB connection
const mongoURI = `mongodb://127.0.0.1:27017/moneyTrackerDB`;

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB Connection Error:", err));

// ✅ Define a Mongoose schema
const userSchema = new mongoose.Schema({
    Category: String,
    Amount: Number,
    Info: String,
    Date: String
});

const User = mongoose.model("User", userSchema);

// ✅ Fix `/add` route to use Mongoose `User.create()`
app.post("/add", async (req, res) => {
    try {
        const { category_select, amount_input, info, date_input } = req.body;

        const data = new User({
            Category: category_select,
            Amount: amount_input,
            Info: info,
            Date: date_input
        });

        await data.save(); // Save to MongoDB using Mongoose
        console.log("Record Inserted Successfully");

        res.status(201).json({ message: "Data added successfully" });
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Fix `/` route to send `index.html`
app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    res.sendFile(__dirname + "/public/index.html"); // Correct way to send an HTML file
});
const port = 5000
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
