import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import { connect } from 'react-redux'
import { actFetchCartRequest } from '../../redux/actions/cart';
import { actGetProductOfKeyRequest } from '../../redux/actions/products'
import { actFetchWishListRequest } from '../../redux/actions/wishlist'
import { withRouter } from 'react-router-dom';
import Speech from './Speech';
import Modal from "react-modal";
import Keyboard from "react-simple-keyboard";

import './header-middle.css';
import "react-simple-keyboard/build/css/index.css";

let token, id;
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    height: "300px",
    maxHeight: "96vh",
    overflow: "auto",
  }
};

class HeaderMiddle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textSearch: '',
      layoutName: "default",
      openModalSpeech: false,
    }
  }

  componentDidMount = () => {
    //nếu chưa có key historySearch 1-5 thì tạo thêm
    for (let i = 1; i <= 5; i++) {
      if (!localStorage.getItem(`historySearch${i}`)) {
        localStorage.setItem(`historySearch${i}`, '');
      }
    }

    setTimeout(() => {
      let input = document.getElementsByClassName("input-search")[0];

      // Execute a function when the user presses a key on the keyboard
      input.addEventListener("keypress", (event) => {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.getElementsByClassName("li-btn")[0].click();
          // this.handleClick();
        }
      });
    }, 500);

    token = localStorage.getItem("_auth");
    id = localStorage.getItem("_id");
    if (token) {
      this.props.fetch_items(id);

      //tạm bỏ vì chưa có api
      //this.props.fetch_wishlist(id);
    }

  }


  handleChange = event => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });

    // set lại chuỗi input của keyboar để đồng bộ với việc nhập trực tiếp ở thanh input
    this.keyboard.setInput(value);
  }

  handleClick = async () => {
    const { textSearch } = this.state;
    if (textSearch === '' || textSearch === null) {
      //this.props.history.push(`/`);
      return toast.error('Vui lòng nhập sản phẩm cần tìm ...');
    }
    else {
      //mảng sau lưu 5 chuỗi search mới nhất
      let arrHistorySearch = [];
      for (let i = 1; i <= 5; i++) {
        //đưa data vào mảng, nếu ko tồn tại key thì gán rỗng
        arrHistorySearch[i - 1] = localStorage.getItem(`historySearch${i}`) || '';
      }
      console.log('arrHistorySearch: ', arrHistorySearch);

      //thêm chuỗi vừa tìm vào đầu arrHistorySearch
      //nếu chuỗi đã tồn tại trong danh sách thì xóa nó đi
      const findFunc = (element) => element === textSearch.trim();
      const foundIndex = arrHistorySearch.findIndex(findFunc);
      console.log('foundIndex:', foundIndex);
      //nếu tìm thấy
      if (foundIndex != -1) {
        //xóa chuỗi đó khỏi mảng
        arrHistorySearch.splice(foundIndex, 1);
        arrHistorySearch.unshift(textSearch.trim());
      }
      else {
        arrHistorySearch.unshift(textSearch.trim());
      }

      //cập nhật lại danh sách historySearch ở local storage
      for (let i = 1; i <= 5; i++) {
        localStorage.setItem(`historySearch${i}`, arrHistorySearch[i - 1]);
      }

      //delay để chờ ulHistorySearch cập nhật
      setTimeout(() => {
        //re render để giá trị mới trong local storage đc hiển thị lên UI
        this.setState(this.state);
      }, 1300);

      //startLoading();
      // let res = await this.props.searchProduct(textSearch);
      // console.log('searchProduct res: ', res);

      let res = await actGetProductOfKeyRequest(textSearch)();
      console.log('searchProduct res: ', res);
      //doneLoading();
      if (res) {
        this.props.history.push(`/search/${textSearch}`);
      }


    }

  }

  handleOnFocus = () => {
    console.log('handleOnFocus');
    document.getElementsByClassName("history-search")[0].style.display = "block";
  }

  handleOnBlur = () => {
    console.log('handleOnBlur');
    setTimeout(() => {
      document.getElementsByClassName("history-search")[0].style.display = "none";
    }, 150);
  }

  handleClickHS1 = () => {
    console.log('handleClickHS1');
    this.setState({
      textSearch: document.getElementsByClassName("history-search")[0].children[1].innerText,
    });

    setTimeout(() => {
      this.handleClick();
    }, 500);
  }

  handleClickHS2 = () => {
    this.setState({
      textSearch: document.getElementsByClassName("history-search")[0].children[2].innerText,
    });

    setTimeout(() => {
      this.handleClick();
    }, 500);
  }

  handleClickHS3 = () => {
    this.setState({
      textSearch: document.getElementsByClassName("history-search")[0].children[3].innerText,
    });

    setTimeout(() => {
      this.handleClick();
    }, 500);
  }

  handleClickHS4 = () => {
    this.setState({
      textSearch: document.getElementsByClassName("history-search")[0].children[4].innerText,
    });

    setTimeout(() => {
      this.handleClick();
    }, 500);
  }

  handleClickHS5 = (e) => {
    e.preventDefault();
    this.setState({
      textSearch: document.getElementsByClassName("history-search")[0].children[5].innerText,
    });

    setTimeout(() => {
      this.handleClick();
    }, 500);
  }

  showHideKeyboard = () => {
    let keyboar = document.getElementsByClassName('keyboard-component')[0]
    if (keyboar.classList.contains('keyboard-component--show')) {
      keyboar.classList.remove('keyboard-component--show');
    }
    else {
      keyboar.classList.add('keyboard-component--show');
    }
  }

  onChangeInputKeyboard = input => {
    this.setState({
      textSearch: input
    });
    // console.log("Input changed", input);
  };

  onKeyPress = button => {
    // console.log("Button pressed", button);
    if (button === "{shift}" || button === "{lock}") this.handleShift();
    if (button === "{enter}") this.handleClick();
  };

  handleShift = () => {
    const layoutName = this.state.layoutName;

    this.setState({
      layoutName: layoutName === "default" ? "shift" : "default"
    });
  };

  openModal = () => {
    document.getElementsByTagName('body')[0].classList.add('prevent-scroll-body');
    this.setState({
      openModalSpeech: true,
    });
  }

  closeModal = () => {
    document.getElementsByTagName('body')[0].classList.remove('prevent-scroll-body');
    this.setState({ openModalSpeech: false });
  }

  setTextSearch = (textSearch) => {
    this.setState({
      openModalSpeech: false,
      textSearch: textSearch
    },
      () => {
        this.handleClick();
      });
  }

  render() {
    setTimeout(() => {
      //ẩn các dòng historySearch empty
      let ulHistorySearch = document.getElementsByClassName("history-search")[0].children;
      // console.log("ulHistorySearch: ", ulHistorySearch);
      for (let i = 1; i <= 5; i++) {
        if (ulHistorySearch[i].innerText === '') {
          ulHistorySearch[i].style.display = "none";
        }
        else {
          ulHistorySearch[i].style.display = "list-item";
        }
      }
    }, 500);

    const { textSearch, openModalSpeech } = this.state;
    const { cart, xwishList } = this.props;
    const wishList = [];

    return (
      <div className="header-middle pl-sm-0 pr-sm-0 pl-xs-0 pr-xs-0">
        <div className="container">
          <div className="row">
            {/* Begin Header Logo Area */}
            <div className="col-lg-3">
              <div className="logo pb-sm-30 pb-xs-30">
                <Link to="/">
                  <img src={process.env.PUBLIC_URL + '/images/logo/logoPTCustomer.png'}
                    style={{
                      width: '180px',
                      height: '50px',
                      borderRadius: '5px',
                      boxShadow: 'inset 0 -3em 3em rgba(0,0,0,0.1),0 0  0 2px rgb(255,255,255), 0.3em 0.3em 1em rgba(0,0,0,0.3)'
                    }}
                    alt="" />
                </Link>
              </div>
            </div>
            {/* Header Logo Area End Here */}
            {/* Begin Header Middle Right Area */}
            <div className="col-lg-9 pl-0 ml-sm-15 ml-xs-15">
              {/* Begin Header Middle Searchbox Area */}
              <form className="hm-searchbox" autoComplete='off' >
                <input
                  className='input-search'
                  name="textSearch"
                  value={textSearch}
                  onChange={this.handleChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleOnBlur}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm ..." />
                <ul className='history-search'>
                  <li className='history-search__header'>Lịch sử tìm kiếm</li>
                  <li className='history-search__item' onClick={this.handleClickHS1}>{localStorage.getItem('historySearch1')}</li>
                  <li className='history-search__item' onClick={this.handleClickHS2}>{localStorage.getItem('historySearch2')}</li>
                  <li className='history-search__item' onClick={this.handleClickHS3}>{localStorage.getItem('historySearch3')}</li>
                  <li className='history-search__item' onClick={this.handleClickHS4}>{localStorage.getItem('historySearch4')}</li>
                  <li className='history-search__item' onClick={this.handleClickHS5}>{localStorage.getItem('historySearch5')}</li>
                </ul>
                <button className="li-btn"
                  type="button"
                  onClick={this.handleClick}>
                  <i className="fa fa-search" />
                </button>
                <button className="keyboard-btn"
                  type="button"
                  onClick={this.showHideKeyboard}
                >
                  <i className="fa-regular fa-keyboard"></i>
                </button>
                <div className='keyboard-component'>
                  <Keyboard
                    keyboardRef={r => (this.keyboard = r)}
                    layoutName={this.state.layoutName}
                    onChange={this.onChangeInputKeyboard}
                    onKeyPress={this.onKeyPress}
                  />
                </div>
                <button className="micro-btn"
                  type="button"
                  onClick={this.openModal}
                >
                  <i className="fa-solid fa-microphone"></i>
                </button>
              </form>
              {/* Header Middle Searchbox Area End Here */}
              {/* Begin Header Middle Right Area */}
              <div className="header-middle-right">
                <ul className="hm-menu">

                  {/* Begin Header Middle Wishlist Area */}
                  <li className="hm-wishlist">
                    <Link to="/wishlist">
                      <span className="cart-item-count wishlist-item-count">
                        {
                          wishList.length === 0 || !wishList ?
                            (
                              null
                            )
                            :
                            (
                              <span className="cart-item-count">
                                {wishList.length}
                              </span>
                            )
                        }
                      </span>
                      <i className="fa fa-heart-o" />
                    </Link>
                  </li>

                  {/* Header Middle Wishlist Area End Here */}
                  {/* Begin Header Mini Cart Area */}
                  <li className="hm-minicart">
                    <Link to="/cart">
                      <div className="hm-minicart-trigger">
                        <span
                          className="item-icon fa-cart-shopping"
                          style={{ margin: "auto auto" }}
                        >
                          {
                            cart.length === 0 || !cart ?
                              (
                                null
                              )
                              :
                              (
                                <span className="cart-item-count">
                                  {cart.length}
                                </span>
                              )
                          }
                        </span>
                      </div>
                    </Link>
                    <span />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={openModalSpeech}
          // isOpen={true}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Example Modal"
        >
          <span className="btn-close-modal" onClick={() => { this.closeModal() }}><i className="fa-solid fa-xmark"></i></span>
          <Speech setTextSearch={this.setTextSearch}></Speech>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    countWishList: state.wishlist
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchProduct: (key, page) => {
      dispatch(actGetProductOfKeyRequest(key, page))
    },
    fetch_items: (id) => {
      dispatch(actFetchCartRequest(id))
    },
    fetch_wishlist: (id) => {
      dispatch(actFetchWishListRequest(id))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderMiddle))
