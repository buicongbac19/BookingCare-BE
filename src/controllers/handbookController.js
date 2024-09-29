import handbookService from "../services/handbookService";

let createNewHandBook = async (req, res) => {
  try {
    let info = await handbookService.createNewHandBook(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let getAllHandBook = async (req, res) => {
  try {
    let info = await handbookService.getAllHandBook();
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let getDetailHandBookById = async (req, res) => {
  try {
    let info = await handbookService.getDetailHandBookById(req.query.id);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let updateHandBookInfo = async (req, res) => {
  try {
    let info = await handbookService.updateHandBookInfo(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console, log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let deleteHandBook = async (req, res) => {
  try {
    let info = await handbookService.deleteHandBook(req.body.id);
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
  createNewHandBook,
  getAllHandBook,
  getDetailHandBookById,
  updateHandBookInfo,
  deleteHandBook,
};
