const express = require('express');
const router = express.Router();
const mailTransporter = require('../api/sendEmail');
const linkGenerator = require('../api/generateLink');
const postToDatabase = require('../api/postGeneratedLink');

router.post('/forgotPassword', async (req, res) => {
  console.log("here inside forgotPassword");
  // console.log(req);
  console.log(req.body.email);
  const email = req.body.email;
  // const uniqueLink = linkGenerator.getUniqueGeneratedLink();
  // console.log(uniqueLink);
  try {
    const uniqueLink = await linkGenerator.getUniqueGeneratedLink(email);
    console.log(uniqueLink);
    try {
      const response = await mailTransporter.sendEmail(email, uniqueLink);
      console.log(JSON.stringify(response));
      try {
        console.log("here trying to do a good job.");
        const returnValue = await postToDatabase.postGeneratedLink({
          email: email,
          uniqueLink: uniqueLink
        });
        console.log(returnValue);
      } catch (err) {
      }
    } catch (err) {
    }
  } catch (err) {
  }
  res.status(201).json("SUCCES"); // always succes
});

module.exports = router;