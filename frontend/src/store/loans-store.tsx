import { observable, action, runInAction, makeObservable } from 'mobx'

import ApiRequest, { ApiError } from './api-request'
import NotifierStore from './notifier-store'
import { Loan, LoanFactory, ILoan } from '../view-models/loan'

class LoansStore {
  loans: Loan[] = []

  loading: boolean = false

  private apiRequest: ApiRequest

  private notifierStore: NotifierStore

  constructor(apiRequest: ApiRequest, notifierStore: NotifierStore) {
    this.apiRequest = apiRequest
    this.notifierStore = notifierStore

    makeObservable(this, {
      loans: observable,
      loading: observable,
      fetchLoans: action,
      borrowBook: action,
      returnLoan: action,
    })
  }

  fetchLoans = async () => {
    this.loading = true
    try {
      const response = await this.apiRequest.get('/loans/')
      runInAction(() => {
        this.loans = response.results.map((loan: ILoan) => LoanFactory.build(loan))
      })
    } catch (error) {
      this.notifierStore.error('Failed to load loans.')
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  borrowBook = async (bookId: number, memberId: number): Promise<boolean> => {
    try {
      const created = await this.apiRequest.post('/loans/', { book: bookId, member: memberId })
      runInAction(() => {
        this.loans.unshift(LoanFactory.build(created))
      })
      this.notifierStore.success(`"${created.book_title}" borrowed by ${created.member_name}.`)
      return true
    } catch (error) {
      this.notifierStore.error(this.extractError(error))
      return false
    }
  }

  returnLoan = async (loanId: number): Promise<boolean> => {
    try {
      const updated = await this.apiRequest.post(`/loans/${loanId}/return_book/`)
      runInAction(() => {
        this.loans = this.loans.map((loan) => (
          loan.id === loanId ? LoanFactory.build(updated) : loan
        ))
      })
      this.notifierStore.success(`"${updated.book_title}" returned.`)
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

export default LoansStore
