const assert = require('assert')
const { combineReducers, createStore } = require('redux')
const { Map, Set } = require('immutable')
const { mapValues } = require('lodash')

function createReducer (initialState, handlers) {
  return function reducer (state = initialState, action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action.payload)
    }
    return state
  }
}

const bookReducer = createReducer(Map(), {
  [addBook().type] (state, { isbn, title }) {
    return state.set(isbn, Map({ title }))
  },
  [removeBook().type] (state, { isbn }) {
    return state.delete(isbn)
  }
})

const customerReducer = createReducer(Set(), {
  [addCustomer().type] (state, { customer }) {
    return state.add(customer)
  },
  [removeCustomer().type] (state, { customer }) {
    return state.delete(customer)
  }
})

const store = createStore(combineReducers({
  books: bookReducer,
  customers: customerReducer
}))

const assertStore = obj => {
  assert.deepStrictEqual(obj, mapValues(store.getState(), value => value.toJS()))
}

function addBook (isbn = '', title = '') {
  return {
    type: 'ADD_BOOK',
    payload: {
      isbn,
      title
    }
  }
}

function removeBook (isbn = '') {
  return {
    type: 'REMOVE_BOOK',
    payload: { isbn }
  }
}

function addCustomer (customer = '') {
  return {
    type: 'ADD_CUSTOMER',
    payload: { customer }
  }
}

function removeCustomer (customer = '') {
  return {
    type: 'REMOVE_CUSTOMER',
    payload: { customer }
  }
}

store.dispatch(addBook('978-2020476966', 'Война и мир, Voïna i mir'))
assertStore({ books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' } }, customers: [] })

store.dispatch(addBook('978-2020476966', 'Война и мир, Voïna i mir'))
assertStore({ books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' } }, customers: [] })

store.dispatch(removeBook('978-2020476966'))
assertStore({ books: {}, customers: [] })

store.dispatch(addCustomer('Tintin'))
assertStore({ books: {}, customers: [ 'Tintin' ] })

store.dispatch(removeCustomer('Tintin'))
assertStore({ books: {}, customers: [] })
