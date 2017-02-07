const { createStore } = require('redux')
const { Set } = require('immutable')

const store = createStore((state, action) => {
  if (state === undefined) {
    state = { books: new Set() }
  }

  if (action.type === 'ADD_BOOK') {
    return state = { books: state.books.add(action.title)}
  }

  if (action.type === 'REMOVE_BOOK') {
    throw new Error('not implemented')
  }

  return state
})

store.subscribe(() => {
  console.log('new state', store.getState())
})


store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
//store.dispatch({ type: 'REMOVE_BOOK', title: 'Война и мир, Voïna i mir' })
