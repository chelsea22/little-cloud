import React from 'react';
import './FoldersFilesCounter.css';

const FoldersFilesCounter  = (props) => ({
    render(){
        const list = this.props.selectedFolder.listOfChildren || [];
        let folders = 0;
        let files = 0;
        if (list.length > 0){
            list.forEach(nodeObj => {
                if (nodeObj.hasOwnProperty('listOfChildren')){
                    folders++;
                } else {
                    files++;
                }
            });
        }
        return(
            <div className="FFCounter-container">
                 <span>Folders: {folders}</span><span>Files: {files}</span>
            </div>
        )
    }
});

export default FoldersFilesCounter;