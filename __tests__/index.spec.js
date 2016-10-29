/* global describe, test, expect, jest, beforeEach */

import configureMockStore from 'redux-mock-store'
import createNylas, { actions, SET_TOKEN, CLEAR_TOKEN, NYLAS_API } from '../src'

const nylas = createNylas()
const mockStore = configureMockStore([nylas])

describe('actions', () => {
  test('setToken', () => {
    const action = actions.setToken('abc123')
    expect(action.type).toBe(SET_TOKEN)
    expect(action.token).toBe('abc123')
  })
  test('clearToken', () => {
    const action = actions.clearToken()
    expect(action.type).toBe(CLEAR_TOKEN)
    expect(action.token).toBe(null)
  })
})

describe('middleware', () => {
  const REQUEST = 'REQUEST'
  const SUCCESS = 'SUCCESS'
  const ERROR = 'ERROR'
  let store

  beforeEach(() => {
    store = mockStore()
  })

  test('skips actions that dont have NYLAS_API', () => {
    const action = { type: 'FOO', data: {} }

    const expectedActions = [action]

    store.dispatch(action)
    expect(store.getActions()).toEqual(expectedActions)
  })

  test('expects REQUEST, SUCCESS to be returned as actions', () => {
    fetch.mockResponse(JSON.stringify([{ id: 1 }]), { status: 200 })

    const action = {
      [NYLAS_API]: {
        endpoint: 'list',
        types: [REQUEST, SUCCESS, ERROR],
      },
    }

    const expectedActions = [
      { type: REQUEST },
      { type: SUCCESS, response: [{ id: 1 }] },
    ]

    return store.dispatch(action)
      .then(() => expect(store.getActions()).toEqual(expectedActions))
  })

  test('expects REQUEST, ERROR to be returned as actions', () => {
    fetch.mockResponse(JSON.stringify({ statusText: 'Server Error' }), { status: 404 })

    const action = {
      [NYLAS_API]: {
        endpoint: 'list',
        types: [REQUEST, SUCCESS, ERROR],
      },
    }

    const expectedActions = [
      { type: REQUEST },
      { type: ERROR, error: new Error() },
    ]

    return store.dispatch(action)
      .then(() => expect(store.getActions()).toEqual(expectedActions))
  })

  test('expects multiple endpoints to return', () => {
    fetch.mockResponse(JSON.stringify({ id: 1 }), { status: 200 })

    const action = {
      [NYLAS_API]: {
        endpoints: ['item', 'item'],
        types: [REQUEST, SUCCESS, ERROR],
      },
    }

    const expectedActions = [
      { type: REQUEST },
      { type: SUCCESS, response: [{ id: 1 }, { id: 1 }] },
    ]

    return store.dispatch(action)
      .then(() => expect(store.getActions()).toEqual(expectedActions))
  })
})
