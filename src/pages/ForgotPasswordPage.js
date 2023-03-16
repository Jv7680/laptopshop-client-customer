import React, { Component } from 'react'
import LinkHere from '../components/LinkHere/LinkHere'
import ForgotPassword from '../components/LoginRegister/ForgotPassword'

export default class ForgotPasswordPage extends Component {
    render() {
        setTimeout(() => {
            console.log('xxxsx');
            window.scrollTo(0, 210);
        }, 100);
        const url = this.props.match.match.url;
        return (
            <div>
                <LinkHere url='/ quên mật khẩu'></LinkHere>
                <ForgotPassword></ForgotPassword>
            </div>
        )

    }
}
