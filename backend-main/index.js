const express = require("express");
const mongoose = require("mongoose");
const uroutes = require("./routes/userroutes");
const mroutes = require("./routes/memeroutes");
const droutes = require("./routes/draftroutes");
const troutes = require("./routes/templateroutes");
const apiroutes = require("./routes/apiroutes");
const cors = require("cors");

// Connect to mongoDB
mongoose
    .connect("mongodb+srv://ommuser:ommuser@testclusteromm.l2yye.mongodb.net/test")
    .then(() => {
        const app = express();
        app.set("view engine", "ejs");
        app.use(cors());

        app.use(express.json({limit: '100mb'})); // so we can read the request body
        app.use(express.urlencoded({limit: '100mb'}));

        // TODO change /api to something else for non apu routes
        app.use("/api", uroutes);   // user
        app.use("/api", mroutes);   // memes
        app.use("/api", droutes);   // drafts
        app.use("/api", troutes);   // templates
        app.use("/api", apiroutes); // api

        app.listen(5000, () => {
            console.log("Server has started on port 5000!");
        });
    });