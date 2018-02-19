import React from 'react';
import './Tree.css';

import NodesFilter from './NodesFilter';

import Folder from 'react-material-icons/icons/file/folder';
import FolderOpen from 'react-material-icons/icons/file/folder-open';

const styles = {
    folder: {
        display: 'flex',
        alignItems: 'baseline',
        marginBottom: '0.5em',
    },
    iconContainer: {
        position: 'relative',
    },
    icon: {
        color: 'rgb(214, 125, 121)',
        position: 'absolute',
        top: '-20px',
    },
    nameContainer: {
        padding: '10px 0 0px 30px'
    }
};

class FolderNode extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            newNodePath: this.setNewPath(this.props.nodePath, this.props.nodeTree),
            nodeId: this.props.nodeTree._id,
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            newNodePath: this.setNewPath(nextProps.nodePath, nextProps.nodeTree),
            nodeId: nextProps.nodeTree._id,
        });
    }

    setNewPath = (path, node) => {
        const { _id, name } = node;
        let newNode = { _id: _id, name: name };
        return [ ...path, newNode ];
    }  

    handleClick = () =>{             
        this.props.selectFolder(this.state.newNodePath, this.props.nodeTree);
        this.props.openCloseFolder(this.state.newNodePath, this.state.nodeId); 
    }

	render(){
           
        const { nodeTree } = this.props;
        const { newNodePath } = this.state;
        const bage = nodeTree.isOpen ? <FolderOpen style={styles.icon} /> : <Folder style={styles.icon} />;

        return(
            <div className="Tree-folder-node">
                <div 
                    onClick={this.handleClick}
                    style={styles.folder}
                >
                    <div style={styles.iconContainer}> {bage} </div> 
                    <div style={styles.nameContainer}> {nodeTree.name} </div>
                </div>
                {nodeTree.isOpen && <NodesFilter {...this.props} listOfChildren={nodeTree.listOfChildren} nodePath={newNodePath} parentNode={nodeTree}/>}
            </div>        
		);
	}
}

export default FolderNode;
