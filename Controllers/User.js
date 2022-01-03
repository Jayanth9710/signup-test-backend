import mongodb from"mongodb"
import bcrypt from'bcrypt';
import jwt from'jsonwebtoken';
import mongoose from'mongoose';
import dotenv from'dotenv';
import crypto from'crypto';
import emailSend from '../Helpers/Email.js';
import tokenSchema from'../Models/TokenSchema.js';
import userSchema from'../Models/User.js';
const mongoClient = mongodb.MongoClient;

dotenv.config();
const url = process.env.MONGO_URI;

//------------Registering Users---------//

 export const registerUser = async (req,res) => {
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

 export const loginUser = async (req,res) => {
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

//-------------Forgot Password----------------//
export const forgotPassword = async (req,res) => {
    try {
    // Connecting to DB
    let client = await mongoose.connect(url);
    //Action 

    const user = await userSchema.findOne({ email: req.body.email });

    if(!user)
        return res.status(500).json({
            message:"User with given email does not exist!"
        });

        let token = await tokenSchema.findOne({ userId: user._id});

        if (!token) {
            token = await new tokenSchema({
                userId : user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.API}/reset-password/${user._id}/${token.token}`;

        await emailSend(user.email, "Reset Password", `Your Password rest link : ${link}`);

        //Closing the connection to DB
    await mongoose.disconnect();

    } catch (error) {
        res.status(500).json({
            message:'Something went wrong'
        });
        console.log(error)
    }
    
};

//-------------Reset Password----------------//

export const passwordreset = async (req,res) => {
    try {
        // Connecting to DB
    let client = await mongoClient.connect(url);

    // Selecting the DB
    let db = client.db("test");

    //Action
    const user = await db.collection("users").findOne({_id : req.params.userId});
    if (!user) return res.status(500).json({
        message:"Invalid Link or Expired Link"
    });

    const token = await Token_Schema.findOne({
        userId: user._id,
        token: req.params.token,
    });

    if(!token) return res.status(500).json({
        message:"Invalid Link or Expired Link"
    });

   // Hashing the Password 
   let salt = bcrypt.genSaltSync(10);
   let hash = bcrypt.hashSync(req.body.password,salt);

   req.body.password = hash;

   user.password = req.body.password;

   let data = await db.collection('users').insertOne(req.body);

   //Closing the connection to DB
   await client.close();

   res.json({
       message:"Password Reset Successfull."
   });
} catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Something went wrong!"
        })
    }
}

