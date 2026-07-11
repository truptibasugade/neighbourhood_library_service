import { observable, action, runInAction, makeObservable } from 'mobx'

import ApiRequest, { ApiError } from './api-request'
import NotifierStore from './notifier-store'
import { Book, BookFactory, IBook, IBookInput } from '../view-models/book'

class BooksStore {
  books: Book[] = []

  loading: boolean = false

  private apiRequest: ApiRequest

  private notifierStore: NotifierStore

  constructor(apiRequest: ApiRequest, notifierStore: NotifierStore) {
    this.apiRequest = apiRequest
    this.notifierStore = notifierStore

    makeObservable(this, {
      books: observable,
      loading: observable,
      fetchBooks: action,
      createBook: action,
      updateBook: action,
      deleteBook: action,
    })
  }

  fetchBooks = async () => {
    this.loading = true
    try {
      const response = await this.apiRequest.get('/books/')
      runInAction(() => {
        this.books = response.results.map((book: IBook) => BookFactory.build(book))
      })
    } catch (error) {
      this.notifierStore.error('Failed to load books.')
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  createBook = async (data: IBookInput): Promise<boolean> => {
    try {
      const created = await this.apiRequest.post('/books/', data)
      runInAction(() => {
        this.books.push(BookFactory.build(created))
      })
      this.notifierStore.success(`"${created.title}" added.`)
      return true
    } catch (error) {
      this.notifierStore.error(this.extractError(error))
      return false
    }
  }

  updateBook = async (id: number, data: Partial<IBookInput>): Promise<boolean> => {
    try {
      const updated = await this.apiRequest.patch(`/books/${id}/`, data)
      runInAction(() => {
        this.books = this.books.map((book) => (
          book.id === id ? BookFactory.build(updated) : book
        ))
      })
      this.notifierStore.success(`"${updated.title}" updated.`)
      return true
    } catch (error) {
      this.notifierStore.error(this.extractError(error))
      return false
    }
  }

  deleteBook = async (id: number): Promise<boolean> => {
    try {
      await this.apiRequest.delete(`/books/${id}/`)
      runInAction(() => {
        this.books = this.books.filter((book) => book.id !== id)
      })
      this.notifierStore.success('Book deleted.')
      return true
    } catch (error) {
      this.notifierStore.error(this.extractError(error))
      return false
    }
  }

  private extractError(error: unknown): string {
    if (error instanceof ApiError) {
      const { body } = error
      if (typeof body === 'string') return body
      if (body && typeof body === 'object') {
        const firstKey = Object.keys(body)[0]
        const firstValue = body[firstKey]
        return Array.isArray(firstValue) ? firstValue[0] : String(firstValue)
      }
    }
    return 'Something went wrong.'
  }
}

export default BooksStore
