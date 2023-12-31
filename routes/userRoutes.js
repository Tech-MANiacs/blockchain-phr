const express  = require('express');


//to respond to requests on these routes, we created functions, need to import those
const {loginController, 
    registerController, 
    authController, 
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctors,
    checkAbhaId,
    storePhr,
    fetchPhr,
    updatePhr,
    getDoctorsWithAccess,
    getHospitalsWithAccess,
    getUser
    // bookeAppointmnetController,
    //bookingAvailabilityController,
    // userAppointmentsController
  } = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//created a router object
//we will define routes for login and post in this file and save it in router const
const router = express.Router();


//login || post
router.post('/login', loginController);
//register || post
router.post('/register', registerController);

//Auth || post
router.post('/getUserData', authMiddleware, authController);

//Apply doctor || post
router.post('/apply-doctor', authMiddleware, applyDoctorController);

//Notifiaction  Doctor || POST
router.post(
    "/get-all-notification",
    authMiddleware,
    getAllNotificationController
  );

//Notification  Doctor || POST
router.post(
    "/delete-all-notification",
    authMiddleware,
    deleteAllNotificationController
  );


//GET ALL DOC
router.get('/getDoctorsWithAccess', getDoctorsWithAccess)

router.get('/getHospitalsWithAccess', getHospitalsWithAccess)

router.get('/getAllDoctors', authMiddleware, getAllDoctors)

router.post('/check-abhaid', checkAbhaId);

router.post('/storephr', storePhr);

router.post('/updatephr', updatePhr);

router.get('/fetchphr', fetchPhr);

router.get('/getuser', getUser);

// //BOOK APPOINTMENT
// router.post('/book-appointment', authMiddleware, bookeAppointmnetController);


// //Booking Availability
// router.post('/booking-availbility', authMiddleware, bookingAvailabilityController);

// //Appointments List
// router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;