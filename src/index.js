const tokenKey = 'access_token'
const defaults = {
  baseURL: 'https://api.nylas.com/',
  method: 'GET',
}

export const NYLAS_API = 'NYLAS/API'
export const SET_TOKEN = 'NYLAS/SET_TOKEN'
export const CLEAR_TOKEN = 'NYLAS/CLEAR_TOKEN'

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) { return response }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

function parseJSON(response) { return response.json() }

function api({ endpoint, method, token, body, options }) {
  return fetch(options.baseURL + endpoint, {
    method: method || options.method,
    headers: options.headers || { 'Authorization': `Bearer ${ token }` },
    body: body ? JSON.stringify(body) : null,
  })
  .then(checkStatus)
  .then(parseJSON)
}

export default (opts = {}) => () => next => (action) => {
  const apiAction = action[NYLAS_API]
  if (typeof apiAction === 'undefined') { return next(action) }

  const options = { ...defaults, ...opts }
  const token = localStorage.getItem(tokenKey) || null
  const { endpoint, endpoints, types, method, body, model } = apiAction
  const [REQUEST, SUCCESS, ERROR] = types

  next({ type: REQUEST })

  const apiCall = endpoints ? (
    Promise.all(endpoints.map(singleEndpoint =>
      api({ endpoint: singleEndpoint, method, options, token, body })
    ))
  ) : (
    api({ endpoint, method, options, token, body })
  )

  return apiCall
    .then(response => next({ type: SUCCESS, [model || 'response']: response }))
    .catch(error => next({ type: ERROR, error }))
}

export const actions = {
  setToken: (token) => {
    localStorage.setItem(tokenKey, token)
    return ({ type: SET_TOKEN, token })
  },
  clearToken: () => {
    localStorage.removeItem(tokenKey)
    return ({ type: CLEAR_TOKEN, token: null })
  },
}
