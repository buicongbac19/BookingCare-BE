import clinicService from "../services/clinicService";

let createNewClinic = async (req, res) => {
  try {
    let info = await clinicService.createNewClinic(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let info = await clinicService.getAllClinic();
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let getDetailClinicById = async (req, res) => {
  try {
    let info = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let updateClinic = async (req, res) => {
  try {
    let info = await clinicService.updateClinic(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let deleteClinic = async (req, res) => {
  try {
    let info = await clinicService.deleteClinic(req.body.id);
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
  createNewClinic,
  getAllClinic,
  getDetailClinicById,
  updateClinic,
  deleteClinic,
};
