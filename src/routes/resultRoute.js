import express from "express";
import resultController from "../controllers/resultController.js";

const router = express.Router();


router.post("/saveResult", resultController.saveResult);

router.get("/getAllResults", resultController.getAllResults);

router.delete("/deleteResult/:id", resultController.deleteResult);

router.get("/getResultById/:id", resultController.getResultById);

export default router;

