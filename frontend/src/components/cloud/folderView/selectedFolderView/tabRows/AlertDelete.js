import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    deleteAlert: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px solid indianred',
        padding: '1em 0',
    }
}
class AlertDelete extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showError: false,
        };
    }
    handleClick = () => {
        return this.props.handleDelete(this.props.viewNode._id)
            .catch(() => { this.setState({ showError: true })});
    } 
    render(){
        const { viewNode } = this.props;
        return(        
            <div className="delete-alert" style={styles.deleteAlert}>
                {!this.state.showError
                    ? <div>Delete {(viewNode.name.length > 30) ? (viewNode.name.substr(0,30) + '...') : viewNode.name}?</div>
                    : <div>Sorry, an error occurred. Deletion failed.</div>
                }
                {!this.state.showError
                    ? <div className="App-btns-container">
                        <RaisedButton label="Cancel" onClick={this.props.handleCancel}/>
                        <RaisedButton label="Delete"
                            secondary={true}
                            onClick={this.handleClick}
                        />                    
                    </div>
                    : <div className="App-btns-container">
                        <RaisedButton label="Ok" onClick={this.props.handleCancel}/>
                    </div> 
                    
                }
            </div>
        )
    }
}

export default AlertDelete;
