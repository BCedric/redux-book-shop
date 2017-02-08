const assert = require('assert')
const { createStore } = require('redux')
const { Map, Set } = require('immutable')

const bookReducer = (state, action) => {
  if (state === undefined) {
    state = Map({books: Set(), customers: Set()})
  }
  if (action.type === 'ADD_BOOK') {
    return state.set('books', state.get('books').add(action.title))
  }
  if (action.type === 'REMOVE_BOOK') {
    return state.set('books', state.get('books').delete(action.title))
  }
  if (action.type === 'ADD_CUSTOMER') {
    return state.set('customers', state.get('customers').add(action.customer))
  }
  if (action.type === 'REMOVE_CUSTOMER') {
    return state.set('customers', state.get('customers').delete(action.customer))
  }
  return state
}

const store = createStore(bookReducer)

store.subscribe(() => {
  console.log('new state', store.getState())
})

const assertStore = (obj) => {
  assert.deepStrictEqual(obj, store.getState().toJS())
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
