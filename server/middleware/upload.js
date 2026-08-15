import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { filesize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    },
});

export default upload;