const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const {
            name, username, gender, email, password,
            mobile, street, landmark, area, pincode
        } = req.body;

        if (
            !name || !username || !gender || !email ||
            !password || !mobile || !street ||
            !landmark || !area || !pincode
        ) {
            return res.send("Please enter all the details");
        }

        if (password.length < 8) {
            return res.send("Password must have at least 8 characters");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            username,
            gender,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            mobile,
            address: { street, landmark, area, pincode }
        });

        res.redirect("/login?successful");

    } catch (error) {
        if (error.code === 11000) {
            return res.send("Email or username already exists");
        }

        console.log(error);
        res.status(500).send("Something went wrong");
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: (email || "").trim().toLowerCase()
        });

        if (
            !user ||
            !(await bcrypt.compare(password || "", user.password))
        ) {
            return res.redirect("/login?error=1");
        }

        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).send("Something went wrong");
            }

            req.session.userId = user._id.toString();

            res.redirect("/home");
        });

    } catch(error) {
        console.error(error)
        return res.status(200).send("Page Redirected")
    }
};
