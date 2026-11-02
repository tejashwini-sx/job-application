const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/auth");
const User = require("../models/User");

router.get("/signup", (req, res) => {
    res.sendFile("signup.html", { root: "./public" });
});

router.post("/signup", signup);

router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "./public" });
});

router.post("/login", login);

router.get("/home", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    try {
        const user = await User.findById(req.session.userId)
            .select("-password");

        if (!user) {
            return req.session.destroy(() => {
                res.redirect("/login");
            });
        }

        res.sendFile("home.html", { root: "./public" });

    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

router.get("/user", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Please login" });
    }

    try {
        const user = await User.findById(req.session.userId)
            .select("-password");

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports = router;