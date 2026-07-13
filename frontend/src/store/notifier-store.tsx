import { observable, action, makeObservable } from 'mobx'

export type NotificationSeverity = 'success' | 'error' | 'info' | 'warning'

class NotifierStore {
  public open: boolean = false

  public message: string = ''

  public severity: NotificationSeverity = 'info'

  constructor() {
    makeObservable(this, {
      open: observable,
      message: observable,
      severity: observable,
      notify: action,
      success: action,
      error: action,
      close: action,
    })
  }

  notify = (message: string, severity: NotificationSeverity = 'info') => {
    this.message = message
    this.severity = severity
    this.open = true
  }

  success = (message: string) => this.notify(message, 'success')

  error = (message: string) => this.notify(message, 'error')

  close = () => {
    this.open = false
  }
}

export default NotifierStore
