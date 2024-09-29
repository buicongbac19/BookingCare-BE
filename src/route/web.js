import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import handbookController from "../controllers/handbookController";
import chatbotController from "../controllers/chatbotController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/display-crud", homeController.displayCRUD);
  router.get("/edit-crud", homeController.editCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.getAllCode);

  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.post("/api/save-info-doctor", doctorController.postInfoDoctor);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  );
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);

  router.get("/api/get-schedules-by-date", doctorController.getSchedulesByDate);
  router.get(
    "/api/get-extra-info-doctor-by-id",
    doctorController.getExtraInfoDoctorById
  );
  router.post(
    "/api/patient-book-appointment",
    patientController.patientBookAppointment
  );

  router.post(
    "/api/verify-book-appointment",
    patientController.verifyBookAppointment
  );

  router.post(
    "/api/create-new-specialty",
    specialtyController.createNewSpecialty
  );

  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);

  router.get(
    "/api/get-detail-specialty-by-id",
    specialtyController.getDetailSpecialtyById
  );

  router.put("/api/update-specialty", specialtyController.updateSpecialty);

  router.delete("/api/delete-specialty", specialtyController.deleteSpecialty);

  router.post("/api/create-new-clinic", clinicController.createNewClinic);

  router.get("/api/get-all-clinic", clinicController.getAllClinic);

  router.get(
    "/api/get-detail-clinic-by-id",
    clinicController.getDetailClinicById
  );

  router.put("/api/update-clinic", clinicController.updateClinic);

  router.delete("/api/delete-clinic", clinicController.deleteClinic);

  router.get(
    "/api/get-list-patient-for-doctor",
    doctorController.getListPatientForDoctor
  );

  router.post("/api/send-prescription", doctorController.sendPrescription);

  router.post("/api/create-new-handbook", handbookController.createNewHandBook);
  router.get("/api/get-all-handbook", handbookController.getAllHandBook);
  router.get(
    "/api/get-detail-handbook-by-id",
    handbookController.getDetailHandBookById
  );
  router.put(
    "/api/update-handbook-info",
    handbookController.updateHandBookInfo
  );
  router.delete("/api/delete-handbook", handbookController.deleteHandBook);

  router.post("/api/send-message", chatbotController.sendMessage);

  return app.use("/", router);
};

module.exports = initWebRoutes;
