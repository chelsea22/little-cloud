//find selectedFolder in tree when path given
export const takeSelectedFolderFromPath = (tree, path) => {
    let copyOfTree = { ...tree };
    let copyOfPath = [ ...path ];   
    if (copyOfPath.length > 0){
        if (copyOfTree._id === copyOfPath[0]._id){
            copyOfPath.shift();
            if (copyOfPath.length === 0){
                return copyOfTree;
            }
            let crumb = copyOfPath[0];
            let folder = copyOfTree.listOfChildren.filter(child => child._id === crumb._id)[0];
            return takeSelectedFolderFromPath(folder, copyOfPath);
        }
    }
    return copyOfTree;
}

//find selectedFolder in tree when child file id given
export const takeSelectedFolderFromFileId = (tree, id) => {
    let copyOfTree = { ...tree };
    if (copyOfTree.foldersChildren && copyOfTree.filesChildren){

        let flagFound = false;
        let resultFolder;

        const { foldersChildren, filesChildren } = copyOfTree;

        copyOfTree.listOfChildren = [ ...foldersChildren, ...filesChildren ];
        copyOfTree.isOpen = false;

        const result = filesChildren.filter(file => file._id === id);

        if (result.length > 0){
            flagFound = true;
            resultFolder = copyOfTree;

        } else if (foldersChildren.length > 0) {
            for (let folder of foldersChildren){
                const take = takeSelectedFolderFromFileId(folder, id);
                if (take) {
                    return take;
                }
            }
        }

        if (flagFound) {
            return resultFolder;
        }

    } else {
        return null;
    }
}

//find selectedFolder in tree when child folder id given
export const takeSelectedFolderFromChildFolderId = (tree, id) => {
    let copyOfTree = { ...tree };
    if (copyOfTree.foldersChildren && copyOfTree.filesChildren){

        let flagFound = false;
        let resultFolder;

        const { foldersChildren, filesChildren } = copyOfTree;
        
        copyOfTree.listOfChildren = [ ...foldersChildren, ...filesChildren ];
        copyOfTree.isOpen = false;

        const result = foldersChildren.filter(folder => folder._id === id);

        if (result.length > 0){
            flagFound = true;
            resultFolder = copyOfTree;

        } else if (foldersChildren.length > 0) {
            for (let folder of foldersChildren){
                const take = takeSelectedFolderFromChildFolderId(folder, id);
                if (take) {
                    return take;
                }
            }
        }

        if (flagFound) {
            return resultFolder;
        }

    } else {
        return null;
    }
}

//find selectedFolder in tree when current selectedFolder id given
export const takeSelectedFolderFromFolderId = (tree, id) => {
    let copyOfTree = { ...tree }; 
    if (copyOfTree.foldersChildren && copyOfTree.filesChildren){

        let flagFound = false;
        let resultFolder;

        const { foldersChildren, filesChildren } = copyOfTree;
        
        copyOfTree.listOfChildren = [ ...foldersChildren, ...filesChildren ];
        copyOfTree.isOpen = false;

        const result = foldersChildren.filter(folder => folder._id === id);

        if (result.length > 0){
            flagFound = true;
            resultFolder = result[0];

        } else if (foldersChildren.length > 0) {
            for (let folder of foldersChildren){
                const take = takeSelectedFolderFromFolderId(folder, id);
                if (take) {
                    return take;
                }
            }
        }

        if (flagFound) {
            return resultFolder;
        }

    } else {
        return null;
    }
}

//define path to selectedFolder in tree
export const definePath = (tree, folder) => {
    let copyOfTree = { ...tree };
    let copyOfFolder = { ...folder };

    if ( copyOfTree.foldersChildren ){

        let flagFound = false;
        let path = [ { name: copyOfTree.name, _id: copyOfTree._id }  ];

        const { foldersChildren } = copyOfTree;

        const result = foldersChildren.filter(folder => folder._id === copyOfFolder._id);
        if (result.length > 0){
            flagFound = true;
            const crumb = { name: copyOfFolder.name, _id: copyOfFolder._id };
            path = [ ...path, crumb ];
              
        } else if (foldersChildren.length > 0) {
            for (let folder of foldersChildren){
                const define = definePath(folder, copyOfFolder);
                if (define) {
                    return [ ...path, ...define];
                }
            }
        }

        if (flagFound) {
            return path;
        }
    }
}
