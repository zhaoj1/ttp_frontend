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
            fetch(`http://localhost:3000/register`,{
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
                    alert('There is already an account using that email address')
                    document.getElementsByName('email_address')[0].value = ''
                    this.setState({email_address: ''})
                } else {
                    this.props.setUser(response.user)
                    this.props.history.push('/portfolio')
                }
            })
        } else {
            alert('passwords must match')
        }
    }
    
    render () {
        return (
            <div className='wrapper'>
                <div className='sign-in' >
                    <label className='title'>Register</label>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type='input'
                            name='name'
                            placeholder='Name'
                            className='input'
                            onChange={this.handleChange}
                        ></input><br></br>
                        <input
                            type='email'
                            name='email_address'
                            placeholder='Email'
                            className='input'
                            onChange={this.handleChange}
                        ></input><br></br>
                        <input
                            type='password'
                            name='password'
                            placeholder='Password'
                            className='input'
                            onChange={this.handleChange}
                        ></input><br></br>
                        <input
                            type='password'
                            name='passwordConfirm'
                            placeholder='Confirm Password'
                            className='input'
                            onChange={this.handleChange}
                        ></input><br></br>
                        <input type='submit' value='Register' className='buttons'></input><br></br>
                        <Link to='/' ><input type='button' value='Back' className='buttons'></input></Link>
                    </form>
                </div>
            </div>
        ) 
    }
}