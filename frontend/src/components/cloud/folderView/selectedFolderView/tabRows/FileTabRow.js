import React from 'react';
import './TabRow.css';

import { Link, Redirect } from 'react-router-dom';

import AlertDelete from './AlertDelete';

import EditIcon from 'react-material-icons/icons/image/edit';
import ActionDelete from 'react-material-icons/icons/action/delete';

class FileTabRow extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            deleteAlertVisability: false,
            redirect: false,
        };
    }
    toggleAlert = () => {
        this.setState(prevState => { return ({ deleteAlertVisability: !prevState.deleteAlertVisability }); });
    }
    handleClickOnDeleteIcon = () => {
        this.toggleAlert();
    }
    handleCancel = () => {
        this.toggleAlert();
    }
    handleDelete = (id) =>{
        return this.props.deleteFile({ 
            parentId: this.props.selectedFolder._id,
            id,
            path: this.props.path
        });
    }
    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.optionsVisability){
            this.setState({ deleteAlertVisability: false });
        }
    }
    openFile = () => {
        this.setState({ redirect: true });
    }
    render(){
        const { viewNode, optionsVisability } = this.props;
        return(
            <div className="TabRow-container">
                <div className="TabRow-data TabRow-data-file">

                    <div className="TabRow-data-name" onClick={this.openFile}>
                        <span style={{color: 'rgb(85, 26, 139)'}}>{viewNode.name}</span>
                    </div>
                    {this.state.redirect && <Redirect to={`/view/files/${viewNode._id}`} />}
                    
                    {optionsVisability 
                        && <div className="TabRow-data-icon">
                            <Link to={`/edit_file/${viewNode._id}/${viewNode.name}`}>
                                <EditIcon/>
                            </Link>
                        </div>
                    }
                    {optionsVisability 
                        && <div className="TabRow-data-icon" >
                            <ActionDelete onClick={this.handleClickOnDeleteIcon}/>
                        </div> 
                    }
                </div>

                {optionsVisability && this.state.deleteAlertVisability &&
                    <AlertDelete  viewNode={viewNode}
                        handleCancel={this.handleCancel}
                        handleDelete={this.handleDelete}
                    />
                }
            </div>
        )
    }
}

export default FileTabRow;
