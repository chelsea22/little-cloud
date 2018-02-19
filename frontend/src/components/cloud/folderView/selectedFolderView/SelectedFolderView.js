import React from 'react';
import './SelectedFolderView.css';

import TabRow from './tabRows/TabRow';

import TextField from 'material-ui/TextField'


export default class SelectedFolderView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            search: ''
        };
    }
    updateSearch = (event) => {
        this.setState({search: event.target.value.substr(0,30)});
    }

	render(){
        const { path } = this.props;
        let backPath;
        let backRow;
        if (path.length > 1){
            backPath = path.slice(0,path.length-1) || ['Home'];
            backRow = (
                <div className="SelectedFolderView-back-row"
                    onClick={() => this.props.selectFolder(backPath, this.props.parentFolder)}
                >
                    ..
                </div>
            );
        }else{
            backRow = (
                <div className="SelectedFolderView-back-row-empty">
                </div>
            );
        }

        const filteredNodes = this.props.selectedFolder.listOfChildren.filter(
            (node) => {
                return node.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );
        
        return (
            <div className="SelectedFolderView-list-container">
                <div className="SelectedFolderView-search-box">
                    <TextField 
                        id="search" 
                        type="text" 
                        value={this.state.search} 
                        onChange={this.updateSearch}
                     />
                     <span>Search</span>
                </div>
                {backRow}
                <ul>
                    {filteredNodes.map((node)=>{
                        return <li className="SelectedFolderView-li-tab" key={node._id}><TabRow {...this.props} viewNode={node} /></li>
                    })}
                </ul>
            </div>
		);
	}
}