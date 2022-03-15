const Drafts = require("../models/drafts");
const express = require("express");
const router = express.Router();

// gets all drafts from a specified ?creator
router.get('/draftcreator', async (req, res,) => {
    let creator = req.query.creator;
    if(creator === undefined) {
        res.send("ERROR! pls define a creator");
    } else {
        let drafts = await Drafts.find({creator: creator});
        if (drafts != undefined) {
            res.send(drafts);
        } else {
            res.send("ERROR! no drafts from creator: " + creator);
        }
    }
});


router.post("/postdraft", async (req, res) => {
    //console.log(req.body)
    const draft = new Drafts({
        id: 1,
        creator: req.body.creator,
        name: req.body.name,
        desc: req.body.desc,
        img: req.body.img, // should be a base64 string
        memetexts: JSON.stringify(req.body.memetexts),
        template_id: req.body.template_id
    });
    await draft.save()
    res.send(draft);
});

module.exports = router;