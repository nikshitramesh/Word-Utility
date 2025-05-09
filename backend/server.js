const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.REACT_APP_FRONTEND_URL,
    methods: ["GET", "POST", "DELETE"]
}));
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.log(err);
});
const userschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const cmtschema = new mongoose.Schema({
    name: String,
    comment: String
});
const user = mongoose.model("users", userschema);
app.post("/auth", async (req, res) => {
    const User = new user({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    const que = await user.findOne({ email: req.body.email })
    if (que) {
        res.send(`User already exists with email ${que.email}`);
    }
    else{
        await User.save()
        .then(() => {
            res.send("You have logged in successfully");
        }).catch((err) => {
            console.log(err)
            res.send("An error occurred while logging in. Please try again later.");
        });
    }
});
app.delete("/auth", async (req, res) => {
    let name = req.body.name
    let ufind=await user.findOne({ name: name})
    if(ufind && email){
        let delcmd = await user.deleteOne({ name: name })
        res.json(delcmd)
    }
    else{
        res.json({
            error:"An error occured while logging you out"
        });
    }
})
const review = mongoose.model("feedback", cmtschema);
app.post("/reviews", async (req, res) => {
    const comment = new review({
        name: req.body.name,
        comment: req.body.comment,
    });
    await comment.save()
    .then(() => {
        console.log("Comment saved successfully");
        res.send("Comment uploaded successfully");
    }).catch((err) => {
        console.log(err);
        res.send("An error occurred while uploading your comment. Please try again later.");
    });
});
app.get("/reviews", async (req, res) => {
    const list = await review.find({});
    res.json(list)
});
app.listen(process.env.PORT,() => {
    console.log(`Server is running on ${process.env.REACT_APP_FRONTEND_URL}`);  
});
