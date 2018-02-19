import React from 'react';
import './AddNewFile.css';

import { connect } from 'react-redux';
import { saveFile, restoreSelectedFolder } from '../../../actions/actionCreators';

import { Link, Redirect } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';

import Done from 'react-material-icons/icons/action/done';
import DoneAll from 'react-material-icons/icons/action/done-all';
import Close from 'react-material-icons/icons/navigation/close';

class AddNewFile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            files: [],
            tooLargeFiles: [],
            failToUpload: [],
            succeedToUpload: [],
            showInput: true,
            showProgress: false,
            fileUploaded: false,
            redirect: false,
            messagesTimeoutArray: [],
            showUploadSuccess: false,
            showUploadError: false,
            showUploadErrorDialog: false,
            showUploadEnded: false,
            showUploadedAll: false,
        };
    }
    componentDidMount(){
        if (!this.props.flagFetched) {
            this.props.restoreSelectedFolder(this.props.match.params._id, 'folder');
        }
    }
    componentWillUnmount(){
        if (this.state.messagesTimeoutArray.length > 0) {
          this.clearMessagesTimeoutArray();
        }
    }
    handleFileUpload = (e) => {
        e.preventDefault();
        this.setState({ showProgress: true, files: [], fileUploaded: false, });  
        const files = e.target.files;
        const filesToRead = [ ...files ];
        filesToRead.map(file => {
            let result = {};
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                result.videoPreview = reader.result;
                result.name = file.name.split('.mp')[0];
                result.type = file.type;
                result.size = file.size;
                if (result.size > 104857600){
                    this.setState(prevState => {
                        return { tooLargeFiles: [ ...prevState.tooLargeFiles, result ] };
                    }, () => {
                        if (filesToRead.length === (this.state.files.length + this.state.tooLargeFiles.length)){
                            this.setState({
                                fileUploaded: true,
                                showProgress: false,
                            })
                        }
                    });
                } else {
                    this.setState(prevState => {
                        return { files: [ ...prevState.files, result ] };
                    },  () => {
                        if (filesToRead.length === (this.state.files.length + this.state.tooLargeFiles.length)){
                            this.setState({
                                fileUploaded: true,
                                showProgress: false,
                            })
                        }
                    });
                }
            }
            return result; 
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ showInput: false, fileUploaded: false, showProgress: true  });
        this.state.files.map(file => {
            let data = {};
            data.name = file.name;
            data.type = file.type;
            data.size = file.size;
            data.data = file.videoPreview;
            return this.props.saveFile({ data, id: this.props.id })
                .then(() => {
                    this.createShowSuccessUpload(file);
                })
                .catch((err) => {
                    this.showUploadError(file);
                })
        });
    }
    createShowSuccessUpload = (file) => {
        this.setState(prevState => {
                return {
                    succeedToUpload: [ ...prevState.succeedToUpload, file],
                    showUploadSuccess: true, 
                };
            }, () => {
                const { succeedToUpload, failToUpload, files } = this.state;
                if ( succeedToUpload.length + failToUpload.length === files.length ){
                    this.setState({ showUploadEnded: true, showProgress: false }, () => {
                        if (this.state.succeedToUpload.length === this.state.files.length ){
                            this.setState({
                                showUploadedAll: true
                            });
                        }
                    });
                }
            }
        );
    }
    showUploadError = (file) => {
        this.setState(prevState => {
                return {
                    failToUpload: [ ...prevState.failToUpload, file],
                    showUploadError: true,
                    showUploadErrorDialog: true,
                }; 
            }, () => {
                const currentMessageTimeout = setTimeout(()=>this.setState({showUploadErrorDialog: false}), 2700);
                this.setState(prevState => {
                    return { messagesTimeoutArray: [...prevState.messagesTimeoutArray, currentMessageTimeout] };
                });
                const { succeedToUpload, failToUpload, files } = this.state;
                if ( succeedToUpload.length + failToUpload.length === files.length ){
                    this.setState({ showUploadEnded: true, showProgress: false });
                }
            }
        );
    }
    clearMessagesTimeoutArray(){
        this.state.messagesTimeoutArray.map((id) => clearTimeout(id));
    }
    goBack = () => {
        this.setState({ redirect: true });
    }
    render(){
        const form = (
            <form 
                className="App-new-view App-main-content"
                onSubmit={this.handleSubmit} 
                ref="form"
            >
                <h2>Add New Video Files !!!</h2>
                
                {this.state.showInput
                    ? <RaisedButton
                        containerElement='label'
                        label='Click here to choose files'
                        primary={true}
                        style={{ margin: '2em 1em' }}
                    >
                        <input
                            style={{ width: 0, height: 0, overflow: 'hidden' }} 
                            type="file"
                            multiple='true'
                            accept="video/*"
                            onChange={this.handleFileUpload} 
                        />
                    </RaisedButton>
                    : <h3> Uploading {this.state.files.length} file{(this.state.files.length === 1) ? '':'s'}. Please wait... </h3>
                }

                <div className="AddNewFile-list">
                    {this.state.fileUploaded 
                        && <ol className="AddNewFile-ol">
                            {this.state.files.map(file => {
                                return <li className="AddNewFile-li" key={file.name}>
                                    <div className="AddNewFile-tab">
                                        {file.name}
                                    </div>
                                </li>
                            })}
                        </ol>
                    }

                    {this.state.fileUploaded && (this.state.tooLargeFiles.length > 0)
                        && <div>
                            <h3 style={{textAlign: 'center'}}> 
                                Too lagre input! More than 100mb. This file{(this.state.tooLargeFiles.length === 1) ? '':'s'} will be ignored during upload! 
                            </h3>
                            <ol className="AddNewFile-ol">
                                {this.state.tooLargeFiles.map(file => {
                                    return <li className="AddNewFile-li" key={file.name}>
                                        <div className="AddNewFile-tab">
                                            {file.name}
                                        </div>
                                    </li>
                                })}
                            </ol>
                        </div>
                    }
                    
                    {this.state.showUploadSuccess
                        && <div className="AddNewFile-message-container">
                            <h3> File uploaded succesfuly! </h3>
                            <ol className="AddNewFile-ol">
                                {this.state.succeedToUpload.map(file => {
                                    return <li className="AddNewFile-li" key={file.name}>
                                        <div className="AddNewFile-tab">
                                            {file.name}
                                            <Done style={{color: 'green', marginLeft: '3em'}} />
                                        </div> 
                                    </li>
                                })}
                            </ol>
                        </div>
                    }

                    {this.state.showUploadError
                        && <div className="AddNewFile-message-container">
                            <h3 style={{color: 'red'}}> This files upload fail! </h3>
                            <ol className="AddNewFile-ol">
                                {this.state.failToUpload.map(file => {
                                    return <li className="AddNewFile-li" key={file.name}>
                                        <div className="AddNewFile-tab">
                                            {file.name}
                                            <Close style={{color: 'red', marginLeft: '3em'}} />
                                        </div> 
                                    </li>
                                })}
                            </ol>
                        </div>
                    }

                    {this.state.showUploadedAll
                        && <div className="AddNewFile-done">
                            <div style={{ marginTop: '-1em' }}><h3>All files uploaded!</h3></div>
                            <DoneAll style={{color: 'green', marginLeft: '3em'}} /> 
                        </div>
                    }
                </div>

                {this.state.fileUploaded 
                    && <div className="App-btns-container">        
                        <Link to={`/`}>
                            <RaisedButton label="Cancel" />
                        </Link>    
                        <RaisedButton label="Add" primary={true}
                            onClick={this.handleSubmit}
                        />
                    </div>
                }

                {this.state.showUploadEnded 
                    && <RaisedButton 
                        label="Ok" 
                        primary={true}
                        style={{width: '50%', margin: '2em 1em'}}
                        onClick={this.goBack}
                    />
                }
                {this.state.showProgress 
                    && <div className="App-spinner">
                        <CircularProgress size={80} thickness={9} />
                    </div>
                }

            </form>
        )
        return(
            <div>
                { form }
                {this.state.redirect && <Redirect to="/" />}
                <Dialog open={this.state.showUploadErrorDialog}>
                    {'Something whent wrong during upload!!!'}
                </Dialog>
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    const { match } = props;
    if (match.params._id) {
        return {
            id: match.params._id,
            folder: state.selectedFolder,
            flagFetched: state.flagFetched,  
        }
    }
    return { id: null, folder: null, flagFetched: null };
}

export default connect(mapStateToProps, { saveFile, restoreSelectedFolder })(AddNewFile);
