const { createStore } = require('redux')
const { Set } = require('immutable')
const assert = require('assert')

const bookReducer = (state, action) => {
  if (state === undefined) {
    state = {books: new Set(), customers: new Set()}
  }
  if (action.type === 'ADD_BOOK') {
    return {books: state.books.add(action.title), customers: state.customers}
  }
  if (action.type === 'REMOVE_BOOK') {
    return {books: state.books.delete(action.title), customers: state.customers}
  }
  if (action.type === 'ADD_CUSTOMER') {
    return {books: state.books, customers: state.customers.add(action.customer)}
  }
  if (action.type === 'REMOVE_CUSTOMER') {
    return {books: state.books, customers: state.customers.delete(action.customer)}
  }
  return state
}

const store = createStore(bookReducer)

store.subscribe(() => {
  console.log('new state', store.getState())
})

store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
assert.deepStrictEqual({books: new Set().add('Война и мир, Voïna i mir'), customers: new Set()}, store.getState())

store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
assert.deepStrictEqual({books: new Set().add('Война и мир, Voïna i mir'), customers: new Set()}, store.getState())

store.dispatch({ type: 'REMOVE_BOOK', title: 'Война и мир, Voïna i mir' })
assert.deepStrictEqual({books: new Set(), customers: new Set()}, store.getState())

store.dispatch({ type: 'ADD_CUSTOMER', customer: 'Tintin' })
assert.deepStrictEqual({books: new Set(), customers: new Set().add('Tintin')}, store.getState())

store.dispatch({ type: 'REMOVE_CUSTOMER', customer: 'Tintin' })
assert.deepStrictEqual({books: new Set(), customers: new Set()}, store.getState())
