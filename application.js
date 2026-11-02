const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const profileSchema = new mongoose.Schema({
    name: String,
    email: String,
    qualification: String,
    skills: [String]
});

const applicationSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    jobId: String,
    status: {
        type: String,
        default: "submitted"
    }
});


const Profile = mongoose.model("Profile", profileSchema);
const Application = mongoose.model("Application", applicationSchema);

app.post("/api/profile", async (req, res) => {
    try {
        const { jobId } = req.query;
        const { name, email, qualification, skills } = req.body;

        if (!jobId || !name || !email || !qualification || !Array.isArray(skills)) {
            return res.status(400).json({
                success: false,
                message: "Please provide all details and jobId"
            });
        }

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
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

app.delete("/api/profile/:id", async (req, res) => {
    try {
        const profile = await Profile.findByIdAndDelete(req.params.id);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        await Application.deleteMany({ profileId: profile._id });

        res.json({
            success: true,
            message: "Profile deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

app.patch("/api/application/:id/withdraw", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (application.status === "withdrawn") {
            return res.status(400).json({
                success: false,
                message: "Application already withdrawn"
            });
        }

        application.status = "withdrawn";
        await application.save();

        res.json({
            success: true,
            message: "Application withdrawn successfully",
            application
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});