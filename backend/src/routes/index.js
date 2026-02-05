const { Router } = require('express');
const router = Router();

const AyoubUserRoutes = require("./ayoub/UserRoutes.js")
//const AyyoubUserRoutes = require("./ayyoub/UserRoutes.js")
const RayanUserRoutes = require("./rayan/UserRoutes.js")
const AminUserRoutes = require("./amin/UserRoutes.js")

const AyyoubRoutes = require("./ayyoub/index.js")

router.use("/", AyyoubRoutes);


const AyoubCompanyRoutes = require("./ayoub/CompanyRoutes.js")
//const AyyoubCompanyRoutes = require("./ayyoub/CompanyRoutes.js")
const RayanCompanyRoutes = require("./rayan/CompanyRoutes.js")
const AminCompanyRoutes = require("./amin/CompanyRoutes.js")

router.use("/User", AyoubUserRoutes);
//router.use("/User", AyyoubUserRoutes); 
router.use("/User", RayanUserRoutes);
router.use("/User", AminUserRoutes);

router.use("/Company", AyoubCompanyRoutes);
//router.use("/Company",AyyoubCompanyRoutes); 
router.use("/Company", RayanCompanyRoutes);
router.use("/Company", AminCompanyRoutes);


//router.use("/Logout",Logout) ; 
//router.use("/Login",Login);
//router.use("/SignIn",SignIn);

// Chatbot routes (amine backend)
const AminChatbotRoutes = require("./amin/ChatbotRoutes.js")
router.use("/Chatbot", AminChatbotRoutes);


module.exports = router;
