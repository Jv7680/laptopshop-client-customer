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

  handleCallBack = (respone) => {
    const userInfor = jwtDecode(respone.credential) || "No infor got!!";
    console.log("userInfor", userInfor);
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
