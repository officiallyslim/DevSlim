const express = require("express");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const axios = require("axios");
require("dotenv").config();

const app = express();

// Session Configuration
app.use(session({
    secret: "devslim-secret",
    resave: false,
    saveUninitialized: false
}));

// Passport Setup
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_REDIRECT_URI,
    scope: ["identify", "guilds", "guilds.members.read"]
}, async (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/discord", passport.authenticate("discord"));
app.get("/auth/discord/callback", passport.authenticate("discord", {
    failureRedirect: "/"
}), (req, res) => {
    res.redirect("/dashboard");
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/discord");
}

// Middleware to check if user has staff role
async function isStaff(req, res, next) {
    const userId = req.user.id;
    const guildId = process.env.DISCORD_GUILD_ID;
    const response = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
    });

    const userRoles = response.data.roles;
    const allowedRoles = process.env.ADMIN_ROLE_IDS.split(",");
    
    if (userRoles.some(role => allowedRoles.includes(role))) {
        return next();
    } else {
        return res.status(403).send("Access Denied");
    }
}

app.get("/dashboard", isAuthenticated, isStaff, (req, res) => {
    res.send("Welcome to the Admin Panel!");
});

// Webhook Endpoint
app.post("/send-webhook", isAuthenticated, isStaff, async (req, res) => {
    const { content, embedColor } = req.body;

    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        embeds: [{
            description: content,
            color: parseInt(embedColor.replace("#", ""), 16)
        }]
    });

    res.send("Webhook sent successfully!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
