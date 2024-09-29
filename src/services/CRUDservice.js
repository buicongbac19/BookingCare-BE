import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashedPassword = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve("Created a new user");
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let allUser = await db.User.findAll({
        raw: true,
      });
      resolve(allUser);
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (userData) {
        resolve(userData);
      } else {
        resolve({});
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: data.id } });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        resolve();
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId } });
      if (user) {
        await user.destroy();
        resolve();
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewUser,
  hashUserPassword,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
};
