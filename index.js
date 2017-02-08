const assert = require('assert')
const { combineReducers, createStore } = require('redux')
const { mapValues } = require('lodash')
const { Set } = require('immutable')

const bookReducer = (state = Set(), action) => {
  if (action.type === 'ADD_BOOK') {
    return state.add(action.title)
  }
  if (action.type === 'REMOVE_BOOK') {
    return state.delete(action.title)
  }
  return state
}

const customerReducer = (state = Set(), action) => {
  if (action.type === 'ADD_CUSTOMER') {
    return state.add(action.customer)
  }
  if (action.type === 'REMOVE_CUSTOMER') {
    return state.delete(action.customer)
  }
  return state
}

const store = createStore(combineReducers({
  books: bookReducer,
  customers: customerReducer
}))

const assertStore = obj => {
  assert.deepStrictEqual(obj, mapValues(store.getState(), value => value.toJS()))
}

function addBook (title) {
  return {
    type: 'ADD_BOOK',
    title
  }
}

function removeBook (title) {
  return {
    type: 'REMOVE_BOOK',
    title
  }
}

function addCustomer (customer) {
  return {
    type: 'ADD_CUSTOMER',
    customer
  }
}

function removeCustomer (customer) {
  return {
    type: 'REMOVE_CUSTOMER',
    customer
  }
}

const addBookAction = (title) => store.dispatch(addBook(title))
const removeBookAction = (title) => store.dispatch(removeBook(title))
const addCustomerAction = (customer) => store.dispatch(addCustomer(customer))
const removeCustomerAction = (customer) => store.dispatch(removeCustomer(customer))

addBookAction('Война и мир, Voïna i mir')
assertStore({ books: ['Война и мир, Voïna i mir'], customers: [] })

addBookAction('Война и мир, Voïna i mir')
assertStore({ books: ['Война и мир, Voïna i mir'], customers: [] })

removeBookAction('Война и мир, Voïna i mir')
assertStore({ books: [], customers: [] })

addCustomerAction('Tintin')
assertStore({ books: [], customers: ['Tintin'] })

removeCustomerAction('Tintin')
assertStore({ books: [], customers: [] })
