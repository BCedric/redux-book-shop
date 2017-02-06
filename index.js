const { createStore } = require('redux')

const store = createStore((state, action) => {
  if (state === undefined) {
    state = { books: [] }
  }

  if (action.type === 'ADD_BOOK') {
    return Object.assign({}, {
      books: [ ...state.books, action.title ]
    })
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
store.dispatch({ type: 'REMOVE_BOOK', title: 'Война и мир, Voïna i mir' })
