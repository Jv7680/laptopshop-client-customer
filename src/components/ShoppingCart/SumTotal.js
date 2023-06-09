import React, { Component } from 'react'
import { connect } from 'react-redux'
import { formatNumber } from '../../config/TYPE'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import { actFetchAddressRequest } from '../../redux/actions/address';
import 'react-toastify/dist/ReactToastify.css';
import { withRouter } from 'react-router-dom';

toast.configure()

let id;
let token;
class SumTotal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectYourOrder: false,
      redirectYourLogin: false
    }
  }


  checkAuthenticate = () => {
    id = localStorage.getItem("_id");
    const { sumTotal } = this.props;
    if (!sumTotal.length) {
      return toast.error('Vui lòng chọn sản phẩm để mua');
    }
    // if (id) {
    //   await this.props.fetch_address(id);
    //   this.setState({
    //     redirectYourOrder: true
    //   })
    // } else {
    //   toast.error('Đăng nhập trước khi thanh toán');
    //   this.setState({
    //     redirectYourLogin: true
    //   })
    // }

    this.props.history.push(`/orderinfo`);
  }

  render() {
    const { redirectYourOrder, redirectYourLogin } = this.state;
    const { sumTotal } = this.props;
    console.log("tổng tiền", sumTotal)
    let amount = 0;
    let sumProduct = 0;
    let shippingTotal = 0;

    if (sumTotal.length > 0) {
      amount = sumTotal.reduce((sum, item) => {
        return sum += item.cartProductQuantity * item.product.unitprice * ((100 - item.product.discount) / 100)
      }, 0)

      sumProduct = sumTotal.reduce((sum, item) => {
        return sum += item.cartProductQuantity
      }, 0)
    }
    localStorage.setItem('total', amount);

    if (redirectYourOrder) {
      return <Redirect to="/checkout"></Redirect>
    }
    if (redirectYourLogin) {
      return <Redirect to="/login-register"></Redirect>
    }
    return (
      <div>
        <div className="cart-page-total">
          <h2>Tổng thanh toán</h2>
          <ul>
            <li>Sản phẩm <span>{sumProduct}</span></li>
            <li>Shipping <span>Miễn phí</span></li>
            <li style={{ color: 'red' }}>Tổng <span>{amount ? formatNumber(amount + shippingTotal) : 0}</span></li>
          </ul>
          <button style={{ cursor: "pointer" }} className="fix-text-checkout" onClick={() => this.checkAuthenticate()}>Mua ngay</button>
        </div>

      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    sumTotal: state.cart,
    //  address: state.address
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_address: (id) => {
      dispatch(actFetchAddressRequest(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SumTotal))
