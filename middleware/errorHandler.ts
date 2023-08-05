import { Request, Response, NextFunction } from 'express';

class NotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'Not Found';
    }
  }
  
  class BadRequestError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'Bad Request';
    }
  }

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof BadRequestError) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Something went wrong.' });
};

export { NotFoundError, BadRequestError };