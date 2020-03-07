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
                    <div className='transactions'>
                        <Header />
                        <div className='transactions'>
                            <div className='transactions-body'>
                                <h1>Transactions</h1>
                                {this.props.transactions.map(ele => {
                                    return(
                                        <>
                                            <p>{ele.ticker.toUpperCase()} - {ele.shares} Shares @ ${ele.cost_purchased} </p>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                }
            </>
        ) 
    }
}