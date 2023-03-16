import React, { Component } from "react";
import routes from "./routes";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { connect } from "react-redux";
import { actTokenRequest } from "./redux/actions/auth";
import { css } from '@emotion/core';
import { actShowLoading } from "./redux/actions/loading";
import Chat from "./components/Chat/Chat";
import ButtonGoTop from "./components/ButtonGoTop/ButtonGoTop";

import ClipLoader from 'react-spinners/ClipLoader';
import PulseLoader from 'react-spinners/PulseLoader';
import ActiveAccount from "./components/LoginRegister/ActiveAccount";
import OrderInfo from "./components/Order/OrderInfo";

import Loading from "./components/Loading/Loading";
import { startLoading, stopLoading } from "./components/Loading/setLoadingState";
import './app.css'

const cssPulseLoader = css`
    margin: auto;
    z-index: 9999;
    display: block;
`;

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem("_auth");
    this.props.add_token_redux(token);
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
          <Header></Header>
          {this.showContentMenus(routes)}
          <Footer></Footer>
          <Chat></Chat>
          <ButtonGoTop></ButtonGoTop>
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
