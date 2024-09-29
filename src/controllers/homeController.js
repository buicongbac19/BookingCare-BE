import db from "../models/index";
import CRUDservice from "../services/CRUDservice";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homePage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDservice.createNewUser(req.body);
  return res.redirect("/display-crud");
};

let displayCRUD = async (req, res) => {
  let allUser = await CRUDservice.getAllUser();
  return res.render("displayCRUD.ejs", { dataTable: allUser });
};

let editCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDservice.getUserInfoById(userId);
    return res.render("editCRUD.ejs", { userData });
  } else {
    return res.send("User not found!");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  await CRUDservice.updateUserData(data);
  return res.redirect("/display-crud");
};

let deleteCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    await CRUDservice.deleteUserById(userId);
    return res.redirect("/display-crud");
  } else {
    return res.send("User Not Found!");
  }
};

module.exports = {
  getHomePage,
  getCRUD,
  postCRUD,
  displayCRUD,
  editCRUD,
  putCRUD,
  deleteCRUD,
};
