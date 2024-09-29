import { reject } from "lodash";
import db from "../models/index";
import { where } from "sequelize";

let createNewSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.image || !data.descMarkdown || !data.descHTML) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.image,
          descMarkdown: data.descMarkdown,
          descHTML: data.descHTML,
        });
        resolve({
          errCode: 0,
          errMessage: "Specialty created successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
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

let getDetailSpecialtyById = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: { id: id },
          attributes: ["descHTML", "descMarkdown", "id", "name", "image"],
        });
        if (data) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: { specialtyId: id },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: { specialtyId: id, provinceId: location },
              attributes: ["doctorId"],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
          data.image = new Buffer(data.image, "base64").toString("binary");
        } else data = {};
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

let updateSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let specialty = await db.Specialty.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (specialty) {
          specialty.name = data.name;
          specialty.image = data.image;
          specialty.descMarkdown = data.descMarkdown;
          specialty.descHTML = data.descHTML;
          await specialty.save();
          resolve({
            errCode: 0,
            errMessage: "Specialty updated successfully!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteSpecialty = (id) => {
  return new Promise(async (resolve, reject) => {
    if (!id) {
      resolve({
        errCode: 1,
        errMessage: "Missing required parameters!",
      });
    } else {
      let specialty = await db.Specialty.findOne({
        where: { id: id },
        raw: false,
      });
      if (specialty) {
        await specialty.destroy();
        resolve({
          errCode: 0,
          errMessage: "Specialty deleted successfully!",
        });
      }
    }
    try {
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  updateSpecialty,
  deleteSpecialty,
};
