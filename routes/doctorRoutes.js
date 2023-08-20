const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  checkDoctorId,
  registerController,
  loginController,
  getDoctors
  // doctorAppointmentsController,
  // updateStatusController,
} = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST SINGLE MENTOR INFO
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST GET SINGLE MENTOR INFO
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

router.post('/check-doctorid', checkDoctorId);

router.post('/register', registerController);

router.post('/login', loginController);

router.get('/getdoctors', getDoctors);
// //GET Appointments
// router.get(
//   "/doctor-appointments",
//   authMiddleware,
//   doctorAppointmentsController
// );

//POST Update Status
// router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;