import React from 'react';
import './Tree.css';

import FolderNode from './FolderNode';

const Tree  = () => ({
    render(){
        return(
            <div className="Tree-structure-container">
                <FolderNode {...this.props} nodeTree={this.props.tree} nodePath={[]}/>
            </div>
        )
    }
});

export default Tree;