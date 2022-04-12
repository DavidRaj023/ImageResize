const sharp = require("sharp");
const path = require('path');
const {
    randomString
} = require('../utils/util');

exports.resize = async (file, filePath, width, height) => {
    try {
        await sharp(file.path)
            .resize(parseInt(width), parseInt(height), {
                fit: 'fill',
                withoutEnlargement: true
            })
            .toFile(filePath);
        return filePath;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};
