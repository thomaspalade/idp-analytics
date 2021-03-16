const User = require('../models/user');
const bcrypt = require('bcryptjs');

async function updateUserData(id, userParam) {
  console.log("id");
  console.log(id);
  console.log("userParam");
  console.log(userParam);

  try {
    const user = await User.findOne({email: userParam.email});
  } catch (err) {
    console.log(err);
  }

  console.log('inside update user');
  console.log(userParam);

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  // Object.assign(user, userParam);

  console.log(JSON.stringify(await User.find({})));

  // e o problema cu colectia de useri o vede cam empty ... vezi aici
  
  try {
    const foundUser = await User.findOne({email: userParam.email});
    console.log(foundUser)
    try {
      console.log({
        "firstName" : foundUser.firstName,
        "lastName" : foundUser.lastName,
        "email" : foundUser.email,
        "createdDate" : foundUser.createdDate,
        "hash" : userParam.hash
      });
      const updatedProfile = await User.updateOne(
        {"_id": id},  // here IS THE PROBLEEEEEEEEM
        { $set: {
          "firstName" : foundUser.firstName,
          "lastName" : foundUser.lastName,
          "email" : foundUser.email,
          "createdDate" : foundUser.createdDate,
          "hash" : userParam.hash
        }
      });
      // res.json(updatedProfile);
    } catch(err) {
      console.log(err);
      // res.status(400).json({message: err});
    }
  } catch(err) {
    console.log(err);
    // res.status(404).json({message: err});
  }
}

// Export it to make it available outside
module.exports.updateUserData = updateUserData;