import usrFuncs from "../data/challenges.js";
import { Router } from "express";
import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req,file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") cb(null, true);
    else{
      cb(null, false);
      const fileError = new Error("Only .png and .jpg files allowed");
      fileError.name = "fileExtensionError";
      return cb(fileError);
    }
  }
});

const router = Router();

router.route("/").get(async (req, res) => {
  // const challenges = await usrFuncs.getAllChallenges();
  // const curDate = new Date();

  // const curChallenges = challenges.filter(
  //     (challenge) => challenge.deadline > curDate
  // );

  // const pastChallenges = challenges.filter(
  //     (challenge) => challenge.deadline < curDate
  // );

  return res.status(200).render("challenges", {
    // curChallenges: curChallenges,
    // pastChallenges: pastChallenges,
    user: req.session.user,
  });
});

router.post("/submit",upload.array("uploaded_file",10), async (req,res) => {
  try {
    const files = req.files;
    console.log(req.files);
    await usrFuncs.uploadToFirebase("","",files);
    res.json("all good");

  } catch (error) {
    res.json({error: true, msg: error.toString()});
  }
});

export default router;
