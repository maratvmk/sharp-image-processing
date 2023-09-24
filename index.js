const axios = require('axios');
const sharp = require('sharp');

const POST_MIN_RATIO = 4/5;
const POST_MAX_RATIO = 1.91;
const IMAGE_MAX_WIDTH = 1080;

async function cropImage(url, outputPath) {
    const { data } = await axios({ url, responseType: 'arraybuffer' });
    let sharpChain = sharp(data);
    
    let left = top = 0;
    let { width, height } = await sharpChain.metadata();
    console.log(`W: ${width}, H: ${height}`);
    
    const ratio = width / height;
    let newWidth = width;
    let newHeight = height;

    if (width > IMAGE_MAX_WIDTH) {
        height = newHeight = Math.floor(height * IMAGE_MAX_WIDTH / width);
        width = newWidth = IMAGE_MAX_WIDTH;

        sharpChain = sharpChain.resize(IMAGE_MAX_WIDTH, height);
    }

    if (ratio < POST_MIN_RATIO) {
        newHeight = Math.floor(width / 0.8);
        top = Math.floor((height - newHeight) / 2);
    }
    else if (ratio > POST_MAX_RATIO) {
        newWidth = Math.floor(height * 1.91);
        left = Math.floor((width - newWidth) / 2);
    }

    sharpChain
        .extract({ left, top, width: newWidth, height: newHeight })
        .toFile(outputPath, (err, info) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Image cropped successfully!');
            }
        });
}

const url = 'https://cdn.discordapp.com/attachments/995431274267279440/1151940467068514314/rrrdi_A_visualization_of_a_clogged_artery_or_a_heart_with_chole_1a9b3a7e-5253-4dea-9a54-41870a0774c1.png';
const outputPath = 'output.jpg';

cropImage(url, outputPath);
