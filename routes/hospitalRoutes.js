const express = require("express");
const {
    checkHospitalId,
    registerController,
    loginController,
    getHospitals
} = require("../controllers/hospitalCtrl");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/check-hospitalid', checkHospitalId);

router.post('/register', registerController);

router.post('/login', loginController);

router.get('/gethospitals', getHospitals);

module.exports = router;