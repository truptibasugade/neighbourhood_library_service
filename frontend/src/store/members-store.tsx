import { observable, action, runInAction, makeObservable } from 'mobx'

import ApiRequest, { ApiError } from './api-request'
import NotifierStore from './notifier-store'
import { Member, MemberFactory, IMember, IMemberInput } from '../view-models/member'

class MembersStore {
  members: Member[] = []

  loading: boolean = false

  private apiRequest: ApiRequest

  private notifierStore: NotifierStore

  constructor(apiRequest: ApiRequest, notifierStore: NotifierStore) {
    this.apiRequest = apiRequest
    this.notifierStore = notifierStore

    makeObservable(this, {
      members: observable,
      loading: observable,
      fetchMembers: action,
      createMember: action,
      updateMember: action,
      deleteMember: action,
    })
  }

  fetchMembers = async () => {
    this.loading = true
    try {
      const response = await this.apiRequest.get('/members/')
      runInAction(() => {
        this.members = response.results.map((member: IMember) => MemberFactory.build(member))
      })
    } catch (error) {
      this.notifierStore.error('Failed to load members.')
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  createMember = async (data: IMemberInput): Promise<boolean> => {
    try {
      const created = await this.apiRequest.post('/members/', data)
      runInAction(() => {
        this.members.push(MemberFactory.build(created))
      })
      this.notifierStore.success(`"${created.first_name} ${created.last_name}" added.`)
      return true
    } catch (error) {
      this.notifierStore.error(this.extractError(error))
      return false
    }
  }

  updateMember = async (id: number, data: Partial<IMemberInput>): Promise<boolean> => {
    try {
      const updated = await this.apiRequest.patch(`/members/${id}/`, data)
      runInAction(() => {
        this.members = this.members.map((member) => (
          member.id === id ? MemberFactory.build(updated) : member
        ))
      })
      this.notifierStore.success(`"${updated.first_name} ${updated.last_name}" updated.`)
      return true
    } catch (error) {
      this.notifierStore.error(this.extractError(error))
      return false
    }
  }

  deleteMember = async (id: number): Promise<boolean> => {
    try {
      await this.apiRequest.delete(`/members/${id}/`)
      runInAction(() => {
        this.members = this.members.filter((member) => member.id !== id)
      })
      this.notifierStore.success('Member deleted.')
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

export default MembersStore
