import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class Register extends Component{

    state = {
        name: '',
        email_address: '',
        password: '',
        passwordConfirm: ''
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.password == this.state.passwordConfirm){
            fetch(process.env.REACT_APP_BACKEND_API + `register`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': "application/json"
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email_address: this.state.email_address,
                    password: this.state.password,
                    cash: 5000
                })
            })
            .then(res => res.json())
            .then(response => {
                if(response.errors){
                    this.props.clearErrors();
                    this.props.setErrors('There is already an account using that email address.')
                    document.getElementsByName('email_address')[0].value = ''
                    document.getElementsByName('email_address')[0].focus()
                    this.setState({email_address: ''})
                } else {
                    this.props.clearErrors();
                    this.props.setUser(response.user)
                    this.props.history.push('/portfolio')
                }
            })
        } else {
            this.props.clearErrors();
            this.props.setErrors('Passwords must match.')
        }
    }
    
    render () {
        return (
            <div className='wrapper'>
                <div className='sign-in' >
                    <div className='title'>Register</div>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type='input'
                            name='name'
                            placeholder='Name'
                            className='input'
                            onChange={this.handleChange}
                            required
                        ></input><br></br>
                        <input
                            type='email'
                            name='email_address'
                            placeholder='Email'
                            className='input'
                            onChange={this.handleChange}
                            required
                        ></input><br></br>
                        <input
                            type='password'
                            name='password'
                            placeholder='Password'
                            className='input'
                            onChange={this.handleChange}
                            required
                        ></input><br></br>
                        <input
                            type='password'
                            name='passwordConfirm'
                            placeholder='Confirm Password'
                            className='input'
                            onChange={this.handleChange}
                            required
                        ></input><br></br>
                        <input type='submit' value='Register' className='buttons'></input><br></br>
                        <Link to='/' ><input type='button' value='Back' className='buttons' onClick={() => this.props.clearErrors()}></input></Link>
                        {this.props.errors.length == 0 ?
                            null
                            :
                            <p className='errors'>
                                {this.props.errors}
                            </p>
                        }
                    </form>
                </div>
            </div>
        ) 
    }
}