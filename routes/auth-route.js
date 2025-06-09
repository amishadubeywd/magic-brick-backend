import express from "express"
import { getUserProfile,  login, purchaseRequestDeletePropertyById, register } from "../controller/auth-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(getUserProfile);
router.route("/:id").delete(protect,purchaseRequestDeletePropertyById)


export default router;
