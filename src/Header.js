import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class Header extends Component{
    
    render () {
        return (
            <div className='header'>
                <Link to ='/portfolio' className='link'><span>Portfolio</span></Link> | <Link to='/transactions' className='link'><span>Transactions</span></Link>
            </div>
        ) 
    }
}