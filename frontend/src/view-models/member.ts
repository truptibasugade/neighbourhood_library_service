import { observable, makeObservable } from 'mobx'

export type MemberStatus = 'active' | 'suspended'

export interface IMember {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  membership_date: string
  status: MemberStatus
  created_at: string
  updated_at: string
}

export class Member {
  id: number

  first_name: string

  last_name: string

  email: string

  phone: string

  address: string

  membership_date: string

  status: MemberStatus

  created_at: string

  updated_at: string

  constructor(data: IMember) {
    this.id = data.id
    this.first_name = data.first_name
    this.last_name = data.last_name
    this.email = data.email
    this.phone = data.phone
    this.address = data.address
    this.membership_date = data.membership_date
    this.status = data.status
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    makeObservable(this, {
      id: observable,
      first_name: observable,
      last_name: observable,
      email: observable,
      phone: observable,
      address: observable,
      membership_date: observable,
      status: observable,
      created_at: observable,
      updated_at: observable,
    })
  }
}

export class MemberFactory {
  static build(data: IMember): Member {
    return new Member(data)
  }
}

export interface IMemberInput {
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  status?: MemberStatus
}
