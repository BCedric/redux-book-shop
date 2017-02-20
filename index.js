const assert = require('assert')
const fs = require('fs')
const thunkMiddleware = require('redux-thunk').default
const { applyMiddleware, combineReducers, createStore } = require('redux')
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
      payload: payloadCreator ? payloadCreator(...args) : null
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
    (user) => ({ user })
)

const logout = createActionCreator(
    'LOGOUT'
)

const authReducer = combineActionHandlers(null, {
  [receiveLogin]: (_, { user }) => user,
  [logout]: () => null
})

const logUser = (user, password) =>
  dispatch => {
    fs.readFile('./users.json', 'utf8', function (error, users) {
      if (error) {
        console.error(error)
        return
      }
      users = JSON.parse(users)

      const auth = users.find(u => u.login === user && u.password === password)
      if (auth !== undefined) {
        return dispatch(receiveLogin(user))
      }
    })
  }

const store = createStore(
  combineReducers(
    {
      books: bookReducer,
      customers: customerReducer,
      auth: authReducer
    }
  ),
  applyMiddleware(
    thunkMiddleware
  )
)

// ===================================================================

const assertStore = obj => {
  assert.deepStrictEqual(obj, mapValues(store.getState(), value => value && typeof value.toJS === 'function' ? value.toJS() : value))
}

const waitState = predicate => new Promise(resolve => {
  const unsubscribe = store.subscribe(() => {
    const state = store.getState()
    if (predicate(state)) {
      unsubscribe()
      resolve(state)
    }
  })
})

store.dispatch(logUser('Francis', 'coucou'))
waitState(state => state.auth).then(state => {
  assertStore({ books: {}, customers: [], auth: 'Francis' })
  store.dispatch(logUser('Francis', 'coucous'))
  return waitState(state => !state.auth)
}).then(state => {
  assertStore({ books: {}, customers: [], auth: null })
  console.log('ok')
}).catch(error => {
  console.error(error)
})

store.dispatch(logout())

store.dispatch(addBook('978-2020476966', 'Война и мир, Voïna i mir'))
assertStore({ books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' } }, customers: [], auth: null })

store.dispatch(addBook('978-2020476967', 'azert'))
assertStore({ books: { '978-2020476966': { title: 'Война и мир, Voïna i mir' }, '978-2020476967': { title: 'azert' } }, customers: [], auth: null })

assert.deepStrictEqual({ title: 'azert' }, getBookByISBN(store.getState(), '978-2020476967').toJS())

store.dispatch(removeBook('978-2020476967'))
store.dispatch(removeBook('978-2020476966'))
assertStore({ books: {}, customers: [], auth: null })

store.dispatch(addCustomer('Tintin'))
assertStore({ books: {}, customers: [ 'Tintin' ], auth: null })

store.dispatch(removeCustomer('Tintin'))
assertStore({ books: {}, customers: [], auth: null })
