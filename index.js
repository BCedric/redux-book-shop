const assert = require('assert')
const { combineReducers, createStore } = require('redux')
const { mapValues } = require('lodash')
const { Set, Map } = require('immutable')

function createReducer (initialState, handlers) {
  return function reducer (state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

const bookReducer = createReducer(Map(), {
  ADD_BOOK (state, action) {
    return state.set(action.isbn, Map([['title', action.title]]))
  },
  REMOVE_BOOK (state, action) {
    return state.delete(action.isbn)
  }
})

const customerReducer = createReducer(Set(), {
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

function addBook (title, isbn) {
  return {
    type: 'ADD_BOOK',
    isbn,
    title
  }
}

function removeBook (isbn) {
  return {
    type: 'REMOVE_BOOK',
    isbn
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

store.dispatch(addBook('Война и мир, Voïna i mir', '978-2020476966'))
assertStore({books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' } }, customers: []})

store.dispatch(addBook('Война и мир, Voïna i mir', '978-2020476966'))
assertStore({books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' } }, customers: []})

store.dispatch(removeBook('978-2020476966'))
assertStore({ books: {}, customers: [] })

store.dispatch(addCustomer('Tintin'))
assertStore({ books: {}, customers: ['Tintin'] })

store.dispatch(removeCustomer('Tintin'))
assertStore({ books: {}, customers: [] })
