import React, { Component } from 'react';
import './App.css';

import { NavLink, Route, Switch } from 'react-router-dom';

import Main from './components/Main';

import OpenedFile from './components/cloud/media-player/OpenedFileContainer';

import AddFolder from './components/cloud/operations/AddFolder';
import AddNewFile from './components/cloud/operations/AddNewFile';
import EditFile from './components/cloud/operations/EditFile';
import EditFolder from './components/cloud/operations/EditFolder';

class App extends Component {
  render() {
    return (
      <div className="App-cloud">
        <div className="App-cloud-link">
          <NavLink className="App-item" activeClassName="active" exact to="/">Little Cloud</NavLink>
        </div>
        <Switch>
          <Route exact path="/" component={Main}></Route>
          <Route exact path="/view/files/:_id" component={OpenedFile}></Route>
          <Route exact path="/add_folder/:_id" component={AddFolder}></Route>
          <Route exact path="/add_file/:_id" component={AddNewFile}></Route>
          <Route exact path="/edit_file/:_id/:name" component={EditFile}></Route>
          <Route exact path="/edit_folder/:_id/:name" component={EditFolder}></Route>
        </Switch>
      </div>
    );
  }
}

export default App;
