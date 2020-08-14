import React, { Component } from 'react'
import auth from './initAuth'
class SignUp extends Component {
    constructor(props){
        super(props)
this.state = {
            email: null,
            password: null
        }
    }
    
    _handleSubmit = (e, data) => {
        e.preventDefault()
        auth.signup(this.state.email, this.state.password)
    }
_handleEmailChange = (e) => {
        this.setState( {email: e.target.value} )
        console.log('email', this.state.email)
    }
_handlePasswordChange = (e) => {
        this.setState( {password: e.target.value} )
        console.log('password', this.state.password)
    }
render(){
        return(
            <form className="commentForm" onSubmit={this._handleSubmit}>
                <input type="email" placeholder="Enter your email" onChange={this._handleEmailChange}/>
                <input type="password" placeholder="Enter a password" onChange={this._handlePasswordChange}/>
                <input type="submit" value="Sign up" />
            </form>
        )
    }
}
export default SignUp