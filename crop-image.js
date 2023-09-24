const axios = require('axios');
const { response } = require('express');
const sharp = require('sharp');

const POST_MIN_RATIO = 4/5;
const POST_MAX_RATIO = 1.91;
const IMAGE_MAX_WIDTH = 1080;

async function cropImage(url) {
    let data;
    try {
        const response = await axios({ url, responseType: 'arraybuffer' });
        data = response.data;
    }
    catch(e) {
        return console.error('Error when reading file from URL', e.message);
    }

    let sharpChain;
    try {
        sharpChain = sharp(data);
    }
    catch(e) {
        return console.error('Error when reading buffer data with Sharp', e.message);
    }

    let left = top = 0;
    let width, height;
    try {
        const metadata = await sharpChain.metadata();
        width = metadata.width;
        height = metadata.height;
        console.log(`W: ${width}, H: ${height}`);
    }
    catch(e) {
        return console.error('Error when reading image metadata', e.message);
    }
    
    const ratio = width / height;
    let newWidth = width;
    let newHeight = height;

    // resize image to max IMAGE_MAX_WIDTH
    if (width > IMAGE_MAX_WIDTH) {
        height = newHeight = Math.floor(height * IMAGE_MAX_WIDTH / width);
        width = newWidth = IMAGE_MAX_WIDTH;

        sharpChain = sharpChain.resize(IMAGE_MAX_WIDTH, height);
    }

    // crop image params
    if (ratio < POST_MIN_RATIO) {
        newHeight = Math.floor(width / 0.8);
        top = Math.floor((height - newHeight) / 2);
    }
    else if (ratio > POST_MAX_RATIO) {
        newWidth = Math.floor(height * 1.91);
        left = Math.floor((width - newWidth) / 2);
    }

    return sharpChain
        .extract({ left, top, width: newWidth, height: newHeight })
        .toBuffer();
}

exports.cropImage = cropImage;
