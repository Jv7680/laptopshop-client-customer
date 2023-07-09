import { css } from '@emotion/core';
import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ButtonGoTop from "./components/ButtonGoTop/ButtonGoTop";
import Chat from "./components/Chat/Chat";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { actTokenRequest } from "./redux/actions/auth";
import { actShowLoading } from "./redux/actions/loading";
import routes from "./routes";
import GlobalHistory from './utils/components/GlobalHistory';
import { actLoginGoogleRequest, actRegisterGoogleRequest } from './redux/actions/auth';
import validateLoginRegister from './utils/validations/validateLoginRegister';
import store from '.';
import Swal from 'sweetalert2';
import './app.css';
import Loading from "./components/Loading/Loading";
import jwtDecode from "jwt-decode";

const cssPulseLoader = css`
    margin: auto;
    z-index: 9999;
    display: block;
`;

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem("_auth");
    this.props.add_token_redux(token);

    window.onload = () => {
      window.google.accounts.id.initialize({
        client_id: "719600623259-ub1lq10i7fgmqnv2hh84dkjbt7266sur.apps.googleusercontent.com",
        callback: this.handleCallBack,
      });
    };
  }

  handleCallBack = async (respone) => {
    const userInfor = jwtDecode(respone.credential) || "No infor got!!";
    console.log("userInfor", userInfor);

    const res = await store.dispatch(actLoginGoogleRequest(userInfor.email));
    // call register
    if (!res) {
      Swal.fire({
        title: "Thêm thông tin của bạn!",
        showDenyButton: true,
        confirmButtonText: "Xác nhận",
        denyButtonText: "Hủy",
        allowOutsideClick: false,
        html: `<div class="container-fluid">
                  <div class="row">
                      <div class="col-md-12 mb-20">
                          <label style="text-align: left; display: block;">SĐT *</label>
                          <input
                              id="sweet-input-phonenumber"
                              class="mb-0"
                              type="text"
                              name="phonenumber"
                              placeholder="Nhập số điện thoại (10 số) " />
                      </div>
                      <div class="col-md-12 mb-20">
                          <label style="text-align: left; display: block;">Địa chỉ*</label>
                          <input
                              id="sweet-input-address"
                              class="mb-0"
                              type="text"
                              name="address"
                              placeholder="Địa chỉ" />
                      </div>
                  </div>
              </div>`,
        preConfirm: async () => {
          let phonenumber = document.getElementById("sweet-input-phonenumber").value;
          let address = document.getElementById("sweet-input-address").value;

          //check lỗi
          if (!validateLoginRegister.phonenumber(phonenumber) || !validateLoginRegister.address(address)) {
            return false;
          }

          let user = { ...userInfor, phonenumber, address }
          const resRegister = await store.dispatch(actRegisterGoogleRequest(user));
          console.log("resRegister", resRegister);
        },
      }).then(async (result) => {
        console.log("result Swal", result);
        if (result.isConfirmed) {

        }
        else {
          // formik.resetForm();
        }
      });
    }
  }

  render() {
    // const { loading } = this.props;
    // const loading = true;
    return (
      <Router>
        <>
          {/* hiệu ứng load trang */}
          <Loading loadingCSS={cssPulseLoader}></Loading>
        </>
        <div className="wrap">
          {/* <button onClick={() => { updateSeenStatus(6, 1, true) }}>true</button>
          <button onClick={() => { updateSeenStatus(6, 1, false) }}>false</button> */}
          <Header></Header>
          {this.showContentMenus(routes)}
          <Footer></Footer>
          <Chat></Chat>
          <ButtonGoTop></ButtonGoTop>
          <GlobalHistory />
        </div>
      </Router>
    )
  }
  showContentMenus = routes => {
    let result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        );
      });
    }
    return <Switch>{result}</Switch>;
  };
}
// const mapStateToProps = (state) => {
//   return {
//     // loading: state.loading
//   }
// }
const mapDispatchToProps = dispatch => {
  return {
    add_token_redux: token => {
      dispatch(actTokenRequest(token));
    },
    statusLoading: () => {
      dispatch(actShowLoading());
    }
  };
}

export default connect(undefined, mapDispatchToProps)(App);
