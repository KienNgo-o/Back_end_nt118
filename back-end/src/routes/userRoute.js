import express from "express";
import {
  deleteAccount,
  updateUserProfile,
<<<<<<< HEAD
  submitAppRating
=======
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7
} from "../controllers/userController.js";

const router = express.Router();

<<<<<<< HEAD
router.delete("/me/delete", deleteAccount);
router.patch("/me/update", updateUserProfile);
router.post("/rate-app", submitAppRating);
=======
router.delete("/me", deleteAccount);

router.patch("/me", updateUserProfile);

>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7
export default router;