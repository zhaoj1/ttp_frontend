import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import SignIn from './SignIn'
import Register from './Register'
import Portfolio from './Portfolio'
import Transactions from './Transactions'

const IEX = 'https://sandbox.iexapis.com/stable/'
var portfolio

export default class MainContainer extends Component{
    
    constructor(){
        super();
        this.state = {
            currentUser: null,
            transactions: [],
            tickerList: [],
            batch: {},
            errors: ''
        }
        this.setUser = this.setUser.bind(this)
        this.updateUserCash = this.updateUserCash.bind(this)
        this.fetchBatch = this.fetchBatch.bind(this)
    }

    setUser = (user) => {
        this.setState({
            currentUser: user
        }, ()=> this.fetchTransactions())
    }

    fetchTransactions = async () => {
        const portfolioTransactions = await fetch('https://stock-app--backend.herokuapp.com/users/' + this.state.currentUser.id + `/transactions`)
        .then(resp => resp.json())
        .then(response => this.setState({
            transactions: [
                ...response
            ]
        }), () => this.fetchBatch())
        portfolio = new Set(this.state.transactions.map(t => t.ticker))
        this.setState({tickerList: [...portfolio]}, 
            () => this.fetchBatch(), this.fetchBatchInterval()
        )
    }

    updateUserCash = (quantity, cost) => {
        this.state.currentUser.cash = this.state.currentUser.cash - parseInt(quantity) * parseFloat(cost)
    }

    fetchBatch = () => {
        if(this.state.tickerList.length !== 0){
            fetch(IEX + `stock/market/batch?symbols=${this.state.tickerList.join(',')}&types=quote&range=1m&last=5&token=` + process.env.REACT_APP_IEX_TEST)
            .then(resp => resp.json())
            .then(response => this.setState({
                batch: {
                    ...response
                }
            }))
        }
    }

    fetchBatchInterval = () => {
        setInterval(() => this.fetchBatch(), 10000)
    }

    setErrors = (error) => {
        this.setState({
            errors: error
        })
    }

    clearErrors = () => {
        this.setState({
            errors: ''
        })
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
                                setErrors={this.setErrors}
                                clearErrors={this.clearErrors}
                                errors={this.state.errors}
                            />
                        }
                    ></Route>
                    <Route
                        exact path='/register'
                        render={
                            (routerProps) => <Register 
                                {...routerProps}
                                setUser={this.setUser}
                                setErrors={this.setErrors}
                                clearErrors={this.clearErrors}
                                errors={this.state.errors}
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
                                batch={this.state.batch}
                                fetchBatch={this.fetchBatch}
                                setErrors={this.setErrors}
                                clearErrors={this.clearErrors}
                                errors={this.state.errors}
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