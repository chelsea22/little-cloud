import * as types from '../constants/actionTypes';

const flagRestored = (state = false, action) =>{      
    switch(action.type){
        case types.RESTORING_DATA_SECOND_ROUTE:
            return true;
        case types.SET_PATH:
            return false;
        default:
            return state;
    }
}

export default flagRestored;