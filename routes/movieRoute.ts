import express from "express";
import { addMovie, deleteMovie, getMovieById, getMovies, updateMovie } from "../controllers";
import multer from "multer";
import { format } from 'date-fns-tz';

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const dateFormatted = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
        cb(null, dateFormatted + '_' + file.originalname);
    }
});

const image = multer({ storage: imageStorage }).single('image');


router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', image, addMovie);
router.patch('/:id',image, updateMovie);
router.delete('/:id', deleteMovie);



export { router as movieRoute };