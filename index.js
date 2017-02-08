const assert = require('assert')
const { createStore, combineReducers } = require('redux')
const { Set } = require('immutable')
const { mapValues } = require('lodash')

const bookReducer = (state, action) => {
  if (state === undefined) {
    state = Set()
  }
  if (action.type === 'ADD_BOOK') {
    return state.add(action.title)
  }
  if (action.type === 'REMOVE_BOOK') {
    return state.delete(action.title)
  }
  return state
}

const customerReducer = (state, action) => {
  if (state === undefined) {
    state = Set()
  }
  if (action.type === 'ADD_CUSTOMER') {
    return state.add(action.customer)
  }
  if (action.type === 'REMOVE_CUSTOMER') {
    return state.delete(action.customer)
  }
  return state
}

const rootReducer = combineReducers({
  books: bookReducer,
  customers: customerReducer
})

const store = createStore(rootReducer)

const assertStore = obj => {
  assert.deepStrictEqual(obj, mapValues(store.getState(), value => value.toJS()))
}

store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
assertStore({ books: ['Война и мир, Voïna i mir'], customers: [] })

store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
assertStore({ books: ['Война и мир, Voïna i mir'], customers: [] })

store.dispatch({ type: 'REMOVE_BOOK', title: 'Война и мир, Voïna i mir' })
assertStore({ books: [], customers: [] })

store.dispatch({ type: 'ADD_CUSTOMER', customer: 'Tintin' })
assertStore({ books: [], customers: ['Tintin'] })

store.dispatch({ type: 'REMOVE_CUSTOMER', customer: 'Tintin' })
assertStore({ books: [], customers: [] })
