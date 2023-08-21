const hospitalModel = require("../models/hospitalModel");
// const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");
const healthInfoProviderModel = require("../models/healthInfoProviderModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ethers   = require('ethers');
const crypto   = require('crypto');
const healthFacilityModel = require("../models/healthFacilityModel");
const patientModel = require("../models/patientModel");

const encryptKey = async (secretKey, masterKey) => {
  // Key to be encrypted
  const keyToEncrypt = secretKey;
  // Generating a random initialization vector (IV)
  const iv = crypto.randomBytes(16); // 16 bytes (128 bits) for AES-CTR

  // Creating a cipher for encrypting the key using AES-CTR
  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(masterKey, 'hex'), iv);

  // Encrypting the key
  const encryptedKey = Buffer.concat([cipher.update(keyToEncrypt, 'utf-8'), cipher.final()]);

  const encryptedData = Buffer.concat([iv, encryptedKey]);
  return encryptedData.toString('hex');
}

const registerController = async (req,res) =>{
    try {
        //fist we check if the user is an existing user, if he/she is then redirect them to the login page
        const existingUser = await hospitalModel.findOne({hospitalId: req.body.hospitalId});
        if(existingUser)
        {
            return res.status(200).send({success: true, message: 'User with this hospitalId already exists'});
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
        const hospitalObj = await healthFacilityModel.findOne({ hospitalId : req.body.hospitalId })

        const userData = {
          password : req.body.password,
          email : hospitalObj.email,
          mobile : hospitalObj.mobile,
          isHospital : true,
        }
        //now creating new user using user model
        const newUser = new userModel(userData);
        await newUser.save();

        const wallet = ethers.Wallet.createRandom();

        // Get the address and private key
        const ethereumAddress = wallet.address;
        const privateKey = wallet.privateKey;
        const encryptedPrivateKey = await encryptKey(privateKey, process.env.MASTER_KEY);

        const hospitalData = {
          _id : newUser._id,
          hospitalId : req.body.hospitalId,
          name : hospitalObj.name,
          city : hospitalObj.city,
          pinCode : hospitalObj.pinCode,
          email : hospitalObj.email,
          mobile : hospitalObj.mobile,
          ethId : ethereumAddress,
          privateKey : encryptedPrivateKey,
        }

        const newHospital = new hospitalModel(hospitalData);
        await newHospital.save();

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


const checkHospitalId = async (req, res) => {
  const { hospitalId } = req.body;
  console.log(hospitalId);
  try {
      const hospital = await healthFacilityModel.findOne({ hospitalId : hospitalId });
      if (hospital) {
        return res.json({ exists: true });
      } else {
          return res.json({ exists: false });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

const getHospitals = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const hospitals = await hospitalModel.find({ name: { $regex: name, $options: 'i' } });
    
    return res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  checkHospitalId,
  registerController,
  loginController,
  getHospitals
  // hospitalAppointmentsController,
  // updateStatusController,
};