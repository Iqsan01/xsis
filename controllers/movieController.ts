import { Request, Response, NextFunction } from "express";
import { Movie } from "../models";
import { BadRequestError, NotFoundError } from "../middleware";
import fs from 'fs';


export const getMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movies = await Movie.findAll();

        const formattedMovies = movies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            description: movie.description,
            rating: movie.rating,
            image: movie.image,
            created_at: movie.getFormattedCreatedAt(),
            updated_at: movie.getFormattedUpdatedAt(),
        }));

        return res.status(200).json(formattedMovies);
    } catch (error) {
        next(error);
    }
}

export const getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movieId = req.params.id;

        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            throw new NotFoundError('Movie tidak ditemukan.');
        }

        return res.status(200).json({
            id: movie.id,
            title: movie.title,
            description: movie.description,
            rating: movie.rating,
            image: movie.image,
            created_at: movie.getFormattedCreatedAt(),
            updated_at: movie.getFormattedUpdatedAt(),
        });
    } catch (error) {
        next(error);
    }
}

export const addMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, rating } = req.body;
        const image = req.file?.filename;

        if (!title || !description) {
            throw new BadRequestError('Title dan Description tidak boleh kosong!');
        }

        const newMovie = await Movie.create({
            title,
            description,
            rating,
            image,
        });

        return res.status(201).json({
            id: newMovie.id,
            title: newMovie.title,
            description: newMovie.description,
            rating: newMovie.rating,
            image: newMovie.image,
            created_at: newMovie.getFormattedCreatedAt(),
            updated_at: newMovie.getFormattedUpdatedAt(),
        });
    } catch (error) {
        next(error);
    }
}


export const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movieId = req.params.id;

        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            throw new NotFoundError('Movie tidak ditemukan.');
        }

        const { title, description, rating } = req.body;
        const image = req.file?.filename;

        if (!title || !description) {
            throw new BadRequestError('Title dan Description tidak boleh kosong!');
        }

        if (movie.image) {
            fs.unlinkSync(`images/${movie.image}`);
        }

        movie.title = title;
        movie.description = description;
        movie.rating = rating;
        movie.image = image;

        await movie.save();

        return res.status(200).json({
            id: movie.id,
            title: movie.title,
            description: movie.description,
            rating: movie.rating,
            image: movie.image,
            created_at: movie.getFormattedCreatedAt(),
            updated_at: movie.getFormattedUpdatedAt(),
        });
    } catch (error) {
        next(error);
    }
}

export const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movieId = req.params.id;

        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            throw new NotFoundError('Movie tidak ditemukan.');
        }

        if (movie.image) {
            fs.unlinkSync(`images/${movie.image}`);
        }

        await movie.destroy();

        return res.status(200).json({ message: 'Movie berhasil dihapus.' });
    } catch (error) {
        next(error);
    }
}