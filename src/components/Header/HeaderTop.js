import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './style.css'
import { actTokenRequest } from '../../redux/actions/auth'
import { actFetchUserRequset, actFetchUser } from '../../redux/actions/user';
import { startLoading, doneLoading } from '../../utils/loading'
import { actFetchWishList } from '../../redux/actions/wishlist'
import store from '../..';
import { actFetchCart } from '../../redux/actions/cart';

class HeaderTop extends Component {

  componentDidMount = () => {
    if (localStorage.getItem('_auth') && localStorage.getItem('_id')) {
      this.props.fetch_user(localStorage.getItem('_id'));
    }
  }

  logOut = async () => {
    const token = null;

    //clear local storage
    localStorage.clear();

    //cập nhập lại giỏ hàng thành rỗng
    store.dispatch(actFetchCart([]));
    //cập nhập lại user rỗng
    store.dispatch(actFetchUser({}));
    //cập nhập lại wishlist rỗng
    store.dispatch(actFetchWishList([]));

    startLoading();
    await this.props.setTokenRedux(token);
    doneLoading();

    this.setState(this.state);
  }

  loadingPage = () => {
    startLoading();
    doneLoading();
  }

  render() {
    const { token, user } = this.props;
    const usernamelocal = localStorage.getItem('_username')
    console.log(user)

    return (
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <div className="header-top-left">
                <ul className="phone-wrap">
                  <li><span>Liên hệ:</span><a href="/">(+84) 945470158</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9 col-md-8">
              <div className="header-top-right">
                <ul className="ht-menu">

                  <li>
                    {
                      !token ?
                        (
                          <div className='right-header-top'>
                            <>
                              <Link to="/login" className="fix-link-color language-selector-wrapper"> Đăng nhập </Link>
                            </>
                            <>
                              <Link to="/register" className="fix-link-color language-selector-wrapper"> Đăng ký </Link>
                            </>
                          </div>
                        )
                        :
                        (
                          <div className="dropdown show">

                            <Link to="#" className=" fix-link-color dropdown-toggle navList__item-user-link" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <img src={user.image || user.imageLink || "https://i.ibb.co/NCdx7FF/avatar-Default.png"} className="navList__item-user-avatar"></img>
                              <div className="navList__item-user-name ml-10"> {user.lastname + " " + user.firstname || "not found"}</div>
                            </Link>
                            <div className="fix-text-item dropdown-menu ht-setting-list " aria-labelledby="dropdownMenuLink">
                              {
                                user.provider !== 3 &&
                                <Link className="fix-text-item dropdown-item" to="/profile">Cá nhân</Link>
                              }
                              <Link className="fix-text-item dropdown-item" to="/order/status1">Đơn Hàng</Link>
                              <Link onClick={this.logOut} to="/" className="fix-text-item dropdown-item">Đăng xuất</Link>
                            </div>
                          </div>
                        )
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    token: state.auth,
    user: state.user
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetch_user: (id) => {
      return dispatch(actFetchUserRequset(id))
    },
    setTokenRedux: (token) => {
      dispatch(actTokenRequest(token))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(HeaderTop)
