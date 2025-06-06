import express from "express"
import { deletePropertyById, fetchData, getPropertyById, getUserProperties, updatePropertyById, UploadData } from "../controller/property-controller.js";
import { savePurchaseRequest } from "../controller/property-controller.js";

import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route("/add-property").post(upload.single("image") ,UploadData);
router.route("/").get(fetchData);
router.route("/user-properties").get(protect, getUserProperties); 
router.route("/buy").post(protect, savePurchaseRequest); 
router.route("/:id")
  .put(upload.single("image"), updatePropertyById) 
  .delete(protect, deletePropertyById); 
router.get("/:id", protect, getPropertyById);
export default router;
