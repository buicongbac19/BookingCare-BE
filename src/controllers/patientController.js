import patientService from "../services/patientService";

let patientBookAppointment = async (req, res) => {
  try {
    let info = await patientService.patientBookAppointment(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...!",
    });
  }
};

let verifyBookAppointment = async (req, res) => {
  try {
    let info = await patientService.verifyBookAppointment(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

module.exports = {
  patientBookAppointment,
  verifyBookAppointment,
};
