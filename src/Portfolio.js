import React, { Component } from 'react';
import Header from './Header'

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
        this.props.clearErrors();
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
            const postResp = await fetch(process.env.BACKEND_API + 'users/' + this.props.currentUser.id + `/transactions`, {
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
                fetch(process.env.BACKEND_API + 'users/' + this.props.currentUser.id, {
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
            this.props.clearErrors();
        }else{
            this.props.setErrors(`Insufficient Funds - $${parseFloat(cost).toFixed(2)} per share`)
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        fetch(process.env.IEX + `stock/${this.state.ticker}/quote?token=` + process.env.REACT_APP_IEX_TEST)
        .then(resp => resp.json()).then(console.log)
        // .then(response => {
        //     this.postTransaction(response.latestPrice);
        //     this.setState({
        //         ticker: '',
        //         quantity: 0  
        //     })
        //     document.getElementsByName('ticker')[0].focus()
        // }).catch(error => {
        //     if(error){
        //         this.props.setErrors('Please enter a valid ticker.')
        //         this.setState({
        //             ticker: '',
        //             quantity: 0  
        //         })
        //         document.getElementsByName('ticker')[0].focus()
        //     }
        // })
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
                                                    <p className='line-item-text'>
                                                        {ticker.toUpperCase()} - {this.props.transactions.filter(t => t.ticker == ticker).reduce((total, currValue) => total + currValue.shares, 0)} share(s) <br></br>
                                                        {this.props.batch[ticker.toUpperCase()] !== undefined &&
                                                            this.props.batch[ticker.toUpperCase()] !== null ?
                                                                this.props.batch[ticker.toUpperCase()].quote.open == null ? 
                                                                    <>
                                                                        Prev Close: ${this.props.batch[ticker.toUpperCase()].quote.previousClose.toFixed(2)}
                                                                        <br></br>
                                                                        Curr Price: 
                                                                        <span 
                                                                            style={
                                                                                this.props.batch[ticker.toUpperCase()].quote.latestPrice < this.props.batch[ticker.toUpperCase()].quote.previousClose ?
                                                                                    {'color':'red'}
                                                                                    :
                                                                                    this.props.batch[ticker.toUpperCase()].quote.latestPrice == this.props.batch[ticker.toUpperCase()].quote.previousClose ?
                                                                                        {'color':'gray'}
                                                                                        :
                                                                                        this.props.batch[ticker.toUpperCase()].quote.latestPrice > this.props.batch[ticker.toUpperCase()].quote.previousClose ?
                                                                                        {'color':'green'}
                                                                                        :
                                                                                        null
                                                                            }
                                                                        > ${this.props.batch[ticker.toUpperCase()].quote.latestPrice.toFixed(2)}</span>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        Open Price: ${this.props.batch[ticker.toUpperCase()].quote.open.toFixed(2)}
                                                                        <br></br>
                                                                        Curr Price: 
                                                                        <span 
                                                                            style={
                                                                                this.props.batch[ticker.toUpperCase()].quote.latestPrice < this.props.batch[ticker.toUpperCase()].quote.previousClose ?
                                                                                    {'color':'red'}
                                                                                    :
                                                                                    this.props.batch[ticker.toUpperCase()].quote.latestPrice == this.props.batch[ticker.toUpperCase()].quote.previousClose ?
                                                                                        {'color':'gray'}
                                                                                        :
                                                                                        this.props.batch[ticker.toUpperCase()].quote.latestPrice > this.props.batch[ticker.toUpperCase()].quote.previousClose ?
                                                                                        {'color':'green'}
                                                                                        :
                                                                                        null
                                                                            }
                                                                        > ${this.props.batch[ticker.toUpperCase()].quote.latestPrice.toFixed(2)}</span>
                                                                    </>
                                                            :
                                                            null
                                                        } 
                                                    </p> 
                                                </div>
                                                <div className='portfolio-line-item-right'>
                                                    <br></br>
                                                    {this.props.batch[ticker.toUpperCase()] !== undefined ?
                                                        this.props.batch[ticker.toUpperCase()].quote.open == null ?
                                                            <p 
                                                                className='line-item-text'
                                                                style={
                                                                    this.props.batch[ticker.toUpperCase()].quote.latestPrice < this.props.batch[ticker.toUpperCase()].quote.previousClose ?
                                                                        {'color':'red'}
                                                                        :
                                                                        this.props.batch[ticker.toUpperCase()].quote.latestPrice == this.props.batch[ticker.toUpperCase()].quote.previousClose ?
                                                                            {'color':'gray'}
                                                                            :
                                                                            this.props.batch[ticker.toUpperCase()].quote.latestPrice > this.props.batch[ticker.toUpperCase()].quote.previousClose ?
                                                                            {'color':'green'}
                                                                            :
                                                                            null
                                                                }
                                                            >
                                                            ${(this.props.transactions.filter(t => t.ticker == ticker).reduce((total, currValue) => total + currValue.shares, 0) * this.props.batch[ticker.toUpperCase()].quote.latestPrice).toFixed(2)}
                                                        </p>
                                                            :
                                                            <p 
                                                                className='line-item-text'
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
                                                            >
                                                            ${(this.props.transactions.filter(t => t.ticker == ticker).reduce((total, currValue) => total + currValue.shares, 0) * this.props.batch[ticker.toUpperCase()].quote.latestPrice).toFixed(2)}
                                                        </p>
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
                    </div>
                }
            </>
        ) 
    }
}