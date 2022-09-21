import express from "express"
import blogController from "../controllers/blogController.js";
import multer from 'multer';


const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './src/postImages');
  },

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

const router = express.Router()

router.post("/createPost", upload.single("postImage"), blogController.createPost);
router.get("/getAllPosts", blogController.getPosts);
router.get("/getSinglePost/:id", blogController.getSinglePost);
router.put("/updatePost/:id", upload.single("postImage"), blogController.updatePost);
router.delete("/deletePost/:id", blogController.deletePost);



export default router