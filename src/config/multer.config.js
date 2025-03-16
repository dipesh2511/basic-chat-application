import multer from "multer";

let storageConfiguration = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profile.pictures");
  },
  filename: (req, file, cb) => {
    let date_stamp = Date.now();
    let file_name = file.originalname;
    console.log(date_stamp);
    cb(null, `${date_stamp}_${file_name}`);
  },
});
export let upload = multer({ storage: storageConfiguration });
