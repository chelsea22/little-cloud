import * as types from '../constants/actionTypes';

const flagFetched = (state = false, action) =>{      
    switch(action.type){
        case types.FETCH_TREE:
            return true;
        case types.RESTORING_DATA_MAIN_ROUTE:
            return true;
        case types.CHANGING_DATA:
            return false;
        default:
            return state;
    }
}

export default flagFetched;