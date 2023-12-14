import mongoose from "mongoose";
import Blog from "../models/Blog.js"
import User from "../models/User.js";

export const getAllBlogs = async( req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (err) {
       return console.log(err);
    }
    if (!blogs){
        return res
        .status(404)
        .json({message: "No Blogs Found"})
    }
    return res.status(200).json({blogs})
}

export const addBlog = async(req, res, next) => {
    const {title, description, image, user} = req.body

    let existingUser;
    try {
         existingUser = await User.findById(user)
    } catch (err) {
        return console.log(err);
    }
    if(!existingUser){
        return res.status(400).json({message: "Unable to find this ID"})
    }
const blog = new Blog({
    title,
    description,
    image, 
    user,
});
try {
   const session = await mongoose.startSession(); //initiated a DB session using mongoose
   session.startTransaction();  // started a transactioon, transaction is a series of operations treated as a single atomic unit
   await blog.save({session});  // saving a new blog document to the DB. the session parameter allows the operation to be part of the ongoing transaction
   existingUser.blogs.push(blog); //adding the newly created blog to the list of blogs associated with an existing user
   await existingUser.save({ session}); //saved the updated user document
   await session.commitTransaction(); // finalizing transaction
} catch (err) {
    console.log(err);
    return res.status(500).json({message: err})
}
return res
.status(200)
.json({blog})
}

export const updateBlog = async(req, res, next) => {
    const {title, description} = req.body
    const blogId = req.params.id;

   const blog = await Blog.findByIdAndUpdate(blogId, {
    title,
    description
})

if(!blog){
    return res
    .status(500)
    .json({message: "Unable to Update the Blog!"})
}
return res
.status(200)
.json({blog})
}

export const getById = async(req, res, next) => {
    const id = req.params.id;
    let blog;

    try {
        console.log(id);
        blog = await Blog.findById(id) 
    } catch (err) {
        return console.log(err);
    }
    if(!blog){
        return res
        .status(404)
        .json({message: "Blog not found"})
    }
    return res.status(200).json({ blog })
}

export const deleteBlog = async(req, res, next) =>{
    const id = req.params.id
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (err) {
        console.log(err);
    }
    if(!blog){
        return res
        .status(500)
        .json({message: "Unable to delete"}) 
    }
    return res
    .status(200)
    .json({message: "Succefully deleted!"})
}

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs")
    } catch (err) {
       return console.log(err);
    }
    if(!userBlogs){
        return res.status(404).json({message: "No Blog Found"})
    }
    return res.status(200).json({blogs: userBlogs})
}