import { NextFunction, Request, Response } from 'express'

import mongoose from 'mongoose'
import AuthorModel from '../models/author.model'

const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body

  const author = new AuthorModel({
    _id: new mongoose.Types.ObjectId(),
    name,
  })

  try {
    const author_1 = await author.save()
    return res.status(201).json({ author })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const readAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.params.authorId

    const author = await AuthorModel.findById(authorId)

    if (!author) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json({ author })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authors = await AuthorModel.find()

    return res.status(200).json({ authors })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.authorId

    const author = await AuthorModel.findOneAndUpdate(
      { _id: authorId },
      req.body,
      { new: true }
    )

    if (!author) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json({ author })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.authorId

    const author = await AuthorModel.findOneAndDelete({ _id: authorId })

    if (!author) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(201).json({ message: 'deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default {
  createAuthor,
  readAuthor,
  readAll,
  updateAuthor,
  deleteAuthor,
}
