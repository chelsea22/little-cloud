import React from 'react';
import './Tree.css';

import { Redirect } from 'react-router-dom';

const styles = {
    file: {
        display: 'flex',
        alignItems: 'baseline',
    },
    nameContainer: {
    }
};

class FileNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        };
    }
    handleClick = () => {            
        this.props.selectFolder(this.props.nodePath, this.props.parentNode);
        this.setState({ redirect: true });
    }
    render(){
        const { nodeTree } = this.props;
        const name = (nodeTree.name.length > 20) ? (nodeTree.name.substr(0, 20) + '...') : nodeTree.name;
        return(
            <div className="Tree-file-node" 
                onClick={this.handleClick}
                style={styles.file}
            >
                <div style={styles.nameContainer}> {name} </div>
                {this.state.redirect 
                    && <Redirect to={`/view/files/${nodeTree._id}`} /> 
                }
            </div>
        )
    }
}

export default FileNode;