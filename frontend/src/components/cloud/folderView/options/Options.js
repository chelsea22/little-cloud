import React from 'react';
import './Options.css';

import { Link } from 'react-router-dom';

const Options  = () => ({   
    render(){
        const { selectedFolder } = this.props;
        return(
            <div className="Options-cotainer">
                <Link className="Options-add-btn" to={`/add_folder/${selectedFolder._id}`}>
                        Add Folder
                </Link>
                <Link className="Options-add-btn" to={`/add_file/${selectedFolder._id}`}>
                        Add File
                </Link>
            </div>
        )
    }
});

export default Options;