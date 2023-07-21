import { NextFunction, Request, Response } from 'express'

import mongoose from 'mongoose'
import BookModel from '../models/book.model'

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, author } = req.body

  const book = new BookModel({
    _id: new mongoose.Types.ObjectId(),
    title,
    author,
  })

  try {
    const book_1 = await book.save()

    return res.status(201).json({ book })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const readBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId

    const book = await BookModel.findById(bookId)

    if (!book) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json({ book })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await BookModel.find()

    return res.status(200).json({ books })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId

    const book = await BookModel.findOneAndUpdate({ _id: bookId }, req.body, {
      new: true,
    })

    if (!book) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json({ book })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId

    const book = await BookModel.findOneAndDelete({ _id: bookId })

    if (!book) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(201).json({ message: 'deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default {
  createBook,
  readBook,
  readAll,
  updateBook,
  deleteBook,
}
