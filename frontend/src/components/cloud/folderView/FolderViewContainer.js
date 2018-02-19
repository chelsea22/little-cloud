import React from 'react';

import FolderView from './FolderView';

import { takeSelectedFolderFromPath } from '../../../helpers/helpers';

class FolderViewContainer extends React.Component{
    render() {
        const { tree, path, selectFolder, deleteFile, deleteFolder } = this.props;
        const upperPath = (path.length > 1) ? path.slice(0,path.length-1) : path;
        const parentFolder =  takeSelectedFolderFromPath(tree, upperPath);
        const selectedFolder = takeSelectedFolderFromPath(tree, path);

        return (
            <FolderView 
                path = {path}
                parentFolder = {parentFolder}
                selectedFolder = {selectedFolder}
                selectFolder = {selectFolder}
                deleteFile = {deleteFile}
                deleteFolder = {deleteFolder}
            />
        );
    }
}

export default FolderViewContainer;
