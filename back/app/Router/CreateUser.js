module.exports=(app)=>{
    const express=require('express');

    const asyncHandler=require('express-async-handler');
    const user=require('../Controller/CreateUser').user;
    const login=require('../Controller/CreateUser').login;
    const getUsers=require('../Controller/CreateUser').getUsers;
    const deleteUser=require('../Controller/CreateUser').deleteUser;
    const updateUser=require('../Controller/CreateUser').updateUser;

    const router = express.Router();

    router.post("/signup", asyncHandler(user)); // User signup route
    router.get("/signup", asyncHandler(getUsers)); // User signup route
    router.delete("/signup/:id", asyncHandler(deleteUser)); // User signup route
    router.put("/signup/:id", asyncHandler(updateUser)); // User signup route
    router.post("/login", asyncHandler(login)); // User login route


    app.use("/api", router);
}