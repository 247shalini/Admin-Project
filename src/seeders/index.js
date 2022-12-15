const userModel = require("../api/models/user");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

exports.superAdmin = async () => {
  const adminDetail = await userModel.find({ email: process.env.email });
  if (adminDetail.length == 0 || adminDetail.role == "user") {
    userModel.create({
      firstName: "Super",
      lastName: "Admin",
      email: process.env.email,
      password: bcrypt.hashSync("Chapter@247", 10),
      role: "Super_admin",
      profilePhoto: faker.image.image(),
    });
  }
};