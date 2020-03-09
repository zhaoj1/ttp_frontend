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
    
    componentDidMount(){
        this.setPortfolioTotal();
    }

    componentDidUpdate(prevProps){
        if(prevProps.batch !== this.props.batch && this.props.batch.length !== 0){
            this.setPortfolioTotal();
        }
    }

    setPortfolioTotal = () => {
        var total = 0
        this.props.tickerList.map(ticker => total += (this.props.batch[ticker.toUpperCase()].quote.latestPrice * this.props.transactions.filter(t => t.ticker == ticker).reduce((total, currValue) => total + currValue.shares, 0)))
        this.setState({
            total: parseFloat(total).toFixed(2)
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
                        <Header />
                        <div className='portfolio-body'>
                            <div className='portfolio-left'>
                                <h1>Portfolio (${this.state.total})</h1>
                                {this.props.tickerList.length !== 0? 
                                    this.props.tickerList.map(ticker => {
                                        return (
                                            <div className='portfolio-line-item'>
                                                <div className='portfolio-line-item-left'>
                                                    <p>{ticker.toUpperCase()} - {this.props.transactions.filter(t => t.ticker == ticker).reduce((total, currValue) => total + currValue.shares, 0)} shares</p> 
                                                </div>
                                                <div className='portfolio-line-item-right'>
                                                    {this.props.batch[ticker.toUpperCase()] !== undefined ?
                                                        <p 
                                                            className='cost'
                                                            style={
                                                                this.props.batch[ticker.toUpperCase()].quote.latestPrice < this.props.batch[ticker.toUpperCase()].quote.open ?
                                                                    {'color':'red'}
                                                                    :
                                                                    this.props.batch[ticker.toUpperCase()].quote.latestPrice == this.props.batch[ticker.toUpperCase()].quote.open ?
                                                                        {'color':'gray'}
                                                                        :
                                                                        this.props.batch[ticker.toUpperCase()].quote.latestPrice > this.props.batch[ticker.toUpperCase()].quote.open ?
                                                                        {'color':'green'}
                                                                        :
                                                                        null
                                                            }
                                                        >${(this.props.transactions.filter(t => t.ticker == ticker).reduce((total, currValue) => total + currValue.shares, 0) * this.props.batch[ticker.toUpperCase()].quote.latestPrice).toFixed(2)}</p>
                                                        :
                                                        <label>Loading...</label>
                                                    }
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
                                        min='1'
                                        required
                                    ></input><br></br>
                                    <input
                                        type='submit'
                                        value='Purchase Stock'
                                        className='buttons'
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