import React from 'react';
import { Link } from 'react-router-dom';
import './TabRow.css';

import AlertDelete from './AlertDelete';

import EditIcon from 'react-material-icons/icons/image/edit';
import ActionDelete from 'react-material-icons/icons/action/delete';

class FolderTabRow  extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
            deleteAlertVisability: false,
            newPath: this.setNewPath(this.props.path, this.props.viewNode), 
        };
    }
    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.optionsVisability){
            this.setState({ 
                deleteAlertVisability: false,
                newPath: this.setNewPath(nextProps.path, nextProps.viewNode),
            });
        } else {
            this.setState({ 
                newPath: this.setNewPath(nextProps.path, nextProps.viewNode),
            });
        }       
    }
    setNewPath = (path, node) => {
        const { _id, name } = node;
        let newNode = { _id: _id, name: name };
        return [ ...path, newNode ];
    }  
    handleClick = () => {            
        this.props.selectFolder(this.state.newPath, this.props.viewNode);
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
        return this.props.deleteFolder({ 
            parentId: this.props.selectedFolder._id,
            id,
            path: this.props.path
        });
    }
    render(){
        const { viewNode, optionsVisability } = this.props;
        return(
            <div className="TabRow-container">
                <div className="TabRow-data TabRow-data-folder" >

                    <div className="TabRow-data-name" onClick={this.handleClick}>
                        {viewNode.name}
                    </div>

                    {optionsVisability 
                        && <div className="TabRow-data-icon">
                            <Link to={`/edit_folder/${viewNode._id}/${viewNode.name}`}>
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

export default FolderTabRow;
