import express from "express"
import { getUserProfile,  login, register } from "../controller/auth-controller.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(getUserProfile);


export default router;
