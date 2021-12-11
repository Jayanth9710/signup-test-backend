const mongodb = require("mongodb")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoClient = mongodb.MongoClient;

dotenv.config();
const url = process.env.MONGO_URI;

//------------Registering Users---------//

 const registerUser = async (req,res) => {
    try {
        // Connecting to DB
        let client = await mongoClient.connect(url);

        //Select the DB
let db = client.db("test");
let emailCheck = await db.collection("users").findOne({ email : req.body.email });

if (!emailCheck) {
    // Hashing the Password 
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password,salt);

    req.body.password = hash;

    //Posting the User details to DB

    let data = await db.collection('users').insertOne(req.body);

    //Closing the connection to DB
    await client.close();

    res.json({
        message:"User Registered Successfully"
    });
} else {
    // Case when email is already present in DB.
    res.status(400).json({
        message:"E-mail is already registered.Please try with different e-mail ID."
    });
}
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Registration Failed due to some reason or Myabe check your connection."
        })
    }
}

//-------------User Login----------------//

 const loginUser = async (req,res) => {
    try {
        // Connecting to DB
        let client = await mongoClient.connect(url);

        // Selecting the DB
        let db = client.db("test");

        //Finding the user details in DB

        let user = await db.collection("users").findOne({ email : req.body.email });

        if (user) {
            let validPassword = bcrypt.compareSync(req.body.password,user.password);

            if(validPassword) {
                let token = jwt.sign({ id : user._id},process.env.JWT_SECRET);
            res.json({
                message:true,
                token,
                user:user._id
            });
            } else {
                res.status(500).json({
                    message:"Username/Password is incorrect",
                });
            }
        } else {
            res.status(500).json({
                message:"Username/Password is incorrect",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Sign in failed due to some reason or maybe check your connection."
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
}