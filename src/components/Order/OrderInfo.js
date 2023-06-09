import React, { Component } from 'react'
import { actActiveRequest, actLoginRequest } from '../../redux/actions/auth';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startLoading, doneLoading } from '../../utils/loading'
import { withRouter } from 'react-router-dom';
import callApi from '../../utils/apiCaller';
import { paypal } from 'paypal-checkout/dist/checkout.lib';
import PaypalCheckoutButton from '../CheckOut/PaypalCheckoutButton';
import store from '../..';
import { actClearCart } from '../../redux/actions/cart';

import "./style.css";
toast.configure()

class OrderInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            recipientname: `${this.props.userInfo.lastname} ${this.props.userInfo.firstname}`,
            address: `${this.props.userInfo.address}`,
            phoneNumber: `${this.props.userInfo.phonenumber}`,
            customerNote: "",
        }

        this.cartItemList = [];
    }

    componentDidMount = () => {
        let id = localStorage.getItem('_id');
        console.log('cart: ', this.props.cart);

        let cartItemListData = [];
        for (let i = 0; i < this.props.cart.length; i++) {
            cartItemListData[i] = {
                accountId: id,
                productId: this.props.cart[i].product.productId,
                cartProductQuantity: this.props.cart[i].cartProductQuantity,
            }
        }
        console.log('cartItemListData: ', cartItemListData);
        this.cartItemList = cartItemListData;
        console.log('cartItemList: ', this.cartItemList);
    }


    handleChange = event => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = async (paymentMethod) => {
        const { recipientname, address, phoneNumber, customerNote } = this.state;
        console.log('recipientname, address, phoneNumber, customerNote là: ', recipientname, address, phoneNumber, customerNote);

        let id = localStorage.getItem('_id');
        let token = localStorage.getItem('_auth');
        const body = {
            accountId: id,
            address: address,
            phoneNumber: phoneNumber,
            recipientname: recipientname,
            total: localStorage.getItem('total'),
            customerNote: customerNote,
            cartItemList: this.cartItemList,
            paymentmethod: paymentMethod,
        }

        startLoading();
        let res = await callApi('orders', 'POST', body, token);
        doneLoading();

        console.log('resssss: ', res);
        if (res.status === 200) {
            await store.dispatch(actClearCart());
            toast.success('Đặt Hàng Thành Công');
            this.props.history.push(`/`);
        }
        else {
            toast.error('Lỗi!');
        }
    }


    render() {
        const { recipientname, address, phoneNumber, customerNote } = this.state;
        // const { user } = this.props;
        // if (user !== null) {
        //     return <Redirect to="/"></Redirect>
        // }

        return (
            <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6 mb-30">
                {/* Login Form s*/}
                <form >
                    <div className="login-form">
                        <h4 className="login-title">Thông tin đơn hàng</h4>
                        <div className="row">
                            <div className="col-md-12 col-12 mb-20">
                                <label>Tên người nhận hàng *</label>
                                <input
                                    value={recipientname}
                                    onChange={this.handleChange}
                                    className="mb-0"
                                    type="text"
                                    placeholder="Tên người nhận hàng"
                                    name='recipientname'
                                />
                                <label>Địa chỉ *</label>
                                <input
                                    value={address}
                                    onChange={this.handleChange}
                                    className="mb-0"
                                    type="text"
                                    placeholder="Địa chỉ"
                                    name='address'
                                />
                            </div>
                            <div className="col-md-12 col-12 mb-20">
                                <label>Số điện thoại *</label>
                                <input
                                    value={phoneNumber}
                                    onChange={this.handleChange}
                                    className="mb-0"
                                    type="text"
                                    placeholder="Số điện thoại"
                                    name='phoneNumber'
                                />
                            </div>
                            {/* <div className="col-md-12 col-12 mb-20">
                                <label>Phương thức thanh toán *</label>
                                <div style={{ display: "flex" }}>
                                    <input
                                        value={"Khi nhận hàng"}
                                        checked={this.state.checkoutAtHome}
                                        onChange={() => { this.setState({ checkoutAtHome: true, checkoutPaypal: false }) }}
                                        className="mb-0"
                                        type="radio"
                                        name='checkout'
                                        style={{ width: 18, height: 18, cursor: "pointer", marginRight: 4 }}
                                    />
                                    <label for="html" style={{ margin: "0 30px 0 0" }}>Khi nhận hàng</label>
                                    <input
                                        value={"Paypal"}
                                        checked={this.state.checkoutPaypal}
                                        onChange={() => { this.setState({ checkoutAtHome: false, checkoutPaypal: true }) }}
                                        className="mb-0"
                                        type="radio"
                                        name='checkout'
                                        style={{ width: 18, height: 18, cursor: "pointer", marginRight: 4 }}
                                    />
                                    <label for="html">Paypal</label><br></br>
                                </div>
                            </div> */}
                            <div className="col-md-12 col-12 mb-20">
                                <label>Ghi chú </label>
                                <input
                                    value={customerNote}
                                    onChange={this.handleChange}
                                    className="mb-0"
                                    type="text"
                                    placeholder="Ghi chú"
                                    name='customerNote'
                                />
                            </div>
                            <div className="col-12" >
                                <button
                                    onClick={() => this.handleSubmit("Khi nhận hàng")}
                                    className="register-button mt-0 mb-3"
                                    type='button'
                                    style={{ width: "100%", height: 54 }}>
                                    <i class="fa-solid fa-house"></i> Thanh toán khi nhận hàng
                                </button>
                                <div className="btnPaypal" >
                                    <PaypalCheckoutButton onSuccess={this.handleSubmit}></PaypalCheckoutButton>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.auth,
        cart: state.cart,
        userInfo: state.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        activeRequest: (activeCode, user) => {
            dispatch(actActiveRequest(activeCode, user))
        },
        loginRequest: (user) => {
            dispatch(actLoginRequest(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderInfo))
