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
        fetch(`https://stock-app--backend.herokuapp.com/signin`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json()).then(console.log)
        // .then(response => {
        //     if (response.errors){
        //         this.props.setErrors('Username or Password incorrect.')
        //     } else {
        //         this.props.setUser(response.user)
        //         this.props.history.push('/portfolio')
        //         this.props.clearErrors()
        //     }
        // })        
    }
    
    render () {
        return (
            <div className='wrapper'>
                <div className='sign-in' >
                    <div className='title'>Sign In</div>
                    <form onSubmit={this.handleSubmit}>
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
                        <input type='submit' value='Sign In' className='buttons'></input><br></br>
                        <Link to='/register' ><input type='button' value='Register' className='buttons' onClick={() => this.props.clearErrors()}></input></Link>
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