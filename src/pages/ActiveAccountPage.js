import React, { Component } from 'react';
import LinkHere from '../components/LinkHere/LinkHere';
import ActiveAccount from '../components/LoginRegister/ActiveAccount';

export default class ActiveAccountPage extends Component {
    render() {
        setTimeout(() => {
            console.log('xxxsx');
            window.scrollTo(0, 210);
        }, 100);
        const url = this.props.match.match.url;
        return (
            <div>
                <LinkHere url='/ Xác Thực'></LinkHere>
                <div className="page-section mb-60">
                    <div className="container">
                        <div className="row justify-content-center">
                            <ActiveAccount></ActiveAccount>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
