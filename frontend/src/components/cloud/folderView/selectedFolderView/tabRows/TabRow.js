import React from 'react';
import './TabRow.css';

import FolderTabRow from './FolderTabRow';
import FileTabRow from './FileTabRow';

const TabRow  = () => ({
    render(){
        const { viewNode } = this.props;
        let item;
        if (viewNode.hasOwnProperty('listOfChildren')){
            item = <FolderTabRow {...this.props} />
        } else {
            item = <FileTabRow {...this.props} />
        }
        return(
            <div className="TabRow-container">
                {item}
            </div>
        )
    }
});

export default TabRow;