import * as types from '../constants/actionTypes';

const listOfOpenedFolders = (state=[], action) =>{    
    switch(action.type){
        case types.OPEN_CLOSE_FOLDER:
            if (state.includes(action.id)){
                return[ ...state.filter(item => item !== action.id) ];
            }
            return [ ...state, action.id ];
        default:
            return state;
    }
}

export default listOfOpenedFolders;