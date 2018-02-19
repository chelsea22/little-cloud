import React from 'react';
import './FolderView.css';

import Breadcrumbs from './breadcrumbs/Breadcrumbs';
import Options from './options/Options';
import SelectedFolderView from './selectedFolderView/SelectedFolderView';
import FoldersFilesCounter from './ffCounter/FoldersFilesCounter';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class FolderView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            optionsVisability: false
        };
    }
    handleClick = () => {
        this.setState(prevState => {
            return { optionsVisability: !prevState.optionsVisability };
        });
    }
    render() {
        const { path, parentFolder, selectedFolder, selectFolder, deleteFile, deleteFolder } = this.props;
        const { optionsVisability } = this.state;
        return (
            <div className="FolderView-container">

                <Breadcrumbs path={path} selectedFolder={selectedFolder} selectFolder={selectFolder} />

                <div className = "FolderView-float-button-container">
                    <FloatingActionButton mini={true} onClick={this.handleClick}
                        className = "FolderView-float-button"    
                    >
                        <ContentAdd />
                    </FloatingActionButton>                    
                    {this.state.optionsVisability && <Options selectedFolder = {selectedFolder} />}
                </div>

                <SelectedFolderView
                    path = {path}
                    parentFolder = {parentFolder} 
                    selectedFolder = {selectedFolder}
                    optionsVisability = {optionsVisability}
                    selectFolder = {selectFolder}
                    deleteFile = {deleteFile}
                    deleteFolder = {deleteFolder}
                />

                <FoldersFilesCounter
                    selectedFolder = {selectedFolder}
                />
        
            </div>
        );
    }
}

export default FolderView;
