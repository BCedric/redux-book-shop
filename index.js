const assert = require('assert')
const { createStore } = require('redux')
const { Map, Set } = require('immutable')

const bookReducer = (state, action) => {
  if (state === undefined) {
    state = Map()
      .set('books', Set())
      .set('customers', Set())
  }
  if (action.type === 'ADD_BOOK') {
    return Map()
      .set('books', state.get('books').add(action.title))
      .set('customers', state.get('customers'))
  }
  if (action.type === 'REMOVE_BOOK') {
    return Map()
      .set('books', state.get('books').delete(action.title))
      .set('customers', state.get('customers'))
  }
  if (action.type === 'ADD_CUSTOMER') {
    return Map()
      .set('customers', state.get('customers').add(action.customer))
      .set('books', state.get('books'))
  }
  if (action.type === 'REMOVE_CUSTOMER') {
    return Map()
      .set('customers', state.get('customers').delete(action.customer))
      .set('books', state.get('books'))
  }
  return state
}

const store = createStore(bookReducer)

store.subscribe(() => {
  console.log('new state', store.getState())
})

store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
let map = Map()
  .set('books', Set().add('Война и мир, Voïna i mir'))
  .set('customers', Set())
assert.deepStrictEqual(map.toJS(), store.getState().toJS())

store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
map = Map()
  .set('books', Set().add('Война и мир, Voïna i mir'))
  .set('customers', Set())
assert.deepStrictEqual(map.toJS(), store.getState().toJS())

store.dispatch({ type: 'REMOVE_BOOK', title: 'Война и мир, Voïna i mir' })
map = Map()
  .set('books', Set())
  .set('customers', Set())
assert.deepStrictEqual(map.toJS(), store.getState().toJS())

store.dispatch({ type: 'ADD_CUSTOMER', customer: 'Tintin' })
map = Map()
  .set('books', Set())
  .set('customers', Set().add('Tintin'))
assert.deepStrictEqual(map.toJS(), store.getState().toJS())

store.dispatch({ type: 'REMOVE_CUSTOMER', customer: 'Tintin' })
map = Map()
  .set('books', Set())
  .set('customers', Set())
assert.deepStrictEqual(map.toJS(), store.getState().toJS())
