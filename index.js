const { combineReducers, createStore } = require('redux')
const { Set } = require('immutable')



const bookReducer = (state, action) => {
  if (state === undefined) {
    state = { books: new Set() }
  }
  if (action.type === 'ADD_BOOK') {
    return { books: state.books.add(action.title)}
  }
  if (action.type === 'REMOVE_BOOK') {
    return { books: state.books.delete(action.title)}
  }
  return state
}

const rootReducer = combineReducers({
    bookReducer
});

const store = createStore(rootReducer)

store.subscribe(() => {
  console.log('new state', store.getState())
})


store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
store.dispatch({ type: 'ADD_BOOK', title: 'Война и мир, Voïna i mir' })
store.dispatch({ type: 'REMOVE_BOOK', title: 'Война и мир, Voïna i mir' })
