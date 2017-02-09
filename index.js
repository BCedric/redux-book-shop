const assert = require('assert')
const { combineReducers, createStore } = require('redux')
const { mapValues } = require('lodash')
const { Set } = require('immutable')

function createReducer (handlers) {
  return function reducer (state = Set(), action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

const bookReducer = createReducer({
  ADD_BOOK (state, action) {
    return state.add(action.title)
  },
  REMOVE_BOOK (state, action) {
    return state.remove(action.title)
  }
})

const customerReducer = createReducer({
  ADD_CUSTOMER (state, action) {
    return state.add(action.customer)
  },
  REMOVE_CUSTOMER (state, action) {
    return state.delete(action.customer)
  }
})

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

store.dispatch(addBook('Война и мир, Voïna i mir'))
assertStore({ books: ['Война и мир, Voïna i mir'], customers: [] })

store.dispatch(addBook('Война и мир, Voïna i mir'))
assertStore({ books: ['Война и мир, Voïna i mir'], customers: [] })

store.dispatch(removeBook('Война и мир, Voïna i mir'))
assertStore({ books: [], customers: [] })

store.dispatch(addCustomer('Tintin'))
assertStore({ books: [], customers: ['Tintin'] })

store.dispatch(removeCustomer('Tintin'))
assertStore({ books: [], customers: [] })
