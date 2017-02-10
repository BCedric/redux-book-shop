const assert = require('assert')
const { combineReducers, createStore } = require('redux')
const { createSelector } = require('reselect')
const { Map, Set } = require('immutable')
const { mapValues } = require('lodash')

// ===================================================================

function combineActionHandlers (initialState, handlers) {
  return function reducer (state = initialState, action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action.payload)
    }
    return state
  }
}

function createActionCreator (type, payloadCreator) {
  function actionCreator (...args) {
    return {
      type,
      payload: payloadCreator(...args)
    }
  }
  actionCreator.toString = () => type

  return actionCreator
}

// ===================================================================

const addBook = createActionCreator(
  'ADD_BOOK',
  (isbn, title) => ({ isbn, title })
)

const removeBook = createActionCreator(
  'REMOVE_BOOK',
  isbn => ({ isbn })
)

const bookReducer = combineActionHandlers(Map(), {
  [addBook]: (state, { isbn, title }) => state.set(isbn, Map({ title })),
  [removeBook]: (state, { isbn }) => state.delete(isbn)
})

const getBooks = state => state.books

const getBookByISBN = createSelector(
  getBooks,
  (_, isbn) => isbn,
  (books, isbn) => books.get(isbn)
)

// -------------------------------------------------------------------

const addCustomer = createActionCreator(
  'ADD_CUSTOMER',
  customer => ({ customer })
)

const removeCustomer = createActionCreator(
  'REMOVE_CUSTOMER',
  customer => ({ customer })
)

const customerReducer = combineActionHandlers(Set(), {
  [addCustomer]: (state, { customer }) => state.add(customer),
  [removeCustomer]: (state, { customer }) => state.delete(customer)
})

const store = createStore(combineReducers({
  books: bookReducer,
  customers: customerReducer
}))

// ===================================================================

const assertStore = obj => {
  assert.deepStrictEqual(obj, mapValues(store.getState(), value => value.toJS()))
}

store.dispatch(addBook('978-2020476966', 'Война и мир, Voïna i mir'))
assertStore({ books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' } }, customers: [] })

store.dispatch(addBook('978-2020476967', 'azert'))
assertStore({ books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' }, '978-2020476967': { title: 'azert' } }, customers: [] })

assert.deepStrictEqual({ title: 'azert' }, getBookByISBN(store.getState(), '978-2020476967').toJS())

store.dispatch(removeBook('978-2020476967'))
store.dispatch(removeBook('978-2020476966'))
assertStore({ books: {}, customers: [] })

store.dispatch(addCustomer('Tintin'))
assertStore({ books: {}, customers: [ 'Tintin' ] })

store.dispatch(removeCustomer('Tintin'))
assertStore({ books: {}, customers: [] })
