import { where } from "sequelize";
import db from "../models/index";
import { reject } from "lodash";

let createNewClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.image ||
        !data.descMarkdown ||
        !data.descHTML ||
        !data.address ||
        !data.background
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          image: data.image,
          descMarkdown: data.descMarkdown,
          descHTML: data.descHTML,
          address: data.address,
          background: data.background,
        });
        resolve({
          errCode: 0,
          errMessage: "Clinic created successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      if (data && data.length > 0) {
        data.forEach((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Ok",
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailClinicById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: { id: id },
          attributes: [
            "descHTML",
            "name",
            "address",
            "image",
            "background",
            "descMarkdown",
          ],
        });
        if (!data) data = {};
        else {
          data.image = new Buffer(data.image, "base64").toString("binary");
          data.background = new Buffer(data.background, "base64").toString(
            "binary"
          );
        }
        resolve({
          errCode: 0,
          errMessage: "Ok",
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let clinic = await db.Clinic.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (clinic) {
          clinic.name = data.name;
          clinic.image = data.image;
          clinic.background = data.background;
          clinic.descMarkdown = data.descMarkdown;
          clinic.descHTML = data.descHTML;
          await clinic.save();
          resolve({
            errCode: 0,
            errMessage: "Clinic updated successfully!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteClinic = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let clinic = await db.Clinic.findOne({
          where: { id: id },
          raw: false,
        });
        if (clinic) {
          await clinic.destroy();
          resolve({
            errCode: 0,
            errMessage: "Clinic deleted successfully!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewClinic,
  getAllClinic,
  getDetailClinicById,
  updateClinic,
  deleteClinic,
};
