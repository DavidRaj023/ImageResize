const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const randomstring = require("randomstring");

exports.deleteFile = (path) => {
    try {
        fs.unlinkSync(path);
        console.log('File Deleted: ' + path);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}
exports.removeDir = (path) => {
    fs.rm(path, {
        recursive: true
    }, (err) => {
        if (err) {
            throw err;
        }
        console.log(`${path} is deleted!`);
    });
};

exports.removeFilesinDir = (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
      });
}

exports.findFromSet = (value, recordset) => {
    try {
        var data = [];
        for (var i = 0; i < recordset.length; i++) {
            data.push(recordset[i].name);
        }
        return data.some(item => item.toLowerCase() == value.toLowerCase());
    } catch (error) {

    }
};

exports.randomString = (length) => {
    return randomstring.generate(length);
};

exports.archiveFiles = async (dirNames, zipName) => {
    try {
        let archive = archiver.create('zip', {});
        archive.on('error', (err) => {
            throw err;
        });
        const zipFile = path.join(__dirname, `../../resources/images/zipfiles/${zipName}.zip`);
        
        const output = fs.createWriteStream(zipFile);
        output.on('close', () => {
            // console.log(archive.pointer() + 'Bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        archive.pipe(output);
        archive.directory(dirNames, zipName);
        await archive.finalize();
        return zipFile;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}