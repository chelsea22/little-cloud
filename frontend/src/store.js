import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import rootReducer from './reducers/index';

import path from './data/path';
import tree from './data/tree';
import flagFetched from './data/flagFetched';
import flagRestored from './data/flagRestored';
import listOfOpenedFolders from './data/listOfOpenedFolders';
import selectedFolder from './data/selectedFolder';

const defaultState = {
    path,
    tree,
    flagFetched,
    flagRestored,
    listOfOpenedFolders,
    selectedFolder
};

const store = createStore(
  rootReducer,
  defaultState,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);

export default store;