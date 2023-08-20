const cloudinary = require("cloudinary");
const getDataUri = require("./dataUri");
const { ServerConfig }  = require("../../config")

cloudinary.v2.config({
    cloud_name: ServerConfig.CLOUDINARY_CLIENT_NAME,
    api_key: ServerConfig.CLOUDINARY_CLIENT_API,
    api_secret: ServerConfig.CLOUDINARY_CLIENT_SECRET,
});

async function upload (file) {
    const fileUri = getDataUri(file);
    const cloud = await cloudinary.v2.uploader.upload(fileUri.content);
    return cloud;
}

async function destroy (id) {
    await cloudinary.v2.uploader.destroy(id);
}

module.exports = {
    upload,
    destroy,
}