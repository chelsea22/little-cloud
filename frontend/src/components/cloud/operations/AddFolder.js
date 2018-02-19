import React from 'react';

import { connect } from 'react-redux';
import { createFolder, restoreSelectedFolder } from '../../../actions/actionCreators';

import { Redirect } from 'react-router-dom';

import FormPage from './FormPage';

class AddFolder extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false
        };
    }
    componentDidMount(){
        if (!this.props.flagFetched) {
            this.props.restoreSelectedFolder(this.props.match.params._id, 'folder');
        }
    }
    saveData = ({ id, name }) => {
        return this.props.createFolder({ id, name })
            .then(() => { this.setState({ redirect: true })}
        );
    }
    render(){
        return(
            <div>
               {this.state.redirect 
                    ? <Redirect to="/" />
                    : <FormPage
                        confirmBtnLable={"Create"}
                        floatingLableText={"Folder Name"}
                        headerText={"Create new folder"}
                        id={this.props.id}
                        saveData={this.saveData}
                    />
                }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const { match } = props;
    if (match.params._id) {
        return { 
            id: match.params._id,
            flagFetched: state.flagFetched, 
        }
    }
    return { id: null, flagFetched: null };
}

export default connect(mapStateToProps, { createFolder, restoreSelectedFolder })(AddFolder);

