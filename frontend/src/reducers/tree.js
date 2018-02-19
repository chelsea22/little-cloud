import * as types from '../constants/actionTypes';

const tree = (state={}, action) =>{
    switch(action.type){
        case types.SET_TREE:
            if (action.tree.folder){
                return makeTree(action.tree.folder, action.list);
            }
            return state;

        case types.OPEN_CLOSE_FOLDER:
            if (action.path.length <= 0){
                return state;
            }
            return openCloseFolderInTree(state, action.path);
            
        case types.DELETE_FROM_TREE:
            return deleteFromTree(state, action.path, action.id);
        
        default:
            return state;
    }
}
  
const openCloseFolderInTree = (treeState, pathState) => {
    let tree = { ...treeState };
    let path = [ ...pathState ];
    if (tree._id === path[0]._id){
        path.shift();
        if (path.length === 0){
            return {
                ...tree,
                isOpen: !tree.isOpen
            };
        }
        let crumb = path[0];
        return {
            ...tree,
            listOfChildren: tree.listOfChildren.map(child=>{
                if (child._id === crumb._id){
                    return openCloseFolderInTree(child, path);
                }
                return child;
            })
        };    
    }
    return tree;
}

const deleteFromTree = (treeState, pathState, id) => {
    let tree = { ...treeState };
    let path = [ ...pathState ];
    if (tree._id === path[0]._id){
        path.shift();
        if (path.length === 0){
            return {
                ...tree,
                listOfChildren: [ ...tree.listOfChildren.filter(child => child._id !== id)]
            };
        }
        let crumb = path[0];
        return {
            ...tree,
            listOfChildren: tree.listOfChildren.map(child => {
                if (child._id === crumb._id){
                    return deleteFromTree(child, path, id);
                }
                return child;
            })
        };    
    }
    return tree;
}

// creating and adding listOfChildren property to every folder in the tree, send from server
const makeTree = (treeState, listState) => {
    let folder = { ...treeState };
    let list = [ ...listState ];
    if (folder.foldersChildren && folder.filesChildren && folder.name && folder._id){
        const { foldersChildren, filesChildren } = folder;

        const nextFoldersChildren = foldersChildren.map(folder => makeTree(folder, list));
        
        folder.foldersChildren = [ ...nextFoldersChildren ];
        folder.listOfChildren = [ ...nextFoldersChildren, ...filesChildren ];
        folder.isOpen = list.includes(folder._id);

        return folder;
    }
}

export default tree;