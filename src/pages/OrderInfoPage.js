import React, { Component } from 'react';
import LinkHere from '../components/LinkHere/LinkHere';
import OrderInfo from '../components/Order/OrderInfo';
import PaypalCheckoutButton from '../components/CheckOut/PaypalCheckoutButton';

export default class OrderInfoPage extends Component {
    render() {
        const url = this.props.match.match.url;
        return (
            <div>
                <LinkHere url='/ Thông tin đơn hàng'></LinkHere>
                <div className="page-section mb-60">
                    <div className="container">
                        <div className="row justify-content-center">
                            <OrderInfo></OrderInfo>
                            {/* <PaypalCheckoutButton></PaypalCheckoutButton> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
