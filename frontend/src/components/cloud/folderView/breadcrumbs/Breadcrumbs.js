import React from 'react';
import './Breadcrumbs.css';

import Crumb from './Crumb';

const Breadcrumbs = () => ({
    render(){
        const { path } = this.props;
        return(
            <div className="Breadcrumbs-container">
                {path.map((folder, i) =>
                    <Crumb {...this.props} key={i} i={i} folder={folder}/> )}
            </div>
        )
    }
});

export default Breadcrumbs;
