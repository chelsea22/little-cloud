import * as types from '../constants/actionTypes';

import { takeSelectedFolderFromFileId, takeSelectedFolderFromFolderId, takeSelectedFolderFromChildFolderId } from '../helpers/helpers';

const selectedFolder = (state={}, action) =>{
    switch(action.type){
        case types.SET_TREE:
            if (state._id === 'home'){
                return { ...action.tree.folder };
            }
            return state;

        case types.SELECT_FOLDER:
            return { ...action.folder };

        case types.SET_SELECTED_FOLDER:
            const { tree, id, restoreType } = action;
            return setSelectedFolder(tree.folder, id, restoreType);

        case types.ADD_TO_SELECTED_FOLDER:
            return addChildToFolder(state, action.child, action.childType);

        case types.UPDATE_SELECTED_FOLDER:
            return updateChildInFolder(state, action.child);

        case types.DELETE_FROM_SELECTED_FOLDER:
            return deleteChildFromFolder(state, action.id);

        default:
            return state;
    }
}

//set Selected Folder
const setSelectedFolder = (tree, id, type) => {
    switch(type){
        case 'file':
            return takeSelectedFolderFromFileId(tree, id) || tree;
        case 'folder':
            return takeSelectedFolderFromFolderId(tree, id) || tree;
        case 'folderChild':
            return takeSelectedFolderFromChildFolderId(tree, id) || tree;
        default:
            return tree;
    }
}

//add
const addChildToFolder = (folder, child, type) => {
    if (type === "file"){
        let copyOfFolder = { ...folder };
        const { foldersChildren, filesChildren } = copyOfFolder;

        const nextFilesChildren = [ ...filesChildren, child ];
        const nextListOfChildren = [ ...foldersChildren, ...nextFilesChildren ];
        
        copyOfFolder.filesChildren = nextFilesChildren;
        copyOfFolder.listOfChildren = nextListOfChildren;
    
        return copyOfFolder;
    } else if (type === "folder"){
        let copyOfFolder = { ...folder };
        const { foldersChildren, filesChildren } = copyOfFolder;
        
        const nextFoldersChildren = [ ...foldersChildren, child ];
        const nextListOfChildren = [ ...nextFoldersChildren, ...filesChildren ];
        
        copyOfFolder.foldersChildren = nextFoldersChildren;
        copyOfFolder.listOfChildren = nextListOfChildren;
        
        return copyOfFolder;
    } else {
        return folder;
    }
}


//update
const updateItemInList = (list, updatedItem) => {
    return list.map(item => {
        if (item._id === updatedItem._id){
            return updatedItem;
        }
        return item;
    });
}
const updateChildInFolder = (folder, child) => {
    let copyOfFolder = { ...folder };
    const { foldersChildren, filesChildren, listOfChildren } = copyOfFolder;

    copyOfFolder.foldersChildren = updateItemInList(foldersChildren, child);
    copyOfFolder.filesChildren = updateItemInList(filesChildren, child);
    copyOfFolder.listOfChildren = updateItemInList(listOfChildren, child);

    return copyOfFolder;
}

//delete 
const deleteChildFromFolder = (folder, id) =>{
    let copyOfFolder = { ...folder };
    const { foldersChildren, filesChildren, listOfChildren } = copyOfFolder;
     
    copyOfFolder.foldersChildren = foldersChildren.filter(child => child._id !== id );
    copyOfFolder.filesChildren = filesChildren.filter(child => child._id !== id );
    copyOfFolder.listOfChildren = listOfChildren.filter(child => child._id !== id );
     
    return copyOfFolder;
}

export default selectedFolder;