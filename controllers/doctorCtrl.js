const doctorModel = require("../models/doctorModel");
// const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");
const healthInfoProviderModel = require("../models/healthInfoProviderModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ethers   = require('ethers');
const crypto   = require('crypto');

function generateRandomAlphaNumeric(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
  }

  return result;
}

const encryptKey = async (secretKey, masterKey) => {
  // Key to be encrypted
  const keyToEncrypt = secretKey;
  console.log("secret key: ", keyToEncrypt);
  // Generating a random initialization vector (IV)
  const iv = crypto.randomBytes(16); // 16 bytes (128 bits) for AES-CTR

  // Creating a cipher for encrypting the key using AES-CTR
  console.log(masterKey);
  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(masterKey, 'hex'), iv);

  // Encrypting the key
  const encryptedKey = Buffer.concat([cipher.update(keyToEncrypt, 'utf-8'), cipher.final()]);

  const encryptedData = Buffer.concat([iv, encryptedKey]);
  return encryptedData;
}

const registerController = async (req,res) =>{
    try {
        //fist we check if the user is an existing user, if he/she is then redirect them to the login page
        const existingUser = await doctorModel.findOne({doctorId: req.body.doctorId});
        if(existingUser)
        {
            return res.status(200).send({success: true, message: 'User with this doctorId already exists'});
        }
        //if new user
        //We store password hash in the db.
        const password = req.body.password;


        //To ecrypt password i.e take hash we use bcrypt salt (read its doc)
        //this parameter denotes the number of roundes, more the roundes more time it will take to take hash 
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt); //hash 10 times


        //replace original password with this hashed password in the request body and then store it in the database. 
        req.body.password = hashPassword;
        const doctorObj = await healthInfoProviderModel.findOne({ doctorId : req.body.doctorId })

        const userData = {
          password : req.body.password,
          email : doctorObj.email,
          mobile : doctorObj.mobile,
          isDoctor : true,
        }
        //now creating new user using user model
        const newUser = new userModel(userData);
        await newUser.save();

        const wallet = ethers.Wallet.createRandom();

        // Get the address and private key
        const ethereumAddress = wallet.address;
        const privateKey = wallet.privateKey;
        const encryptedPrivateKey = await encryptKey(privateKey, process.env.MASTER_KEY);

        const doctorData = {
          _id : newUser._id,
          doctorId : req.body.doctorId,
          firstName : doctorObj.firstName,
          lastName : doctorObj.lastName,
          ethId : ethereumAddress,
          privateKey : encryptedPrivateKey,
          city : doctorObj.city,
          address : doctorObj.address,
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(201).send({success: true, message: "Registered successfully"});
        
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false, message: `Register Controller ${error.message}`});
    }
};


const loginController = async (req,res) =>{
  try {

      //cheching if the user already exists or not
      let user;
      console.log(req.body);
      if(req.body.isEmail){
          user = await userModel.findOne({email: req.body.email});
      }
      else {
          user = await userModel.findOne({mobile: req.body.mobile});
      }

      if(!user){
          return res.status(200).send({message: `user not found!`, success: false});
      }
      //if user email exists, now we check password using the .compare method of bcryptjs

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if(!isMatch){
          //to make it secure we directly do not want the user to know if its password that is incorrect or the email
          return res.status(200).send({message: 'Incorrect email or password', success: false});
      }

      //all conditions checked, now we'll send a login success response and a token as well

      //created a secret key in the .env file

      //database has a field of _id, assigning token based on that id and signing it with our secret key

      //token is nothing but some info (json object here) which we are signing using our secret key
      //upon decoding, we will be access the info which we signed
      const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '1d'});

      //we'll send success reponse as well as token
      res.status(200).send({message: `Login success`, success: true, token:token});
  } catch (error) {
      console.log(error);
      res.status(500).send({message:`Error in login CTRL ${error.message}` });
  }
};

const getDoctorInfoController = async (req, res) => {
  try {

    //fetching doctor based on Id
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

// update doctor profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};

//get single doctor
//controller to direct user to the booking page of a particular doctor
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Sigle Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Erro in Single Doctor info",
    });
  }
};

// const doctorAppointmentsController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOne({ userId: req.body.userId });
//     const appointments = await appointmentModel.find({
//       doctorId: doctor._id,
//     });
//     res.status(200).send({
//       success: true,
//       message: "Doctor Appointments fetched Successfully",
//       data: appointments,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Doctor Appointments",
//     });
//   }
// };

// const updateStatusController = async (req, res) => {
//   try {
//     const { appointmentsId, status } = req.body;
//     const appointments = await appointmentModel.findByIdAndUpdate(
//       appointmentsId,
//       { status }
//     );
//     const user = await userModel.findOne({ _id: appointments.userId });
//     const notification = user.notification;
//     notification.push({
//       type: "status-updated",
//       message: `your appointment has been updated ${status}`,
//       onCLickPath: "/doctor-appointments",
//     });
//     await user.save();
//     res.status(200).send({
//       success: true,
//       message: "Appointment Status Updated",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error In Update Status",
//     });
//   }
// };
const checkDoctorId = async (req, res) => {
  const { doctorId } = req.body;
  console.log(doctorId);
  try {
      const doctor = await healthInfoProviderModel.findOne({ doctorId : doctorId });
      if (doctor) {
        return res.json({ exists: true });
      } else {
          return res.json({ exists: false });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  checkDoctorId,
  registerController,
  loginController
  // doctorAppointmentsController,
  // updateStatusController,
};