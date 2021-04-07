const config = require("../config.json");
const jwt = require('jsonwebtoken');

async function getUniqueGeneratedLink(email) {
  console.log("here inside getUniqueGeneratedLink");
  console.log(email);
  const token = jwt.sign({ sub: email }, config.secret, { expiresIn: '1h' });
  return token;
}
// Export it to make it available outside
module.exports.getUniqueGeneratedLink = getUniqueGeneratedLink;