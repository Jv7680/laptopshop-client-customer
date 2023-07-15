import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { actLoginRequest } from '../../redux/actions/auth';
import { doneLoading, startLoading } from '../../utils/loading';
import validateLoginRegister from '../../utils/validations/validateLoginRegister';
import GoogleButton from './GoogleButton';
import store from '../..';
import "./style.css";
toast.configure()

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "tin@gmail.com",
      password: "123456",

    }
  }

  componentDidMount = () => {
    setTimeout(() => {
      window.scrollTo(0, 210);
    }, 100);
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleLoginGoogle = async event => {
    event.preventDefault();
    window.location.replace("http://banlinhkienpt.us-west-2.elasticbeanstalk.com/oauth2/authorize/google");
  }

  handleSubmit = async event => {
    event.preventDefault();

    console.log(event)
    const { username, password } = this.state;

    //check lỗi
    if (!validateLoginRegister.gmail(username) || !validateLoginRegister.password(password)) {
      return;
    }

    const user = {
      username,
      password
    }
    console.log(user)
    startLoading();
    // await this.props.loginRequest(user);
    let result = await store.dispatch(actLoginRequest(user));
    console.log("result login", result);
    doneLoading();

    setTimeout(() => {
      const errorCode = localStorage.getItem('errorCode');
      console.log('errorCode: ', errorCode);
      if (errorCode === 'Tài khoản chưa kích hoạt. Vui lòng kiểm tra lại email để hoàn tất đăng kí') {
        this.props.history.push(`/activeaccount`);
      }
    }, 1000);

  }


  render() {
    const { username, password } = this.state;
    const { user } = this.props;
    if (user !== null) {
      return <Redirect to="/"></Redirect>
    }

    return (
      <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6 mb-30">
        {/* Login Form s*/}
        <form >
          <div className="login-form">
            <h4 className="login-title">Đăng nhập</h4>
            <div className="row">
              <div className="col-md-12 col-12 mb-20">
                <label>Gmail *</label>
                <input
                  value={username}
                  onChange={this.handleChange}
                  className="mb-0"
                  type="email"
                  placeholder="Nhập gmail"
                  name='username'
                />
              </div>
              <div className="col-12 mb-20">
                <label>Mật khẩu</label>
                <input
                  value={password}
                  onChange={this.handleChange}
                  className="mb-0"
                  type="password"
                  placeholder="Mật khẩu"
                  name='password'
                />
              </div>
              <div className="col-md-8">
                <div className="check-box d-inline-block ml-0 ml-md-2 mt-10">
                  <Link to="/register"> Đăng ký</Link>
                  {/* <Link to="/activeaccount"> Đăng ký</Link> */}

                </div>
              </div>
              <div className="col-md-4 mt-10 mb-20 text-left text-md-right">
                <Link to="/forgot-password"> Quên mật khẩu</Link>
              </div>
              <div className="col-md-4">
                <button onClick={(event) => this.handleSubmit(event)} className="register-button mt-0 mb-3" value="Login">Đăng nhập</button>
              </div>
              <div className="col-md-3"></div>
              <div className="col-md-5">
                <GoogleButton />
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
    user: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginRequest: (user) => {
      dispatch(actLoginRequest(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))
