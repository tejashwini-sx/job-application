const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");

const authRoutes = require("./routes/routes");
app.use("/", authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.error(error)
        return res.status(200).send("page redirected")
    });

    
        const profile = await Profile.create({
            name,
            email,
            qualification,
            skills
        });

        const application = await Application.create({
            profileId: profile._id,
            jobId,
            status: "submitted"
        });

        res.status(201).json({
            success: true,
            message: "Profile created and application submitted",
            profile,
            application
        });