import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import SignIn from './SignIn'
import Register from './Register'
import Portfolio from './Portfolio'
import Transactions from './Transactions'

var portfolio

export default class MainContainer extends Component{
    
    constructor(){
        super();
        this.state = {
            currentUser: null,
            transactions: [],
            tickerList: []
        }
        this.setUser = this.setUser.bind(this)
        this.updateUserCash = this.updateUserCash.bind(this)
    }

    setUser = (user) => {
        this.setState({
            currentUser: user
        }, () => this.fetchTransactions())
    }

    fetchTransactions = async () => {
        const portfolioTransactions = await fetch('http://localhost:3000/users/' + this.state.currentUser.id + `/transactions`)
        .then(resp => resp.json())
        .then(response => this.setState({
            transactions: [
                ...response
            ]
        }))
        portfolio = new Set(this.state.transactions.map(t => t.ticker))
        this.setState({tickerList: [...portfolio]})
    }

    updateUserCash = (quantity, cost) => {
        this.state.currentUser.cash = this.state.currentUser.cash - parseInt(quantity) * parseFloat(cost)
    }
    
    render () {
        return (
            <div className='main-container'>
                <Switch>
                    <Route
                        exact path='/'
                        render={
                            (routerProps) => <SignIn 
                                {...routerProps}
                                setUser={this.setUser}
                            />
                        }
                    ></Route>
                    <Route
                        exact path='/register'
                        render={
                            (routerProps) => <Register 
                                {...routerProps}
                                setUser={this.setUser}
                            />
                        }
                    ></Route>
                    <Route
                        exact path='/portfolio'
                        render={
                            (routerProps) => <Portfolio 
                                {...routerProps}
                                currentUser={this.state.currentUser}
                                updateUserCash={this.updateUserCash}
                                transactions={this.state.transactions}
                                tickerList={this.state.tickerList}
                                fetchTransactions={this.fetchTransactions}
                            />
                        }
                    ></Route>
                    <Route
                        exact path='/transactions'
                        render={
                            (routerProps) => <Transactions 
                                {...routerProps}
                                currentUser={this.state.currentUser}
                                transactions={this.state.transactions}
                            />
                        }
                    ></Route>
                </Switch>
                <a href="https://iexcloud.io" className='attribution'>Data provided by IEX Cloud</a>
            </div>
        ) 
    }
}