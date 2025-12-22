import { Router } from "express";
import { loginuser, logoutuser, refreshAccessToken, register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyjwt} from "../middlewares/auth.middleware.js";
const router= Router()

router.route("/register").post(
    upload.fields([
        {name:"avatar", maxCount:1},
        {name:"coverImage", maxCount:1}
    ]),
    register
);
router.route("/login").post(loginuser);
router.route("/logout").post(verifyjwt,logoutuser);
router.route("/refresh-access-token").post(refreshAccessToken);

export default router