import { where } from "sequelize";
import db from "../models/index";
import _, { reject } from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

let patientBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.date ||
        !data.timeType ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address ||
        !data.price ||
        !data.clinicAddress
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          redirectLink: buildUrlEmail(data.doctorId, token),
          time: data.time,
          doctorName: data.doctorName,
          clinicAddress: data.clinicAddress,
          price: data.price,
        });
        let [user, created] = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            address: data.address,
            gender: data.selectedGender,
            firstName: data.fullName,
            phoneNumber: data.phoneNumber,
          },
        });
        if (user) {
          await db.Booking.findOrCreate({
            where: { patientId: user.id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user.id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Appointment booked successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let verifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: { doctorId: data.doctorId, token: data.token, statusId: "S1" },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Appointment verified successfully!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or dose not exist!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  patientBookAppointment,
  verifyBookAppointment,
};
