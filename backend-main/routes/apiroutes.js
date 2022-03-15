const Memes = require("../models/memes");
const express = require("express");
const router = express.Router();
const Jimp = require("jimp");
const Templates = require("../models/templates");
const fs = require("fs");


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
 */
router.get('/memesurl', async (req, res,) => {
    const sortBy = req.query.sort;
    const order = req.query.order;
    const name = req.query.name;
    const desc = req.query.desc;
    const upvotes = req.query.upvotes;
    const downvotes = req.query.downvotes;
    let template_id = req.query.template_id;
    let creator = req.query.creator;
    let limit = req.query.limit;
    let noimg = req.query.noimg;
    let filter = {};
    if (name) {
        filter.name = name;
    }
    if (desc) {
        filter.desc = desc;
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
    //console.log(req.query)
    //console.log(filter);
    try {
        let memes;
        if (sortBy && order) {
            const sort = {[sortBy]: order === 'desc' ? -1 : 1}
            if (limit) {
                memes = await Memes.find(filter).sort(sort).limit(limit);
            } else {
                memes = await Memes.find(filter).sort(sort);
            }
        } else {
            if (limit) {
                memes = await Memes.find(filter).limit(limit);
            } else {
                memes = await Memes.find(filter);
            }
        }
        if (noimg) {
            memes.forEach(meme => meme.img = "");
        }
        apimemes = [];
        memes.forEach(meme => apimemes.push({meme: meme, url: "http://localhost:3000/single_meme/" + meme.name}));
        res.send(apimemes);

    } catch (err) {
        console.log('error');
        res.json({status: 'error', error: err});
    }

});

router.post('/creatememe', async (req, res,) => {


    let inputs = req.body.inputs;
    console.log(inputs); // [ { template_id: '42', color, texts: [ [Object] ] } ]
    //console.log(inputs[0].texts); // [ { text: 'hello WORLD!', posx: '10', posy: '10' } ]

    let creatememedir = __dirname.split("routes")[0] + "creatememe\\";
    //var fileName = creatememedir + "image0.jpeg";
    //console.log(fileName)


    let memePathsToDB = [];
    let memeTexts = [];
    let templates = [];

    for (let i = 0; i < inputs.length; i++) {
        let template = await Templates.findOne({id: inputs[i].template_id});
        if (template === undefined) {
            console.log("template id not found");
        } else {
            let filePath = await toImgFile(template, creatememedir, i);
            for (let j = 0; j < inputs[i].textarray.length; j++) {
                let file = await makeMeme(filePath,
                    creatememedir,
                    inputs[i].textarray[j],
                    inputs[i].color,
                    j,
                    inputs[i].template_id);
                memePathsToDB.push(file);
                let mt = {};
                mt.text1 = {text: inputs[i].textarray[j][0].text};
                if(inputs[i].textarray.length > 1) mt.text2 = {text: inputs[i].textarray[j][1].text};
                if(inputs[i].textarray.length > 2) mt.text3 = {text: inputs[i].textarray[j][2].text};
                memeTexts.push(mt);
                templates.push(inputs[i].template_id);
            }
        }
    }

    let memenames = []
    let baseurl = "http://localhost:3000/single_meme/"

    for (let i = 0; i < memePathsToDB.length; i++) {
        const base64 = fs.readFileSync(memePathsToDB[i], {encoding: 'base64'});
        const memename = memePathsToDB[i].split(".jpeg")[0].split("/")[1]
        const meme = new Memes({
            id: 1,
            creator: "api",
            name: memename,
            desc: "api created",
            img: "data:image/jpeg;base64," + base64, // should be a base64 string
            memetexts: JSON.stringify(memeTexts[i]),
            template_id: templates[i]
        });
        memenames.push(baseurl + memename);
        await meme.save()
    }

    res.send(memenames);
});

async function makeMeme(fileName, creatememedir, texts, color, counter, templateid) {
    // input {template, font, [{text, posx, posy}]}
    let loadedImage;
    let resultFile;
    console.log(fileName);
    resultFile = Jimp.read(fileName)
        .then(function (image) {
            loadedImage = image;
            console.log("load DONE")
            if (color === "white") {
                return Jimp.loadFont(Jimp.FONT_SANS_32_WHITE); // 8 16 32 64 128
            } else {
                return Jimp.loadFont(Jimp.FONT_SANS_32_BLACK); // Default color
            }
        })
        .then(function (font) {
            for (let i = 0; i < texts.length; i++) {
                loadedImage.print(font, parseInt(texts[i].posx), parseInt(texts[i].posy), texts[i].text);
                console.log("print done")
            }

            let timestamp = Math.floor(Date.now() / 10000).toString()
            let memename = templateid + "t" + counter.toString() + timestamp + "pr";
            loadedImage.write(creatememedir + memename + ".jpeg");
            resultFile = "creatememe/" + memename + ".jpeg";
            return resultFile;
        })
        .catch(function (err) {
            console.error("ER:" + err);
        });
    return await resultFile;
}

async function toImgFile(template, creatememedir, counter) {
    let base64Image = template.img.split(';base64,').pop();
    let imgPath = 'creatememe/image' + counter + getContentEnding(template.img);
    await fs.writeFile(imgPath, base64Image, {encoding: 'base64'}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("file created")
        }
    });

    await sleep(500);
    return imgPath;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Helper function for ejs page which does not like to get the full base64 for some reason
 * @param str base64 string with prefixes (data:....)
 * @returns {string}
 */
function base64StringOnly(str) {
    var index = str.indexOf(";base64,"); // - 8
    //console.log(str);
    var substringed = str.substring(index + 8);
    //console.log(substringed);
    return substringed;
}

/**
 * Helper for ejs page
 * TODO add other datatypes if they should be allowed
 * @param str base64 string
 * @returns {string} content type
 */
function getContentType(str) {
    var contentType = str.substring(0, 100);
    //console.log(contentType);
    if (contentType.includes("data:image/jpeg")) {
        contentType = "image/jpeg";
    }
    if (contentType.includes("data:image/jpg")) {
        contentType = "image/jpg";
    }
    if (contentType.includes("data:image/png")) {
        contentType = "image/png";
    }
    //console.log(contentType);
    return contentType;
}

/**
 * Helper for ejs page
 * TODO add other datatypes if they should be allowed
 * @param str base64 string
 * @returns {string} content type
 */
function getContentEnding(str) {
    var contentType = str.substring(0, 100);
    //console.log(contentType);
    if (contentType.includes("data:image/jpeg")) {
        contentType = ".jpeg";
    }
    if (contentType.includes("data:image/jpg")) {
        contentType = ".jpg";
    }
    if (contentType.includes("data:image/png")) {
        contentType = ".png";
    }
    //console.log(contentType);
    return contentType;
}

module.exports = router;