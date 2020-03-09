import React, { Component } from 'react';
import Header from './Header'

export default class Transactions extends Component{

    componentDidMount(){
        if(!this.props.currentUser){
            this.props.history.push('/')
        }
    }

    render () {
        return (
            <>
                {!this.props.currentUser?
                    this.props.history.push('/')
                    :
                    <>
                        <Header />
                        <div className='transactions'>
                            <div className='transactions-body'>
                                <h1 className='transactions-header'>Transactions</h1>
                                {this.props.transactions.map(ele => {
                                    return(
                                        <div className='transactions-line-item'>
                                            <div className='transactions-line-item-left'>
                                                <label className='line-item-text'>{ele.ticker.toUpperCase()}</label>
                                            </div>
                                            <div className='transactions-line-item-right'>
                                                <label className='line-item-text'>{ele.shares} Share(s) @ ${ele.cost_purchased.toFixed(2)} per share</label>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                }
            </>
        ) 
    }
}