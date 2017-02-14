const assert = require('assert')
const { applyMiddleware, combineReducers, createStore } = require('redux')
const { createSelector } = require('reselect')
const fs = require('fs')
const { Map, Set } = require('immutable')
const { mapValues } = require('lodash')
const thunkMiddleware = require('redux-thunk')
const createLogger = require('redux-logger')
// const fetch = require('isomorphic-fetch')

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

const receiveLogin = createActionCreator(
    'RECEIVE_LOGIN',
    (user, password, users) => ({user, password, users})
)

const logout = createActionCreator(
    'LOGOUT',
    user => ({ user })
)

const authReducer = combineActionHandlers('', {
  [receiveLogin]: (state, action) => action.users.find(u => u.login === action.user && u.password === action.password) !== undefined ? action.user : '',
  [logout]: (state, action) => null
})

function logUser (user, password) {
  return function (dispatch) {
    return fs.readFile('./users.json', 'utf8', function (err, data) {
      if (err) {
        console.log(err)
        throw err
      }
      return data
    })
      .then(response => response.json())
      .then(users =>
        dispatch(receiveLogin(user, password, users))
      )
  }
}

const loggerMiddleware = createLogger()

const store = createStore(
  combineReducers(
    {
      books: bookReducer,
      customers: customerReducer,
      auth: authReducer
    },
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware // neat middleware that logs actions
    )
  )
)

// ===================================================================

const assertStore = obj => {
  assert.deepStrictEqual(obj, mapValues(store.getState(), value => value instanceof Map || value instanceof Set ? value.toJS() : value))
}

store.dispatch(logUser('Francis', 'coucou'))
// store.dispatch(logout())

store.dispatch(addBook('978-2020476966', 'Война и мир, Voïna i mir'))
assertStore({ books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' } }, customers: [], auth: '' })

store.dispatch(addBook('978-2020476967', 'azert'))
assertStore({ books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' }, '978-2020476967': { title: 'azert' } }, customers: [], auth: '' })

assert.deepStrictEqual({ title: 'azert' }, getBookByISBN(store.getState(), '978-2020476967').toJS())

store.dispatch(removeBook('978-2020476967'))
store.dispatch(removeBook('978-2020476966'))
assertStore({ books: {}, customers: [], auth: '' })

store.dispatch(addCustomer('Tintin'))
assertStore({ books: {}, customers: [ 'Tintin' ], auth: '' })

store.dispatch(removeCustomer('Tintin'))
assertStore({ books: {}, customers: [], auth: '' })
