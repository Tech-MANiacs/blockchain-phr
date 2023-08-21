const crypto   = require('crypto');
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const moment   = require('moment');
const jwt      = require('jsonwebtoken');
const ethers   = require('ethers');

const userModel = require('../models/userModels');
const abhaModel = require('../models/abhaModel');
const patientModel = require('../models/patientModel');
const healthInfoProviderModel = require('../models/healthInfoProviderModel');
const doctorModel = require('../models/doctorModel')
const hospitalModel = require('../models/hospitalModel');
const encryptPhrModel = require('../models/encryptPhrModel');
const healthFacilityModel = require('../models/healthFacilityModel');

const generateKeyFromPassword = async (userPassword) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);
    const iterations = 100000;
    const keyLength = 32;
    const hashFunction = 'sha256';

    crypto.pbkdf2(userPassword, salt, iterations, keyLength, hashFunction, (err, derivedKey) => {
      if (err) {
        console.error('Error deriving key:', err);
        reject(err);
      } else {
        resolve(derivedKey);
      }
    });
  });
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
  console.log("buffer form", encryptedData);
  return encryptedData.toString('hex');
}

const decryptKey = (encryptedData, masterKey) => {
  console.log(encryptedData);
  const loadedEncryptedData = Buffer.from(encryptedData, 'hex');
  console.log("buffer form decrypted", loadedEncryptedData);
  // Extract IV and encrypted key from the loaded data
  const loadedIv = loadedEncryptedData.subarray(0, 16);
  const loadedEncryptedKey = loadedEncryptedData.subarray(16);

  // Create a decipher for decrypting the key using AES-CTR
  const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(masterKey, 'hex'), loadedIv);

  // Decrypt the key
  let decryptedKeyBuffer = decipher.update(loadedEncryptedKey);
  decryptedKeyBuffer = Buffer.concat([decryptedKeyBuffer, decipher.final()]);
  console.log("decrypted buff", decryptedKeyBuffer);
  const decryptedKey = decryptedKeyBuffer.toString('utf-8');

  return decryptedKeyBuffer;
}

const registerController = async (req, res) => {
  try {
    //fist we check if the user is an existing user, if he/she is then redirect them to the login page
    const existingUser = await patientModel.findOne({ abhaId: req.body.abhaId });
    if (existingUser) {
      return res.status(200).send({ success: true, message: 'User with this ABHA ID already exists' });
    }
    //if new user
    //We store password hash in the db.
    const password = req.body.password;

    //Generating user's unique secret key from their password
    const derivedKey = await generateKeyFromPassword(password);
    console.log("derived", derivedKey);
    //encrypting their key before saving it in database
    const encryptedKey = await encryptKey(derivedKey, process.env.MASTER_KEY);
    console.log("encrypted key", encryptedKey);
    //To ecrypt password i.e take hash we use bcrypt salt (read its doc)
    //this parameter denotes the number of roundes, more the roundes more time it will take to take hash 
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt); //hash 10 times


    //replace original password with this hashed password in the request body and then store it in the database. 
    req.body.password = hashPassword;
    const abhaObj = await abhaModel.findOne({ abhaId: req.body.abhaId })

    const userData = {
      password: req.body.password,
      email: abhaObj.email,
      mobile: abhaObj.mobile,
      isUser: true
    }

    const newUser = new userModel(userData);
    await newUser.save();

    // Generate a new Ethereum wallet
    const wallet = ethers.Wallet.createRandom();

    // Get the address and private key
    const ethereumAddress = wallet.address;
    const privateKey = wallet.privateKey;
    console.log(privateKey);
    const encryptedPrivateKey = await encryptKey(privateKey, process.env.MASTER_KEY);

    const patientData = {
      _id: newUser._id,
      abhaId: req.body.abhaId,
      name: abhaObj.name,
      ethId: ethereumAddress,
      key: encryptedKey,
      privateKey: encryptedPrivateKey
    }
    //now creating new user using user model

    const newPatient = new patientModel(patientData);
    await newPatient.save();

    res.status(201).send({ success: true, message: "Registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
  }
};



const loginController = async (req, res) => {
  try {

    //cheching if the user already exists or not
    let user;
    if (req.body.isEmail) {
      user = await userModel.findOne({ email: req.body.email });
    }
    else {
      user = await userModel.findOne({ mobile: req.body.mobile });
    }

    if (!user) {
      return res.status(200).send({ message: `user not found!`, success: false });
    }
    //if user email exists, now we check password using the .compare method of bcryptjs

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      //to make it secure we directly do not want the user to know if its password that is incorrect or the email
      return res.status(200).send({ message: 'Icorrect email or password', success: false });
    }

    //all conditions checked, now we'll send a login success response and a token as well

    //created a secret key in the .env file

    //database has a field of _id, assigning token based on that id and signing it with our secret key

    //token is nothing but some info (json object here) which we are signing using our secret key
    //upon decoding, we will be access the info which we signed
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    //we'll send success reponse as well as token
    res.status(200).send({ message: `Login success`, success: true, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in login CTRL ${error.message}` });
  }
};


//this function will be called only when the authMiddleware function runs successfuly. In the authMiddleware function, we are just checking the authenticity of the token and if the token is correct, we add the _id of the token on with it was signed to the request body.
//Now in this function we check using that id in the req which we added if any user with that id exists in the database or not

const authController = async (req, res) => {
  try {
    //finding user in the database with the userId which we created in the req.body in the authMiddleware
    const user = await userModel.findById({ _id: req.body.userId });
    //we dont want to return password to the browser, so will hide it after fetching it from the database

    user.password = undefined;

    let user2 = null;
    if (user.isUser) {
      user2 = await patientModel.findById({ _id: req.body.userId });
    }
    else if (user.isDoctor) {
      user2 = await doctorModel.findById({ _id: req.body.userId });
    }
    else {
      user2 = await hospitalModel.findById({ _id: req.body.userId });
    }
    const mergedUser = { ...user.toObject(), ...user2.toObject() };
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }


    //sending every data about the user from the database to the frontend
    else {
      res.status(200).send({
        success: true,
        data: mergedUser,
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Auth failed", success: false, error });
  }
}

//apply doctor ctrl 
const applyDoctorController = async (req, res) => {
  try {

    const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
    await newDoctor.save()
    console.log(newDoctor);
    //fetching an user account to notify him/her about the doctor req
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification

    //pushing in the notification array

    notification.push({
      type: 'Apply-doctor-request',
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: '/admin/doctors'
      }
    });

    //sending this notification by updating our admin user
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: 'Doctor account applied successfully'
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for doctor"
    })
  }
}


//notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};


// delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};


//GET ALL 
const getAllDoctors = async (req, res) => {
  try {

    //fetching a list of all doctors with status approved
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Fetching Doctor",
    });
  }
};

const checkAbhaId = async (req, res) => {
  const { abhaId } = req.body;
  console.log(abhaId);
  try {
    const abha = await abhaModel.findOne({ abhaId: abhaId });
    if (abha) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

//function to encrypt data:
const encryptData = (derivedKey, sampleData) => {
  // array to hold encrypted fields and their IVs
  console.log(derivedKey);
  const encryptedFieldsArray = [];

  // Encrypting each field and storing its field name, IV, and encrypted data
  Object.keys(sampleData).forEach(fieldName => {
    const iv = crypto.randomBytes(16); // Generating a new IV for each field
    const cipher = crypto.createCipheriv('aes-256-ctr', derivedKey, iv);

    // Serializing array data into a string before encryption
    const fieldData = Array.isArray(sampleData[fieldName])
      ? JSON.stringify(sampleData[fieldName])
      : sampleData[fieldName];

    let encryptedData = cipher.update(fieldData, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');

    encryptedFieldsArray.push({
      fieldName,
      iv: iv.toString('hex'),
      encryptedData
    });
  });

  //encryptedFieldsArray 
  return encryptedFieldsArray;
}

function decryptData(derivedKey, encryptedFieldsArray) {
  // Create an object to hold decrypted data
  const decryptedData = {};

  // Decrypt each field and store its field name and decrypted data
  encryptedFieldsArray.forEach(encryptedField => {
    const iv = Buffer.from(encryptedField.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-ctr', derivedKey, iv);

    let decryptedDataString = decipher.update(encryptedField.encryptedData, 'hex', 'utf-8');
    decryptedDataString += decipher.final('utf-8');

    // Deserialize the decrypted string to original array if needed
    decryptedData[encryptedField.fieldName] = ['allergies', 'medications', 'appointment', 'conditions', 'vaccinations', 'surgeries', 'familyHistory'].includes(encryptedField.fieldName)
      ? JSON.parse(decryptedDataString)
      : decryptedDataString;
  });

  // Here, you can return the decryptedData object or use it as needed
  return decryptedData;
}

const hashEncryptedFieldsArray = (encryptedFieldsArray) => {
  // Serialize the encryptedFieldsArray to JSON

  const serializedData = JSON.stringify(encryptedFieldsArray);

  // Create a hash using SHA-256
  const hash = crypto.createHash('sha256');

  // Update the hash with the serialized data
  hash.update(serializedData);

  // Generate and return the hash in hexadecimal format
  return hash.digest('hex');
}

const storePhr = async (req, res) => {
  try {

    //getting user from the database from its userId
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json(
        {
          success: false,
          message: "user not registered",
        });
    }
    const patient = await patientModel.findById(req.body.userId);
    //excluding userId, rest of the data belong to phr
    const data = { ...req.body };
    delete data.userId;

    //master which is needed to decrypt the secret key stored in the database
    const masterKey = process.env.MASTER_KEY;

    //ecrypted key from database

    const decryptedKey = decryptKey(patient.key, masterKey);

    //encrypting data:
    const encryptedFieldsArray = encryptData(decryptedKey, data);
    // Create a new PHR document with encrypted fields
    const phrData = new encryptPhrModel({
      encryptedFields: encryptedFieldsArray,
    });

    //console.log("phrData", phrData);
    patient.phrId = phrData._id;

    await patient.save();
    // Save the PHR document
    await phrData.save();

    const dataHash = hashEncryptedFieldsArray(encryptedFieldsArray);

    return res.status(200).json({
      success: true,
      message: 'PHR data saved successfully',
      dataHash: dataHash,
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while saving PHR data',
    });
  }
}

const fetchPhr = async (req, res) => {

  try {

    let patient;
    console.log("hello query", req.query);
    if(req.query.isUser === 'true'){
      patient = await patientModel.findOne({ abhaId: req.query.abhaId });
    }
    else{
      patient = await patientModel.findOne({ ethId: req.query.ethId });
      console.log("patient", patient);
    }
    console.log(patient);
    const phrId = patient.phrId;

    //user's secret key in encrypted form
    const encryptedKey = patient.key;
    //decrypted secret key
    const secretKey = decryptKey(encryptedKey, process.env.MASTER_KEY);

    const encPhr = await encryptPhrModel.findById(phrId);

    //encrypted phr data of user
    const encPhrData = encPhr.encryptedFields;

    //hash of encrypted data
    const phrHash = hashEncryptedFieldsArray(encPhrData);

    //decrypted phr
    const phr = decryptData(secretKey, encPhrData);
    console.log(phr);
    return res.status(201).json({
      success: true,
      phr: phr,
      hash: phrHash,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error fetching phr",
    })
  }

}

const updatePhr = async (req, res) => {
  try {
    console.log("update", req.body);
    const data = { ...req.body };
    
    const patient = await patientModel.findById(req.body.userId);
    const phrId = patient.phrId;
    delete data.phrId;
    delete data.userId;
    console.log(data);
    //master which is needed to decrypt the secret key stored in the database
    const masterKey = process.env.MASTER_KEY;

    //ecrypted key from database

    const decryptedKey = decryptKey(patient.key, masterKey);

    //encrypting data:
    const encryptedFieldsArray = encryptData(decryptedKey, data);
    // Create a new PHR document with encrypted fields
    const phrDocument = await encryptPhrModel.findById(phrId);
    if (!phrDocument) {
      return res.status(404).json({
        success: false,
        message: "PHR document not found",
      });
    }

    phrDocument.encryptedFields = encryptedFieldsArray;
    await phrDocument.save();

    const dataHash = hashEncryptedFieldsArray(encryptedFieldsArray);

    return res.status(200).json({
      success: true,
      message: 'PHR data saved successfully',
      dataHash: dataHash,
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while saving PHR data',
    });
  }
}

const getDoctorsWithAccess = async (req, res) => {

  try {
    const doctors = await doctorModel.find();

    return res.status(201).json({
      success: true,
      doctors: doctors,
      isDoctor: true,
      isHospital: false
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error fetching phr",
    })
  }

}

const getHospitalsWithAccess = async (req, res) => {

  try {
    const hospitals = await hospitalModel.find();

    return res.status(201).json({
      success: true,
      hospitals: hospitals,
      isDoctor: false,
      isHospital: true
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error fetching phr",
    })
  }

}

const getUser = async (req, res) => {
  try {
    const { abhaId } = req.query;

    if (!abhaId) {
      return res.status(400).json({ message: 'abhaId is required' });
    }

    const patient = await patientModel.findOne({ abhaId: abhaId });
    
    patient.key = undefined;
    patient.privateKey = undefined;
    patient.phrId = undefined;
    console.log(patient);
    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  loginController,
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
  // bookingAvailabilityController,
  // userAppointmentsController,
};