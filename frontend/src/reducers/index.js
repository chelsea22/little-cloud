import {combineReducers} from 'redux';

import path from './path';
import tree from './tree';
import flagFetched from './flagFetched';
import flagRestored from './flagRestored';
import listOfOpenedFolders from './listOfOpenedFolders';
import selectedFolder from './selectedFolder';

const rootReducer = combineReducers({
    path,
    tree,
    flagFetched,
    flagRestored,
    listOfOpenedFolders,
    selectedFolder
});

export default rootReducer;