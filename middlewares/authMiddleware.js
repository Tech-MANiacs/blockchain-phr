const jwt = require('jsonwebtoken');

//middleware function are nothing but the next function i.e it is just the normal callback function with additional next parameter with response and request parameters

module.exports = async (req,res,next) =>{
    try {
        //data are present in the body of the request whereas the token is present in the header of the request


    //json token uses bearer naming convention which upon accessing through authorization looks like : bearer fhfnhchfnv 
    //This second part after space is what we need and is our token, Hence we will spil and access the 1st element (0 indexing)
    const token = req.headers['authorization'].split(" ")[1];

    //this .verify function of jwt will decode the token using our original secret key and will provide a callback function with parameter error and decode, error if there's error and decode if the decoding is success it will be the original id after decoding.
    jwt.verify(token,process.env.JWT_SECRET, (error,decode) => {
        if(error){
            return res.status(200).send("Authorization failed");
        }
        else{
            //handle request

            //Once we decode token, creating a field in req.body as userID and assigning it the id that we signed while generating token
            
            req.body.userId = decode.id; //the id we signed in token using our secret key
            next();
        }
    })
        
    } catch (error) {
        console.log(error);
        res.status(401).send({message: "Auth failed", success: false})
    }
}
