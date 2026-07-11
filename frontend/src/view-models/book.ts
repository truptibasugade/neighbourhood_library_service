import { observable, makeObservable } from 'mobx'

export interface IBook {
  id: number
  isbn: string
  title: string
  author: string
  genre: string
  publisher: string
  published_year: number | null
  total_copies: number
  available_copies: number
  created_at: string
  updated_at: string
}

export class Book {
  id: number

  isbn: string

  title: string

  author: string

  genre: string

  publisher: string

  published_year: number | null

  total_copies: number

  available_copies: number

  created_at: string

  updated_at: string

  constructor(data: IBook) {
    this.id = data.id
    this.isbn = data.isbn
    this.title = data.title
    this.author = data.author
    this.genre = data.genre
    this.publisher = data.publisher
    this.published_year = data.published_year
    this.total_copies = data.total_copies
    this.available_copies = data.available_copies
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    makeObservable(this, {
      id: observable,
      isbn: observable,
      title: observable,
      author: observable,
      genre: observable,
      publisher: observable,
      published_year: observable,
      total_copies: observable,
      available_copies: observable,
      created_at: observable,
      updated_at: observable,
    })
  }
}

export class BookFactory {
  static build(data: IBook): Book {
    return new Book(data)
  }
}

export interface IBookInput {
  isbn: string
  title: string
  author: string
  genre?: string
  publisher?: string
  published_year?: number | null
  total_copies: number
}
