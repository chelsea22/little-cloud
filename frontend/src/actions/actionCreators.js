import * as types from '../constants/actionTypes';

//  Normal Flow

//fetch tree
export const fetchTree = (list) =>{
    return async (dispatch) => {
        dispatch({
            type: types.FETCH_TREE
        });
        try {
            const response = await fetch('/root_folder_tree');
            const data = await response.json();
            dispatch(setTree(data, list));
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }  
    }
}

//set tree
export function setTree(tree, list=[]){
    return{
        type: types.SET_TREE,
        tree,
        list
    }
}

//open close folder
export function openCloseFolder(path, id){
    return{
        type: types.OPEN_CLOSE_FOLDER,
        path,
        id
    }
}

//select folder
export function selectFolder(path, folder){
    return{
        type: types.SELECT_FOLDER,
        path,
        folder
    }
}

//set flag Fetched to false    createFolder() updateFolder() saveFile() updateFile()
export function changingData(){
    return{
        type: types.CHANGING_DATA,
    }
}

//delete from tree    deleteFolder() deleteFile()
export function deleteFromTree(path, id){
    return{
        type: types.DELETE_FROM_TREE,
        path,
        id
    }
}



//  Restored Flow

//restore tree    Main route
export const restoreTree = (folder, list) => {
    return async (dispatch) => {
        dispatch({
            type: types.RESTORING_DATA_MAIN_ROUTE
        });
        try {
            const response = await fetch('/root_folder_tree');
            const data = await response.json();
            dispatch(setTree(data, list));
            dispatch(setPath(data, folder));
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }  
    }

}

//set path
export const setPath = (tree, folder) => {
    return{
        type: types.SET_PATH,
        tree,
        folder,
    }
}

//restore selected folder    Second route
export const restoreSelectedFolder = (id, restoreType) => {
    return async (dispatch) => {
        dispatch({
            type: types.RESTORING_DATA_SECOND_ROUTE
        });
        try {
            const response = await fetch('/root_folder_tree');
            const data = await response.json();
            dispatch(setSelectedFolder(data, id, restoreType));
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }  
    }
}

//set selected folder
export const setSelectedFolder = (tree, id, restoreType) => {
    return{
        type: types.SET_SELECTED_FOLDER,
        tree,
        id,
        restoreType
    }
}



//  Work with Selected Folder

//add to folder
export function addToSelectedFolder(child, childType){
    return{
        type: types.ADD_TO_SELECTED_FOLDER,
        child,
        childType
    }
}

//update folder
export function updateSelectedFolder(child){
    return{
        type: types.UPDATE_SELECTED_FOLDER,
        child,
    }
}

//defete from folder
export function deleteFromSelectedFolder(id){
    return{
        type: types.DELETE_FROM_SELECTED_FOLDER,
        id
    }
}



//  Work with folders
function handleValidatedResponse(response){
    if (response.ok){
        return response.json();
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}


//save folder
export const createFolder = (data) => {
    return async (dispatch) =>{
        dispatch({
            type: types.CREATE_FOLDER
        });
        const response = await fetch(`/folders/${data.id}/folders`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        handleValidatedResponse(response);
        dispatch(changingData());
    }
}

//edit folder
export const updateFolder = (data) =>{
    return async (dispatch) =>{
        dispatch({
            type: types.UPDATE_FOLDER
        });
        const response = await fetch(`/folders/${data.id}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        handleValidatedResponse(response);
        dispatch(changingData());
    }
}

//delete folder
export const deleteFolder = (data) =>{
    const reqData = { 
        parentId: data.parentId,
        id: data.id
    }
    return async (dispatch) =>{
        dispatch({
            type: types.DELETE_FOLDER
        });
        const response = await fetch(`/folders/${data.parentId}/folders/${data.id}`, {
            method: 'delete',
            body: JSON.stringify(reqData),
            headers: {
                "Content-Type": "application/json"
            }
        });
        await response.json();
        dispatch(deleteFromTree(data.path, data.id));
        dispatch(deleteFromSelectedFolder(data.id));
    }
}


//  Work with files

//save file
export function uploadSuccess({ data }) {
    return {
        type: types.UPLOAD_SUCCESS,
        data,
    };
}

export function saveFile(data) {
    return async (dispatch) => {
        dispatch({
            type: types.UPLOAD_FILE
        });
        const response = await fetch(`/folders/${data.id}/files`, {
            method: 'post',
            body: JSON.stringify(data.data),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });
        const result = await response.json();
        dispatch(uploadSuccess(result));
        dispatch(changingData());
        dispatch(addToSelectedFolder(result.file, "file"));
    }
}

//edit file
export const updateFile = (data) =>{
    return async (dispatch) =>{
        dispatch({
            type: types.UPDATE_FILE
        });
        const response = await fetch(`/files/${data.id}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await handleValidatedResponse(response);
        dispatch(changingData());
        dispatch(updateSelectedFolder(result.file));
    }
}

//delete file
export const deleteFile = (data) =>{
    const reqData = { 
        parentId: data.parentId,
        id: data.id
    }
    return async (dispatch) =>{
        dispatch({
            type: types.DELETE_FILE
        });
        const response = await fetch(`/folders/${data.parentId}/files/${data.id}`, {
            method: 'delete',
            body: JSON.stringify(reqData),
            headers: {
                "Content-Type": "application/json"
            }
        });
        await response.json();
        dispatch(deleteFromTree(data.path, data.id));
        dispatch(deleteFromSelectedFolder(data.id));
    }
}
