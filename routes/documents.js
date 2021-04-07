const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');

const Document = require('../models/document');
const Profile = require('../models/profile');

// insert a new document 
router.post('/documents', async (req, res) => {
  console.log(req.body);
  console.log(req.body.tags);
  console.log("post documents");

  const document = new Document({
    userId: req.body.userId,
    heading: req.body.heading,
    description: req.body.description,
    extension: req.body.extension,
    sharedWith: req.body.sharedWith,
    tags: req.body.tags,
    locationUrl: req.body.locationUrl
  });

  console.log(document);
  try {
    const savedDocument = await document.save();
    console.log(JSON.stringify(savedDocument));
    res.status(201).json(savedDocument);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// insert a new document 
var uploadFileAndInsertNewDocumentToDB = async (req, res) => {
  // console.log(req);
  console.log(req.body);
  console.log(req.file.path);
  console.log(req.file.mimetype);

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION
  });
  const s3 = new aws.S3();
  var params = {
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME,
    Body: fs.createReadStream(req.file.path),
    Key: `documents/${req.file.originalname}`
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log('Error occured while trying to upload to S3 bucket', err);
      res.status(500).json("probleme mari tati");
    } else {
      fs.unlinkSync(req.file.path); // Empty temp folder
      const locationUrl = data.Location;
      console.log("tomitza nebunu bossule");
      console.log(JSON.stringify(data));
      console.log("locationUrl");
      console.log(locationUrl);
      res.status(200).json({
        locationUrl: locationUrl,
        extension: req.file.mimetype
      });
    }
  });
};

router.route('/upload/file').post(multer({
   dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } 
  }).single('file'),
  uploadFileAndInsertNewDocumentToDB
  );

router.post('/documents/getDocumentsByIds', async (req, res) => {
  console.log(req.body);
  console.log(req.body.requestedDocumentsIds);
  console.log(req.body.rejectedDocumentsIds);
  console.log(req.body.pendingDocumentsIds);
  const requestedDocumentsIds = req.body.requestedDocumentsIds || [];
  const rejectedDocumentsIds = req.body.rejectedDocumentsIds || [];
  const pendingDocumentsIds = req.body.pendingDocumentsIds || [];
  try {
    const requestedDocuments = requestedDocumentsIds !== [] && await Document.find({_id: {$in: requestedDocumentsIds}});
    try {
      const rejectedDocuments = rejectedDocumentsIds !== [] &&  await Document.find({_id: {$in: rejectedDocumentsIds}});
      try {
        const pendingDocuments = pendingDocumentsIds !== [] &&  await Document.find({_id: {$in: pendingDocumentsIds}});
        console.log(pendingDocumentsIds);
        res.status(201).json({
          requestedDocuments: requestedDocuments,
          rejectedDocuments: rejectedDocuments,
          pendingDocuments: pendingDocuments
        });
      } catch (err) {
        res.status(400).json({ message: err });
      }
    } catch (err) {
      res.status(400).json({ message: err });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// puts a document at a specified id
router.put('/document/:id', async (req, res) => {
  console.log('trying to update a document');
  console.log(req);
  try {
    const document = await Document.findOne({_id: req.params.id});  // era userId inainte da n-are sens
    const documentExistingSharedWith = document.sharedWith;
    try {
      const updatedDocument = await Document.updateOne(
        { _id: req.params.id }, 
        { $set: {
          userId: req.body.userId,
          heading: req.body.heading,
          description: req.body.description,
          extension: req.body.extension,
          sharedWith: req.body.sharedWith,
          pendingDocumentsIds: req.body.pendingDocumentsIds,
          rejectedDocumentsIds: req.body.rejectedDocumentsIds,
          requestedDocumentsIds: req.body.requestedDocumentsIds,
          tags: req.body.tags,
          locationUrl: req.body.locationUrl
        }
      });
      const sharedWith = req.body.sharedWith;
      let difference = sharedWith.filter(x => !documentExistingSharedWith.includes(x));
      console.log(difference);
      if (difference !== []) {
        try {
          const profiles = await Profile.find({publicCode: {$in: difference}});
          const profileIds = profiles.map(e => e.userId);
          console.log("these are the profiles that i need to update");
          console.log(profiles);
          console.log(profileIds);
          console.log("here we can try to map them acordingly");
          try {
            console.log('here i will updated profiles acordingly');
            const updatedProfiles = await Profile.updateMany(
              { userId: {$in: profileIds} }, 
              { $addToSet: {
                pendingDocumentsIds: req.params.id
              }
            });
            console.log(JSON.stringify(updatedProfiles));
          } catch (err) {
            console.log('some issues');
          }
        } catch (err) {
          res.status(400).json({message: err});
        }
      }

      res.json(updatedDocument);
    } catch(err) {
      res.status(400).json({message: err});
    }
  } catch(err) {
    res.status(404).json({message: err});
  }
});

// get all documents 
router.get('/documentsAll', async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

const subArray = (tags, documentTags) => {
  for (let i = 0; i < tags.length; i++) {
    for (let j = 0; j < documentTags.length; j++) {
      if (tags[i] === documentTags[j]) {
        return true;
      }
    }
  }
  return false;
}

// get all documents for current user
router.get('/documents/:id', async (req, res) => {
  console.log("bosule");
  console.log(req.body);
  console.log(req.query);
  const {
    searchedDocument
  } = req.query;

  console.log(searchedDocument);
  const tags = searchedDocument.split(" ");
  console.log(tags);

  try {
    const documents = await Document.find({userId: req.params.id});
    console.log(documents);

    const responseDocuments = (searchedDocument !== '') ? documents.filter(document => subArray(tags, [...document.tags, 
      document.heading, document.description, document.extension])) : documents;

    console.log(JSON.stringify(responseDocuments));
      
    try {
      let documentIds1 = await Profile.find({userId: req.params.id});
      let documentIds2 = documentIds1;
      [documentIds1] = documentIds1.map(e => e.sharedDocumentsIds);
      [documentIds2] = documentIds2.map(e => e.requestedDocumentsIds);

      console.log(JSON.stringify(documentIds1));
      console.log(JSON.stringify(documentIds2));

      res.status(200).json({
        responseDocuments: responseDocuments,
        sharedWithNotEmpty: (documentIds1.length !== 0),
        requestedDocsNotEmpty: (documentIds2.length !== 0),
      });
    } catch (err) {
      res.status(200).json({message: err});
    }
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// get all external documents (shared documents) for current user
router.get('/shareddocuments/:id', async (req, res) => {
  console.log("bosule sunt pe shared");
  console.log(req.body);
  console.log(req.query);
  const {
    searchedDocument
  } = req.query;

  console.log(searchedDocument);
  const tags = searchedDocument.split(" ");
  console.log(tags);

  try {
    let documentIds = await Profile.find({userId: req.params.id});
    console.log(JSON.stringify(documentIds));
    [documentIds] = documentIds.map(e => e.sharedDocumentsIds);
    console.log(JSON.stringify(documentIds));
    // try here
    let documents = await Document.find({_id: {$in: documentIds}});
    console.log(documents);

    const responseDocuments = (searchedDocument !== '') ? documents.filter(document => subArray(tags, [...document.tags, 
      document.heading, document.description, document.extension])) : documents;

    res.status(200).json({
      responseDocuments: responseDocuments,
      sharedWithNotEmpty: true,
      requestedDocsNotEmpty: true
    });
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// get all external documents (shared documents) for current user
router.get('/requesteddocuments/:id', async (req, res) => {
  console.log("bosule sunt pe requested");
  console.log(req.body);
  console.log(req.query);
  const {
    searchedDocument
  } = req.query;

  console.log(searchedDocument);
  const tags = searchedDocument.split(" ");
  console.log(tags);

  try {
    let documentIds = await Profile.find({userId: req.params.id});
    console.log(JSON.stringify(documentIds));
    [documentIds] = documentIds.map(e => e.requestedDocumentsIds);
    console.log(JSON.stringify(documentIds));
    try {
      let documents = await Document.find({_id: {$in: documentIds}});
      console.log(documents);
  
      const responseDocuments = (searchedDocument !== '') ? documents.filter(document => subArray(tags, [...document.tags, 
        document.heading, document.description, document.extension])) : documents;
  
      res.status(200).json({
        responseDocuments: responseDocuments,
        sharedWithNotEmpty: true,
        requestedDocsNotEmpty: true
      });
    } catch(err) {
      res.status(200).json({message: err});
    }
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// find document by id
router.get('/document/:id', async (req, res) => {
  console.log("here baby");
  const document = await Document.findOne({_id: req.params.id});
  if (document) {
    res.status(200).json(document);
  } else {
    res.status(404).json({message: "Not Found"});
  }
});

// Delete a document
router.post('/documentDelete/:id', async (req, res) => {
  console.log(JSON.stringify(req.body)); // here we should have the public codes for people for casacde delete
  const sharedWith = req.body.sharedWith;
  const fileId = req.params.id;
  try {
    // first we need to pull the fileId from everyone's shared sharedDocumentsIds array
    console.log("here bebitza");
    const updatedProfiles = await Profile.updateMany(
      { publicCode: {$in: sharedWith} }, 
      { $pull: {
        sharedDocumentsIds: fileId
      },
        $pull: {
        pendingDocumentsIds: fileId
      }
    });

    try {
      const removedDocument = await Document.deleteOne({_id: fileId});
      res.status(200).json(removedDocument);
    } catch (err) {
      res.status(404).json({message: err});
    }
  } catch(err) {
    res.status(404).json({message: err});
  }
});

// Delete all documents
router.delete('/reset', async (req, res) => {
  try {
    const removedDocuments = await Document.deleteMany();
    res.status(200).json(removedDocuments);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// Update a document
router.patch('/document/:id', async (req, res) => {
  try {
    const updatedDocument = await Document.updateOne(
      {_id: req.params.id }, 
      { $set: {
        userId: req.body.userId,
        heading: req.body.heading,
        description: req.body.description,
        extension: req.body.extension,
        tags: req.body.tags,
        locationUrl: req.body.locationUrl
      }
    });
    res.json(updatedDocument);
  } catch(err) {
    res.json({message: err});
  }
});

module.exports = router;