const assert = require('assert')
const Immutable = require('immutable')

const { createStore } = require('redux')
const { Map, Set } = require('immutable')

const bookReducer = (state, action) => {
  if (state === undefined) {
    state = Map({books: Set(), customers: Set()})
  }
  if (action.type === 'ADD_BOOK') {
    return Map({books: state.get('books').add(action.title), customers: state.get('customers')})
  }
  if (action.type === 'REMOVE_BOOK') {
    return Map({books: state.get('books').delete(action.title), customers: state.get('customers')})
  }
  if (action.type === 'ADD_CUSTOMER') {
    return Map({books: state.get('books'), customers: state.get('customers').add(action.customer)})
  }
  if (action.type === 'REMOVE_CUSTOMER') {
    return Map({books: state.get('books'), customers: state.get('customers').delete(action.customer)})
  }
  return state
}

const store = createStore(bookReducer)

store.subscribe(() => {
  console.log('new state', store.getState())
})

store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
assert(Immutable.is(Map({books: Set().add('Война и мир, Voïna i mir'), customers: Set()}), store.getState()) === true)

store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
assert(Immutable.is(Map({books: Set().add('Война и мир, Voïna i mir'), customers: Set()}), store.getState()) === true)

store.dispatch({ type: 'REMOVE_BOOK', title: 'Война и мир, Voïna i mir' })
assert(Immutable.is(Map({books: Set(), customers: Set()}), store.getState()) === true)

store.dispatch({ type: 'ADD_CUSTOMER', customer: 'Tintin' })
assert(Immutable.is(Map({books: Set(), customers: Set().add('Tintin')}), store.getState()) === true)

store.dispatch({ type: 'REMOVE_CUSTOMER', customer: 'Tintin' })
assert(Immutable.is(Map({books: Set(), customers: Set()}), store.getState()) === true)
