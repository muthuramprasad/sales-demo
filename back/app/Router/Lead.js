module.exports=(app)=>{

    const express= require('express');
    const asyncHandler=require('express-async-handler');
    const createLead=require('../Controller/Lead').createLead;
    const getLeads=require('../Controller/Lead').getLeads;
    const updateLead=require('../Controller/Lead').updateLead;
    const SoftDeleteLead=require('../Controller/Lead').SoftDeleteLead;
    const toggleConvertIntoCustomer = require('../Controller/Lead').toggleConvertIntoCustomer;

    const router=express.Router();



    router.post("/lead", asyncHandler(createLead));
    router.get("/getlead", asyncHandler(getLeads));
    router.put("/lead/:id", asyncHandler(updateLead));
    router.patch("/lead/:id", asyncHandler(SoftDeleteLead));
    router.put("/leads/:id/toggleConvert", asyncHandler(toggleConvertIntoCustomer));
    


    app.use("/api", router);

}