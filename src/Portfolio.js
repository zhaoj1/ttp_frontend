import React, { Component } from 'react';
import Header from './Header'

const IEX = 'https://sandbox.iexapis.com/stable/'

export default class Portfolio extends Component{
    
    constructor(){
        super();
        this.state={
            ticker: '',
            quantity: 0,
            total: 0
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.tickerList !== this.props.tickerList){
            this.setPortfolioTotal();
        }
    }

    setPortfolioTotal(){
        var total = 0
        this.props.tickerList.map(ticker => {
            total += this.props.transactions.filter(t=>t.ticker == ticker).reduce((total,currValue) => total + currValue.shares, 0) * this.props.transactions.filter(t=>t.ticker == ticker).reduce((total,currValue) => total + currValue.cost_purchased, 0).toFixed(2)
        })
        this.setState({
            total: total.toFixed(2)
        })
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    postTransaction = async (cost) => {
        if(this.props.currentUser.cash > (this.state.quantity * parseInt(cost))){
            this.props.updateUserCash(this.state.quantity, parseFloat(cost));
            const postResp = await fetch('http://localhost:3000/users/' + this.props.currentUser.id + `/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept:'application/json'
                },
                body: JSON.stringify({
                    ticker: this.state.ticker,
                    shares: parseInt(this.state.quantity),
                    cost_purchased: parseFloat(cost),
                    user_id: this.props.currentUser.id
                })
            })
            if(postResp){
                fetch('http://localhost:3000/users/' + this.props.currentUser.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept:'application/json'
                    },
                    body: JSON.stringify({
                        cash: this.props.currentUser.cash
                    })
                })
                this.props.fetchTransactions();
            }
        }else{
            alert('Insufficient Funds')
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        fetch(IEX + `stock/${this.state.ticker}/quote?token=` + process.env.REACT_APP_IEX_TEST)
        .then(resp => resp.json())
        .then(response => {
            this.postTransaction(response.latestPrice)
        }).catch(error => {
            if(error){
                return alert('Please enter a valid ticker.')
            }
        })
    }

    render () {
        return (
            <>
                {!this.props.currentUser?
                    this.props.history.push('/')
                    :
                    <div className='portfolio'>
                        {console.log(this.state)}
                        <Header />
                        <div className='portfolio-body'>
                            <div className='portfolio-left'>
                                <h1>
                                    Portfolio (${this.state.total})
                                </h1>
                                {this.props.tickerList.length !== 0 ? 
                                    this.props.tickerList.map(ticker => {
                                        return (
                                            <div className='portfolio-line-item'>
                                                <div className='portfolio-line-item-left'>
                                                    <p>{ticker.toUpperCase()} - {this.props.transactions.filter(t => t.ticker == ticker).reduce((total, currValue) => total + currValue.shares, 0)} shares</p>
                                                </div>
                                                <div className='portfolio-line-item-right'>
                                                    <p className='cost'>${this.props.transactions.filter(t => t.ticker == ticker).reduce((total, currValue) => total + currValue.cost_purchased, 0).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    null
                                }
                            </div>
                            <div className='portfolio-right'>
                                <h1>Cash - ${this.props.currentUser.cash.toFixed(2)}</h1>
                                <form id='form' onSubmit={this.handleSubmit} >
                                    <input 
                                        type='text' 
                                        name='ticker'
                                        placeholder='Ticker'
                                        value={this.state.ticker}
                                        onChange={this.handleChange}
                                        className='input'
                                        required
                                    ></input><br></br>
                                    <input 
                                        type='number'
                                        name='quantity'
                                        placeholder='Quantity'
                                        value={this.state.quantity}
                                        onChange={this.handleChange}
                                        className='input'
                                        required
                                    ></input><br></br>
                                    <input
                                        type='submit'
                                        value='Purchase Stock'
                                    ></input>
                                </form>
                            </div>
                        </div>
                    </div>
                }
            </>
        ) 
    }
}