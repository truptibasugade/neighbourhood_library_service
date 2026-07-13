import { observable, makeObservable } from 'mobx'

export type LoanStatus = 'borrowed' | 'returned'

export interface ILoan {
  id: number
  book: number
  book_title: string
  member: number
  member_name: string
  borrowed_at: string
  due_date: string
  returned_at: string | null
  status: LoanStatus
}

export class Loan {
  id: number

  book: number

  book_title: string

  member: number

  member_name: string

  borrowed_at: string

  due_date: string

  returned_at: string | null

  status: LoanStatus

  constructor(data: ILoan) {
    this.id = data.id
    this.book = data.book
    this.book_title = data.book_title
    this.member = data.member
    this.member_name = data.member_name
    this.borrowed_at = data.borrowed_at
    this.due_date = data.due_date
    this.returned_at = data.returned_at
    this.status = data.status

    makeObservable(this, {
      id: observable,
      book: observable,
      book_title: observable,
      member: observable,
      member_name: observable,
      borrowed_at: observable,
      due_date: observable,
      returned_at: observable,
      status: observable,
    })
  }
}

export class LoanFactory {
  static build(data: ILoan): Loan {
    return new Loan(data)
  }
}
