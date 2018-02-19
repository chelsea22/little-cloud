import React from 'react';
import './Cloud.css';

import Tree from './tree/Tree';
import FolderViewContainer from './folderView/FolderViewContainer';

export default class Cloud extends React.PureComponent {
    componentDidMount(){
        if (this.props.flagRestored){
            this.props.restoreTree(this.props.selectedFolder, this.props.listOfOpenedFolders);
        } else if (!this.props.flagFetched){ 
            this.props.fetchTree(this.props.listOfOpenedFolders);
        }     
    }
    render() {
        const { tree, path, selectFolder, openCloseFolder, deleteFile, deleteFolder } = this.props;
        return (
            <div className="Cloud-container">
                <div className="App-main-content Cloud-tree">
                    <Tree 
                        tree={tree}
                        selectFolder={selectFolder}
                        openCloseFolder={openCloseFolder}
                    />
                </div>
                <div className="App-main-content Cloud-view">
                    <FolderViewContainer 
                        tree={tree}
                        path={path}
                        selectFolder={selectFolder}
                        deleteFile={deleteFile}
                        deleteFolder={deleteFolder}
                    />
                </div>
            </div>
        );
    }
}