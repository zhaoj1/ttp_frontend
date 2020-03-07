import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class SignIn extends Component{

    state = {
        email_address: '',
        password: ''
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:3000/signin`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(response => {
            if (response.errors){
                alert('Username or Password incorrect')
            } else {
                this.props.setUser(response.user)
                this.props.history.push('/portfolio')
            }
        })        
    }
    
    render () {
        return (
            <div className='wrapper'>
                <div className='sign-in' >
                    <label>Sign In</label>
                    <form onSubmit={this.handleSubmit}>
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
                        <input type='submit' value='Sign In'></input><br></br>
                        <Link to='/register' ><input type='button' value='Register'></input></Link>
                    </form>
                </div>
            </div>
        ) 
    }
}