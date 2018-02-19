import React from 'react';

import { Link } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class FormPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.nameValue || '',
            errors: {},
            showProgress: false
        };
    }
    handleChange = (e) =>{
        if (!!this.state.errors[e.target.name]){
            let errors = { ...this.state.errors };
            delete errors[e.target.name];
            this.setState({ 
                [e.target.name]: e.target.value.substr(0,50),
                errors
            });
        } else {
           this.setState({ 
                [e.target.name]: e.target.value.substr(0,50)
            }); 
        }
    }
    handleSubmit = (e) =>{
        e.preventDefault();
        //validation
        let errors = {};
        if (this.state.name === '') errors.name = "Can't be empty";
        this.setState({ errors });
        const isValid = Object.keys(errors).length === 0;
        if (isValid) {
            const { name } = this.state;
            const id = this.props.id;
            this.setState({ showProgress: true });
            this.props.saveData({ id, name })
                .catch(err => err.response.json().then(({ errors }) => this.setState({ errors, showProgress: false })));
        }
    }

    render(){
        const form = (
            <form className="App-new-view App-main-content"
                onSubmit={this.handleSubmit}
            >
                <h2>{this.props.headerText}</h2>
                <TextField id="name" type="text"
                    value = {this.state.name}
                    name = "name"
                    floatingLabelText={this.props.floatingLableText}
                    floatingLabelFixed={true}
                    errorText={ this.state.errors.name }
                    onChange={this.handleChange}
                    style={{minWidth: '350px'}}
                />
                <br />
                <div className="App-btns-container">        
                    <Link to={`/`}>
                        <RaisedButton label="Cancel" />
                    </Link>    
                    <RaisedButton 
                        label={this.props.confirmBtnLable} 
                        primary={true}
                        onClick={this.handleSubmit}
                    />
                </div>
            </form>
        );

        return(
            <div>
               { form }
            </div>
        )
    }
}

