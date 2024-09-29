import { reject } from "lodash";
import db from "../models/index";
import { where } from "sequelize";

let createNewHandBook = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.image || !data.descMarkdown || !data.descHTML) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        await db.Handbook.create({
          name: data.name,
          image: data.image,
          descMarkdown: data.descMarkdown,
          descHTML: data.descHTML,
        });
        resolve({
          errCode: 0,
          errMessage: "HandBook created successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllHandBook = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Handbook.findAll();
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

let getDetailHandBookById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Handbook.findOne({
          where: { id: id },
          attributes: ["descHTML", "image", "name", "descMarkdown"],
        });
        if (!data) data = {};
        else {
          data.previewImg = data.image;
          data.image = new Buffer(data.image, "base64").toString("binary");
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

let updateHandBookInfo = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }
      let handBook = await db.Handbook.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (handBook) {
        handBook.name = data.name;
        handBook.image = data.image;
        handBook.descMarkdown = data.descMarkdown;
        handBook.descHTML = data.descHTML;
        await handBook.save();
        resolve({
          errCode: 0,
          errMessage: "HandBook updated successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteHandBook = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let handBook = await db.Handbook.findOne({
          where: { id: id },
          raw: false,
        });
        if (handBook) {
          await handBook.destroy();
          resolve({
            errCode: 0,
            errMessage: "HandBook deleted successfully!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewHandBook,
  getAllHandBook,
  getDetailHandBookById,
  updateHandBookInfo,
  deleteHandBook,
};
