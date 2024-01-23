const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
require('dotenv').config()

const apiKey = process.env.CLARIFAI_KEY

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${apiKey}`);
const stub = ClarifaiStub.grpc();

const detectFace = (imageUrl) => {
    return new Promise((resolve, reject) => {
        stub.PostModelOutputs(
            {
                model_id: "face-detection",
                inputs: [{data: {image: {url: imageUrl }}}]
            },
            metadata,
            (error, response) => {
                if (error) {
                    reject("Error: " + error);
                    return;
                }

                if (response.status.code !== 10000) {
                    reject("Received failed status: " + response.status.description + "\n" + response.status.details);
                    return;
                }

                let results = response.outputs[0].data.regions;
                resolve(results);
            }
        );
    })
}


const handleDetect = async (req, res) => {
        const imageUrl = req.body.input;
        await detectFace(imageUrl)
        .then(data => {
            const boundingBoxCoordinates = data[0].region_info.bounding_box; // TODO: Support multiple faces in image, currently only grabs first image on both backend and frontend
            res.json(boundingBoxCoordinates)}
            )
        .catch(err => res.status(400).json(err))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id).increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('Unable to increment entries'))
}

module.exports = {
    handleImage: handleImage,
    handleDetect: handleDetect
}