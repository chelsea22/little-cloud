import React from 'react';
import './Breadcrumbs.css';

class Crumbs extends React.Component{
    handleClick = (newPath) => {            
        this.props.selectFolder(newPath, this.props.selectedFolder);
    }
    render(){
        const { i, path } = this.props;
        let newPath = path.slice(0,i+1);
        return(
            <div className="Breadcrumbs-crumb" 
                onClick={() => this.handleClick(newPath)}
            >
                 {path[i].name + ' >'}
            </div>
        )
    }
}

export default Crumbs;