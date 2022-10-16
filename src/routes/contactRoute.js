import express from "express";
import contactController from "../controllers/contactController.js";

const router = express.Router();


router.post("/sendMessage", contactController.sendMessage);

router.get("/getAllMessages", contactController.getAllMessages);

router.delete("/deleteMessage/:id", contactController.deleteMessage);

router.put("/replyMessage/:id", contactController.replyMessage);

router.get("/getMessageById/:id", contactController.getMessageById);

export default router;

