const image = require('../utils/image');
const path = require('path')
const zip = require('express-zip');
const {
  deleteFile,
  randomString,
  archiveFiles,
  removeDir,
  removeFilesinDir
} = require('../utils/util');
const fs = require('fs');

exports.resizeImage = async (req, res) => {
  try {
    //Check the file availability
    if (!req.file) throw new Error("Please upload the file");
    if (!req.body.height) throw new Error("Please enter the height");
    if (!req.body.width) throw new Error("Please enter the width");
    
    const width = req.body.width;
    const height = req.body.height;
    const fileOutputPath = path.join(__dirname, `../../resources/images/downloads/${req.file.originalname.split(".")[0]}_${width}X${height}.${req.file.originalname.split(".")[1]}`);

    //Resize the given file
    const file = await image.resize(req.file, fileOutputPath, req.body.width, req.body.height);

    //Send a response with resized image
    res.download(file, function (err, data) {
      if (err) throw err;
      //Remove the user given file
      deleteFile(req.file.path);
      //Remove resized images
      deleteFile(file);
    });

  } catch (error) {
    console.log(error);
    res.send({
      message: error.message
    });
  }
};

exports.resizeMultipleSizes = async (req, res) => {
  try {
    //Check the file availability
    if (!req.file) throw new Error("Please upload the file");
    
    //Create temporary folder with random string
    const folderName = path.join(__dirname, `../../resources/images/downloads/${randomString(6)}`);
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
    }

    //Remove Files from the temporary zip folder
    removeFilesinDir(path.join(__dirname, `../../resources/images/zipfiles/`));

    const file = req.file;
    await image.resize(file, path.join(folderName, `1_${file.originalname}`), '200', '600');
    await image.resize(file, path.join(folderName, `2_${file.originalname}`), '1050', '750');
    await image.resize(file, path.join(folderName, `3_${file.originalname}`), '1500', '1200');

    //Archive the resized images
    const zipFile = await archiveFiles(folderName, req.file.originalname.split(".")[0]);
    
    res.send({
      filePath: zipFile
    });

    //Remove temporary folders
    removeDir(folderName);
    //Remove the user given file
    deleteFile(req.file.path);

    console.log("ZipFile Path: " + zipFile);

  } catch (error) {
    console.log(error)
    res.send({
      message: error.message
    })
  }
}