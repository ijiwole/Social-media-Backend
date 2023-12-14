import User from "../models/User.js";
import bcrypt from "bcrypt"

export const getAllUsers = async(req, res, next) =>{
    let users;
    try {
        users = await User.find();
    } catch (error) {
        console.log(error);
    }
    if(!users){
        return res.status(404).json({message: "No user found"})
    }
    return res.status(200).json({ users});
} 

export const signup = async(req, res, next) =>{
    const { name, email, password} = req.body

    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch (err) {
        return console.log(err);
    }
    if(existingUser) {
        return res.status(400).json({message: "User Already Exist! Login Instead"})
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    
    const user = new User({
        name,
        email,
        password : hashedPassword, 
        blogs: [], //done after we want each blog to be attached to single users
    });
    try {
       await user.save()  //used to save the user to the DB
    } catch (err) {
    return console.log(err);
    }
    return res.status(201).json({user})
}

export const login = async(req, res, next) => {
    const { email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch (err) {
        return console.log(err);
    }
    if(!existingUser) {
        return res
        .status(404)
        .json({message: "Couldn't find user by this email!"})
    }
    
    //compare password
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect){
        return res
        .status(400)
        .json({message: "Incorrect Password"})
    }
    return res
    .status(200)
    .json({message: "Login Successful"})
} 
