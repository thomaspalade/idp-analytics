const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');

function getPublicCode(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// insert a new profile 
router.post('/profiles', async (req, res) => {

    console.log(req.body);

    const profile = new Profile({
        userId: req.body.userId,
        publicCode: getPublicCode(8),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        city: req.body.city,
        country: req.body.country,
        address: req.body.address,
        postalCode: req.body.postalCode,
        description: req.body.description,

    });
    try {
        const savedProfile = await profile.save();
        res.status(201).json(savedProfile);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// updated rejectedDocumentsIds, pendingDocumentsIds and or requestedDocumentsIds for a profile 
// puts a profile at a specified id
router.post('/profiles/updateRejectedDocumentsForUserProfile/:id', async (req, res) => {
    console.log(req.body);
    console.log(req.body.requested);
    console.log(req.body.rejectedDocumentsIds);
    console.log(req.body.pendingDocumentsIds);
    const requested = req.body.requested || [];
    const rejectedDocumentsIds = req.body.rejectedDocumentsIds || [];
    const pendingDocumentsIds = req.body.pendingDocumentsIds || [];
    const approvedPendingDocumentsIds = req.body.approvedPendingDocumentsIds || [];

    const setObject = { "$set": { }, "$push": { } };
    console.log("tomitza");
    console.log(JSON.stringify(setObject));
    if (req.body.requested) {
        setObject["$set"]["requested"] = requested;
    }
    if (req.body.rejectedDocumentsIds) {
        setObject["$set"]["rejectedDocumentsIds"] = rejectedDocumentsIds;
    }
    if (req.body.pendingDocumentsIds) {
        setObject["$set"]["pendingDocumentsIds"] = pendingDocumentsIds;
        if (req.body.accept && req.body.approvedPendingDocumentsIds) {
            setObject["$push"]["sharedDocumentsIds"] = {"$each": approvedPendingDocumentsIds};
        }
    }
    console.log(JSON.stringify(setObject));

    try {
        const profile = await Profile.find({userId: req.params.id});
        try {
            const updatedProfile = await Profile.updateOne(
                {userId: req.params.id}, // ai grija sa nu fie array = [] sa strici chestii
                setObject    
            );
            res.json(updatedProfile);
        } catch(err) {
            res.status(400).json({message: err});
        }
    } catch(err) {
        res.status(404).json({message: err});
    }
});


// puts a profile at a specified id
router.put('/profile/:id', async (req, res) => {
    try {
        const profile = await Profile.find({userId: req.params.id});
        try {
            const updatedProfile = await Profile.updateOne(
                {userId: req.params.id}, 
                { $set: {
                    userId: req.body.userId,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    company: req.body.company,
                    city: req.body.city,
                    country: req.body.country,
                    address: req.body.address,
                    postalCode: req.body.postalCode,
                    description: req.body.description
                }
            });
            res.json(updatedProfile);
        } catch(err) {
            res.status(400).json({message: err});
        }
    } catch(err) {
        res.status(404).json({message: err});
    }
});

// get all profiles 
router.get('/profiles', async (req, res) => {
    try {
        const profiles = await Profile.find({});
        res.status(200).json(profiles);
    } catch(err) {
        res.status(200).json({message: err});
    }
});

// get all profiles 
router.get('/profiles/getPublicCodes', async (req, res) => {
    console.log(req.query);
    let getLatestProfiles = false;
    const {
        searchedDocument
    } = req.query;
    if (searchedDocument === '') {
        console.log("here baby");
        getLatestProfiles = true;
    }
    console.log(searchedDocument);
    const tags = searchedDocument.split(" ");
    console.log(tags);
    try {
        // search profiles based on the new tags
        let profiles = [];
        console.log(getLatestProfiles);
        if (!getLatestProfiles) {
            profiles = await Profile.find({  "$or": [
                { firstName: {$in: tags}},
                { lastName: {$in: tags}},
                { company: {$in: tags}},
                { city: {$in: tags}},
                { description: {$in: tags}},
                { email: {$in: tags}},
                { phone: {$in: tags}}
            ]});
        } else {
            console.log("here tomita");
            profiles = await Profile.find({}).sort({"createdAt": -1}).limit(5);
        }
        console.log("baby 2");
        console.log(JSON.stringify(profiles));
        res.status(200).json(profiles);
    } catch(err) {
        res.status(200).json({message: err});
    }
});

// find profile by id
router.get('/profile/:id', async (req, res) => {
    console.log("here baby");
    const profile = await Profile.findOne({userId: req.params.id});
    if (profile) {
        console.log(profile);
        res.status(200).json(profile);
    } else {
        res.status(404).json({message: "Not Found"});
    }
});

// Delete a profile
router.delete('/profile/:id', async (req, res) => {
    try {
        const removedProfile = await Profile.deleteOne({_id: req.params.id});
        res.status(200).json(removedProfile);
    } catch(err) {
        res.status(404).json({message: err});
    }
});

// Delete all profiles
router.delete('/reset', async (req, res) => {
    try {
        const removedProfiles = await Profile.deleteMany();
        res.status(200).json(removedProfiles);
    } catch(err) {
        res.status(200).json({message: err});
    }
});

// Update a profile
router.patch('/profile/:id', async (req, res) => {
    try {
        const updatedProfile = await Profile.updateOne(
            {_id: req.params.id }, 
            { $set: {
                userId: req.body.userId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                company: req.body.company,
                city: req.body.city,
                country: req.body.country,
                address: req.body.address,
                postalCode: req.body.postalCode,
                description: req.body.description
            }
        });
        res.json(updatedProfile);
    } catch(err) {
        res.json({message: err});
    }
});

module.exports = router;