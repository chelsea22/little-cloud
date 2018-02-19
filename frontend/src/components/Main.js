import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Cloud from './cloud/Cloud';

function mapStateToProps(state){
    return {
        path: state.path,
        tree: state.tree,
        flagFetched: state.flagFetched,
        flagRestored: state.flagRestored,
        listOfOpenedFolders: state.listOfOpenedFolders,
        selectedFolder: state.selectedFolder 
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actionCreators, dispatch);
}


const Main = connect(mapStateToProps, mapDispatchToProps)(Cloud);

export default Main;