import { HttpStatusCode, HttpVerbs } from "@/types/http"
import { FetchResponse, Payload, RequestError } from "@/types/utils"

const API_URL = import.meta.env.VITE_API_URL

export const request = async<PayloadType extends Payload, DataType = unknown>(
  endpoint: string,
  method: HttpVerbs,
  data?: DataType | Record<string, string>
): Promise<FetchResponse<PayloadType>> => {
  let response: Response | null = null
  let url = ''
  const headers = new Headers()

  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const sharedFetchOptions: RequestInit = {
    mode: 'cors',
    credentials: 'include'
  }

  try {
    if (method === 'GET') {
      const queryString = new URLSearchParams(data as Record<string, string>).toString()
      url = url.concat(API_URL, endpoint, '?', queryString)
    } else {
      const csrfToken = getCsrfTokenValue()
      url = url.concat(API_URL, endpoint)
      headers.append('X-Csrf-Token', csrfToken ?? '')
      sharedFetchOptions.body = data ? JSON.stringify(data) : undefined
    }

    response = await fetch(url, {
      ...sharedFetchOptions,
      method,
      headers
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    throw {
      message: 'Server error occurred.',
      code: HttpStatusCode.InternalServerError
    } as RequestError
  }

  const responseJson = await response.json()
  const meta: FetchResponse<PayloadType>['meta'] = responseJson['meta'] ?? {}

  if (!response.ok) {
    throw {
      message: meta.message,
      code: response.status
    } as RequestError
  }

  return {
    payload: responseJson['payload'],
    meta: {
      code: response.status,
      ...meta
    }
  } satisfies FetchResponse<PayloadType>
}

export const getCsrfTokenValue = () => {
  if (document.cookie) {
    for (const cookie of document.cookie.split(', ')) {
      const [name, value] = cookie.split('=')

      if (name === import.meta.env.VITE_CSRF_TOKEN_NAME)
        return value
    }
  }

  return undefined
}