import React from 'react';
import './OpenedFile.css';

import { Redirect } from 'react-router-dom';

class OpenedFilePlayer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            videoPaused: false,
            redirect: false,
            showFileNotFound: false,
            controlsChange: false,
        };
    }
    componentDidMount(){
        this.positionActiveItem();
        if (this.refs.video) {
            this.refs.video.volume = this.props.volume;
        }
    }
    componentDidUpdate(){
        if (!this.state.controlsChange) {
            this.positionActiveItem();
        }
    }
    positionActiveItem = () => {
        if (this.refs[this.props.id]){
            this.refs[this.props.id].scrollIntoView();
        }
    }
    handleSrcError = () => {
        this.setState({ showFileNotFound: true });
    }
    handleVolumeChange = () => {
        this.setState({ controlsChange: true });
        this.props.setVolume(this.refs.video.volume);
        if (this.refs.video.muted && !this.props.muted) {
            this.props.setMuted("muted");
        } else if (!this.refs.video.muted && this.props.muted) {
            this.props.setMuted("");
        }
    }
    pauseVideo = () => {
        this.setState(prevState => {
            if (this.refs.video){}
            if (prevState.videoPaused){
                if (this.refs.video){ this.refs.video.play(); }
                return ({ videoPaused: false, controlsChange: true });
            } else {
                if (this.refs.video){ this.refs.video.pause(); }
                return ({ videoPaused: true, controlsChange: true });
            }
        });
    }
    handleFileClick = (videoId) => {
        if( videoId === this.props.id ){
            this.pauseVideo();
        } else {
            this.props.selectFile(videoId);
        }
    }
    goBack = () => {
        this.setState({ redirect: true });
    } 
    render(){
        const src = "http://localhost:3000/files/" + this.props.id + "/";
        const folderName = this.props.folderName;

        return(
            <div className="OpenedFile-player-container" >          
                <div className="OpenedFile-media-container" >
                    {this.state.showFileNotFound 
                        ? <div className="OpenedFile-media-not-found-container">
                            <h2 className="OpenedFile-media-not-found"> Video Not Found! </h2>
                        </div>
                        : <video name="media" controls autoPlay 
                            muted={this.props.muted} 
                            ref="video"
                            onClick={this.pauseVideo}
                            onEnded={this.props.handleVideoEnded}
                            onVolumeChange={this.handleVolumeChange}
                        >
                            <source 
                                src={src}
                                type="video/mp4"
                                ref="source"
                                onError={this.handleSrcError} 
                            />
                        </video>
                    }
                </div>

                <div className="OpenedFile-playlist-container">
                    <div className="OpenedFile-playlist-header-container" onClick={this.goBack}>
                        <h2 className="OpenedFile-playlist-header">
                            <span>
                                <span> {'<'} </span>
                                <span style={{marginLeft: '0.2em'}}> {'Playlist'} </span>
                            </span>
                            <span> { folderName } </span>
                        </h2>
                    </div>
                    <ul className="OpenedFile-playlist App-with-scroll" ref="playlist">
                        {this.props.playlist.map(file => {
                            return (
                                <li className="OpenedFile-li-playlist" 
                                    key={'playlist'+ file._id} 
                                    ref={file._id}
                                >
                                    <div className="OpenedFile-playlist-tab-data" onClick={() => this.handleFileClick(file._id)}>
                                        <div className="OpenedFile-playlist-tab-data-icon">
                                            {(file._id === this.props.id) ? ((this.state.videoPaused) ? '||' : '>') : '-'}
                                        </div>
                                        <div className="OpenedFile-playlist-tab-data-name">
                                            {file.name}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {this.state.redirect && <Redirect to="/" />}
            </div>
        )
    }
}

export default OpenedFilePlayer ;