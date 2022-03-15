const Templates = require("../models/templates");
const express = require("express");
const router = express.Router();

router.post("/posttemplate", async (req, res) => {
    console.log(req.body)
    const template = new Templates({
        id: 1,
        creator: req.body.creator,
        name: req.body.name,
        desc: req.body.desc,
        img: req.body.img // should be a base64 string
    });
    await template.save()
    res.send(template);
});

// gets all templates
router.get('/templates', async (req, res,) => {
    let templates = await Templates.find();
    res.send(templates);
});

module.exports = router;