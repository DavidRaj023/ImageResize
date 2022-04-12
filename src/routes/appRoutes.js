const express = require('express');
const router = new express.Router();
const controller = require('../controller/appController')
const upload = require('../utils/upload');

let routes = (app) => {
    try {
        router.get('/api/image/resize', upload.single('file'), controller.resizeImage);
        router.get('/api/image/resize-multiple', upload.single('file'), controller.resizeMultipleSizes);
        app.use(router);    
    } catch (error) {
        console.log(error);
    }
};

module.exports = routes;