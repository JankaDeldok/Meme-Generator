const videoshow = require('videoshow')
const sharp = require("sharp");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const Memes = require("./models/memes");
const mongoose = require("mongoose");
ffmpeg.setFfmpegPath("ffmpeg-5.0-essentials_build/bin/ffmpeg.exe");
ffmpeg.setFfprobePath("ffmpeg-5.0-essentials_build/bin/ffprobe.exe");

const videodir = __dirname + "\\videos\\";

const cron = require("node-cron");

//createVideo(); // at start of server

// schedules video to be build every hour
cron.schedule("0 * * * *", () => {
    //createVideo().then(r => console.log("video created"));
});


async function createVideo() {
    let images = await createImgFiles();
    console.log(images);

    images = await resizeImgs(images);
    console.log(images);

    let videoOptions = {
        fps: 25,
        loop: 5, // seconds
        transition: true,
        transitionDuration: 1, // seconds
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '720x1280',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p'
    }

    videoshow(images, videoOptions)
        .save(videodir + "video0.mp4")
        .on('start', function (command) {
            console.log('ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
            console.error('Error:' + videodir, err)
            console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
            console.error('Video created in:', output)
        })
}

function getContentType(str) {
    let contentType = str.substring(0, 100);

    if (contentType.includes("data:image/jpeg")) {
        contentType = ".jpeg";
    }
    if (contentType.includes("data:image/jpg")) {
        contentType = ".jpg";
    }
    if (contentType.includes("data:image/png")) {
        contentType = ".png";
    }
    return contentType;
}

async function createImgFiles() {
    let counter = 0;
    let memes = await Memes.find();
    let images = [];

    for (let i = 0; i < memes.length; i++) {
        let base64Image = memes[i].img.split(';base64,').pop();
        let imgPath = 'videos/image' + counter + getContentType(memes[i].img);
        await fs.writeFile(imgPath, base64Image, {encoding: 'base64'}, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("file created")
            }
        });
        images.push(videodir + "image" + counter + getContentType(memes[i].img));
        counter++;
    }

    await sleep(20000);
    return images;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function resizeImgs(images) {
    let smallImgs = [];
    images.forEach(image => {
        let smallImgPath = videodir + "smaller" + image.split("\\videos\\")[1];
        smallImgs.push(smallImgPath)
        sharp(image.toString())
            .resize({height: 720, width: 1280})
            .toFile(smallImgPath)
            .then(function (newFileInfo) {
                console.log("Success");
            })
            .catch(function (err) {
                console.log("Error occured: " + err + "path:" + image);
            });
    });
    await sleep(20000);
    return smallImgs;
}

module.exports = createVideo;