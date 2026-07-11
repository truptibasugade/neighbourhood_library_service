import { apiBaseUrl } from '../env-config'

export class ApiError extends Error {
  status: number

  body: any

  constructor(status: number, body: any) {
    super(typeof body === 'string' ? body : JSON.stringify(body))
    this.status = status
    this.body = body
  }
}

class ApiRequest {
  private endpoint: string

  constructor(endpoint: string = apiBaseUrl) {
    this.endpoint = endpoint
  }

  async query(method: string, path: string, body?: object) {
    const response = await fetch(`${this.endpoint}${path}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const text = await response.text()
    const json = text ? JSON.parse(text) : null

    if (!response.ok) {
      throw new ApiError(response.status, json)
    }

    return json
  }

  get(path: string) {
    return this.query('GET', path)
  }

  post(path: string, body?: object) {
    return this.query('POST', path, body)
  }

  patch(path: string, body?: object) {
    return this.query('PATCH', path, body)
  }

  delete(path: string) {
    return this.query('DELETE', path)
  }
}

export default ApiRequest
