import React from 'react';

import FolderNode from './FolderNode';
import FileNode from './FileNode'

const styles = {
    shift: {
        'paddingLeft': '1em'
    }
};

export default class NodesFilter extends React.Component {
    render(){
        const { listOfChildren } = this.props || [];
        let list = [];
        let key = 1000;

        if (listOfChildren.length > 0){
            listOfChildren.forEach(nodeObj => {
                if (nodeObj && nodeObj.hasOwnProperty('listOfChildren')){
                    list.push(<FolderNode {...this.props} key={key++} nodeTree={nodeObj} nodePath={this.props.nodePath} />);
                } else {
                    list.push(<FileNode {...this.props} key={key++} nodeTree={nodeObj} nodePath={this.props.nodePath}/>);
                }
            });
        }

		return (
            <div style={styles.shift}>
                {list}
			</div>
		);
	}
}


