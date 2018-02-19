import React from 'react';
import './OpenedFile.css';

import { connect } from 'react-redux';
import { restoreSelectedFolder } from '../../../actions/actionCreators';

import OpenedFilePlayer from './OpenedFilePlayer';

import CircularProgress from 'material-ui/CircularProgress';


class OpenedFileContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            playlist: this.props.folder.filesChildren || [],
            videoId: this.props.id,
            showProgress: false,
            muted: "",
            volume: 1,
        };
    }
    componentDidMount(){
        if (!this.props.flagFetched) {
            this.props.restoreSelectedFolder(this.props.match.params._id, 'file');
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState( prevState => {
            return ({
                playlist: nextProps.folder.filesChildren || [],
                videoId: nextProps.id,
                muted: prevState.muted,
                volume: prevState.volume,
            })
        });
    }
    selectFile = (videoId) => {
        this.setState({ showProgress: true }, () => { 
            this.props.history.push(videoId);
            this.setState({ showProgress: false });
        });
    }
    handleVideoEnded = () => {
        if (this.state.playlist.length > 0) {
            let currentFlag = false;
            let nextVideoId = '';
            this.state.playlist.map(file => {
                if (currentFlag) {
                    nextVideoId = file._id;
                    currentFlag = false;
                }
                if ( file._id === this.state.videoId ){
                    currentFlag = true;
                }
                return true; 
            });
            if (nextVideoId) {
                this.selectFile(nextVideoId);
            } else {
                this.selectFile(this.state.playlist[0]._id);
            }
        } else {
            this.selectFile(this.state.videoId);
        }
    }
    setMuted = (value) => {
        this.setState({ muted: value });
    }
    setVolume = (value) => {
        this.setState({ volume: value });
    }  
    render(){
        return(
            <div className="OpenedFile-opened-file">
                {this.state.showProgress
                    ? <div className="App-spinner OpenedFile-player-container"> 
                        <CircularProgress size={80} thickness={9} /> 
                    </div>
                    : <OpenedFilePlayer
                        id = {this.state.videoId}
                        folderName = {this.props.folder.name}
                        playlist = {this.state.playlist}
                        selectFile = {this.selectFile}
                        handleVideoEnded = {this.handleVideoEnded}
                        muted = {this.state.muted}
                        volume = {this.state.volume}
                        setMuted = {this.setMuted}
                        setVolume = {this.setVolume}
                    />
                }
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

export default connect(mapStateToProps, { restoreSelectedFolder })(OpenedFileContainer);