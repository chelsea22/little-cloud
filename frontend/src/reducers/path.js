import * as types from '../constants/actionTypes';

import { definePath } from '../helpers/helpers';

const path = (state=[], action) =>{
    switch(action.type){
        case types.SELECT_FOLDER:
            if (action.path) {
                const nextState = JSON.stringify(action.path);
                const currentState = JSON.stringify(state);
                if (nextState === currentState) {
                    return state;
                }
            }
            return [ ...action.path ];

        case types.SET_TREE:
            if (state[0]._id !== 'home') { 
                return state;
            } else {
                let rootNode = { ...state[0] };
                rootNode._id = action.tree.folder._id;
                return [ rootNode ];
            }

        case types.SET_PATH:
            if (action.tree.folder && action.folder){
                return definePath(action.tree.folder, action.folder) || state;
            }
            return state;
            
        default:
            return state;
    }
}



export default path;