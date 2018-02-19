import React from 'react';

import { connect } from 'react-redux';
import { updateFile, restoreSelectedFolder } from '../../../actions/actionCreators';

import { Redirect } from 'react-router-dom';

import FormPage from './FormPage';

class EditFile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false
        };
    }
    componentDidMount(){
        if (!this.props.flagFetched) {
            this.props.restoreSelectedFolder(this.props.match.params._id, 'file');
        }
    }
    saveData = ({ id, name }) => {
        return this.props.updateFile({ id, name })
            .then(() => { this.setState({ redirect: true })}
        );
    }
    render(){
        const nameValue = this.props.match.params.name || "";
        return(
            <div>
                {this.state.redirect 
                    ? <Redirect to="/" /> 
                    : <FormPage
                        nameValue={nameValue}
                        confirmBtnLable={"Save"}
                        floatingLableText={"File Name"}
                        headerText={"Edit File Name"}
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

export default connect(mapStateToProps, { updateFile, restoreSelectedFolder })(EditFile);