import { where } from "sequelize";
import db from "../models/index";
import _, { reject } from "lodash";
require("dotenv").config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
import emailService from "./emailService";

let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        order: [["createdAt", "DESC"]],
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Doctor_Info,
            attributes: ["specialtyId"],
            include: [
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: ["name"],
              },
            ],
          },
        ],
        nest: true,
        raw: false,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let saveDetailInfoDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.doctorId ||
        !data.contentHTML ||
        !data.contentMarkdown ||
        !data.action ||
        !data.priceId ||
        !data.paymentId ||
        !data.provinceId ||
        !data.nameClinic ||
        !data.addressClinic ||
        !data.specialtyId ||
        !data.clinicId
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        if (data.action === "create") {
          await db.Markdown.create({
            contentMarkdown: data.contentMarkdown,
            contentHTML: data.contentHTML,
            description: data.description,
            doctorId: data.doctorId,
          });
        } else if (data.action === "edit") {
          let doctor = await db.Markdown.findOne({
            where: { doctorId: data.doctorId },
            raw: false,
          });
          if (doctor) {
            doctor.contentMarkdown = data.contentMarkdown;
            doctor.contentHTML = data.contentHTML;
            doctor.description = data.description;
            await doctor.save();
          }
        }
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: data.doctorId },
          raw: false,
        });
        if (doctorInfo) {
          doctorInfo.priceId = data.priceId;
          doctorInfo.paymentId = data.paymentId;
          doctorInfo.provinceId = data.provinceId;
          doctorInfo.nameClinic = data.nameClinic;
          doctorInfo.addressClinic = data.addressClinic;
          doctorInfo.note = data.note;
          doctorInfo.specialtyId = data.specialtyId;
          doctorInfo.clinicId = data.clinicId;
          await doctorInfo.save();
        } else {
          await db.Doctor_Info.create({
            doctorId: data.doctorId,
            priceId: data.priceId,
            paymentId: data.paymentId,
            provinceId: data.provinceId,
            nameClinic: data.nameClinic,
            addressClinic: data.addressClinic,
            note: data.note,
            specialtyId: data.specialtyId,
            clinicId: data.clinicId,
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save info doctor successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId", "createdAt", "updatedAt"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Specialty,
                  as: "specialtyData",
                  attributes: ["name"],
                },
              ],
            },
          ],
          nest: true,
          raw: false,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedules || !data.doctorId || !data.date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let schedules = data.arrSchedules;
        if (schedules && schedules.length > 0) {
          schedules = schedules.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });
        let toCreate = _.differenceWith(schedules, existing, (a, b) => {
          return a.timeType === b.timeType && a.date === b.date;
        });
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
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

let getSchedulesByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          nest: true,
          raw: false,
        });
        if (!data) data = [];
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getExtraInfoDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.Doctor_Info.findOne({
          where: { doctorId: id },
          attributes: {
            exclude: ["id", "doctorId", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          nest: true,
          raw: false,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName", "address", "gender"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueVi", "valueEn"],
            },
          ],
          nest: true,
          raw: false,
        });
        if (!data) data = [];
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let sendPrescription = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.patientId ||
        !data.timeType ||
        !data.patientName ||
        !data.image
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            timeType: data.timeType,
            statusId: "S2",
            patientId: data.patientId,
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }
        await emailService.sendPrescription(data);
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

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  saveDetailInfoDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getSchedulesByDate,
  getExtraInfoDoctorById,
  getListPatientForDoctor,
  sendPrescription,
};
