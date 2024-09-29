import { reject } from "lodash";
import db from "../models/index";
import bcrypt, { setRandomFallback } from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: [
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
            "id",
          ],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let hashedPassword = user.password;
          let check = await bcrypt.compareSync(password, hashedPassword);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password!";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User not found!";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage =
          "Your's email isn't exist in system. Please try another email.";
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { email: userEmail } });
      if (user) resolve(true);
      else resolve(false);
    } catch (error) {
      reject(error);
    }
  });
};
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId && userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
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

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check) {
        resolve({
          errCode: 1,
          errMessage:
            "Your's email is exist in system. Please try another email.",
        });
      } else {
        let hashedPassword = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          image: data.image,
          positionId: data.positionId,
        });
        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId }, raw: false });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "User not found!",
        });
      } else {
        await user.destroy();
        resolve({
          errCode: 0,
          errMessage: "Deleted user successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.gender || !data.positionId || !data.roleId) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter!",
        });
      }
      let user = await db.User.findOne({ where: { id: data.id }, raw: false });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.phoneNumber = data.phoneNumber;
        user.address = data.address;
        user.gender = data.gender;
        user.positionId = data.positionId;
        user.roleId = data.roleId;
        if (data.image) user.image = data.image;
        await user.save();
        resolve({
          errCode: 0,
          errMessage: "Updated user successfully!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let response = {};
        let allcode = await db.Allcode.findAll({
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { type: typeInput },
        });
        response.errCode = 0;
        response.data = allcode;
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  checkUserEmail,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
  getAllCodeService,
};
