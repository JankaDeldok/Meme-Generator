const Memes = require("../models/memes");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const videoshow = require('videoshow')
const sharp = require("sharp");

const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath("ffmpeg-5.0-full_build/bin/ffmpeg.exe");
ffmpeg.setFfprobePath("ffmpeg-5.0-full_build/bin/ffprobe.exe");

const cv = require("../createvideo");


/**
 * routes for all meme related stuff
 * Start with get calls for the frontend
 */

/**
 * Get a single random meme or a meme specified by a ?name=
 */
router.get('/meme-retrieval', async (req, res) => {
    let name1 = req.query.name; // wird benutzt für ?parameter
    // var name2 = req.params.name // wird benutzt bei :parameter
    console.log(name1)
    let meme;
    if (name1 != null) {
        meme = await Memes.findOne({name: name1});
    } else {
        let memes = await Memes.find();
        let random = Math.floor(Math.random() * memes.length);
        meme = memes[random];
    }
    // memes ist ein array aus models
    console.log(meme.name)
    res.send(meme)
});

/**
 * Get all memes with filters
 * sortBy
 * order
 * name
 * desc
 * upvotes
 * downvotes
 * creator
 * limit
 * template_id
 * noimg -> for performance reasons
 *
 * resources:
 * https://mongoosejs.com/docs/api/query.html
 * https://stackoverflow.com/questions/29809887/mongoose-query-for-starts-with
 */
router.get('/memes', async (req, res,) => {
    const sortBy = req.query.sort;
    const order = req.query.order;
    const name = req.query.name;
    const desc = req.query.desc;
    const upvotes = req.query.upvotes;
    const downvotes = req.query.downvotes;
    let template_id = req.query.template_id;
    let creator = req.query.creator;
    const page = req.query.page;
    let limit = req.query.limit;
    let noimg = req.query.noimg;
    let filter = {};
    let skip = 0;
    if (name) {
        filter.name = new RegExp("^"+ name); // starts with
    }
    if (desc) {
        filter.desc = new RegExp("^"+ desc); // starts with
    }
    if (upvotes) {
        filter.upvotes = upvotes;
    }
    if (downvotes) {
        filter.downvotes = downvotes;
    }
    if (template_id) {
        filter.template_id = template_id;
    }
    if (creator) {
        filter.creator = creator;
    }
    if (page) {
        skip = (page -1) * limit;
    }
    //console.log(req.query)
    //console.log(filter);
    try {
        let memes;
        if (sortBy && order) {
            const sort = {[sortBy]: order === 'desc' ? -1 : 1}
            if (limit) {
                memes = await Memes.find(filter).sort(sort).skip(skip).limit(limit);
            } else {
                memes = await Memes.find(filter).sort(sort);
            }
        } else {
            if (limit) {
                memes = await Memes.find(filter).skip(skip).limit(limit);
            } else {
                memes = await Memes.find(filter);
            }
        }
        if (noimg) {
            memes.forEach(meme => meme.img = "");
        }
        res.send(memes);
    } catch (err) {
        console.log('error');
        res.json({status: 'error', error: err});
    }

});

// https://betterprogramming.pub/video-stream-with-node-js-and-html5-320b3191a6b6
router.get('/memevideo', function(req, res) {
    //const path = '../videos/video0.mp4';
    const path = __dirname.split("routes")[0] + "videos\\video0.mp4"
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

/**
 * Post methods (Memes, Comments, Up and Downvotes)
 */

// from https://mongoosejs.com/docs/tutorials/findoneandupdate.html
router.post('/upvote', async (req, res) => {
    console.log(req.body)
    try {
        const filter = {_id: await req.body._id}
        let doc = await Memes.findOne(filter);
        const update = {upvotes: doc.upvotes + 1}

        // `doc` is the document _before_ `update` was applied
        doc = await Memes.findOneAndUpdate(filter, update);
        console.log("_id: " + doc._id);
        console.log("upvotes: " + doc.upvotes);
        res.json({status: 'ok'});
    } catch (err) {
        console.log('error');
        res.json({status: 'error', error: err.message});
    }
});

router.post('/downvote', async (req, res) => {
    console.log(req.body)
    try {
        const filter = {_id: await req.body._id}
        let doc = await Memes.findOne(filter);
        const update = {downvotes: doc.downvotes + 1}

        doc = await Memes.findOneAndUpdate(filter, update);
        console.log("_id: " + doc._id);
        console.log("downvotes: " + doc.downvotes);
        res.json({status: 'ok'});
    } catch (err) {
        console.log('error');
        res.json({status: 'error', error: err.message});
    }
});

router.post('/addcomment', async (req, res) => {
    console.log(req.body)
    try {
        const filter = {_id: await req.body._id}
        let doc = await Memes.findOne(filter);
        const update = {comment: await req.body.comment}

        doc.comments.push(update)
        await doc.save();
        console.log("_id: " + doc._id);
        console.log("comments: " + doc.comments.toString());
        res.json({status: 'ok'});
    } catch (err) {
        console.log('error');
        res.json({status: 'error', error: err.message});
    }
});

router.post("/postmeme", async (req, res) => {
    //console.log(req.body)
    const meme = new Memes({
        id: 1,
        creator: req.body.creator,
        name: req.body.name,
        desc: req.body.desc,
        img: req.body.img, // should be a base64 string
        memetexts: JSON.stringify(req.body.memetexts),
        template_id: req.body.template_id
    });
    await meme.save()
    res.send(meme);
});


module.exports = router;