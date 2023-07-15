import React, { Component } from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import store from "../..";
import { actFetchOrdersRequest } from "../../redux/actions/order";
import { actGetProductRequest } from "../../redux/actions/products";
import callApi from "../../utils/apiCaller";
import { is_empty } from "../../utils/validations";


const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%"
  }
};

let currentId;
class RatingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmtContent: '',
      cmtRating: 1,
      modalIsOpen: false,
      bought: false,
    }
  }

  componentDidMount = async () => {
    currentId = this.props.product.productId;
    let allProductHaveBought = await this.getAllIdProductHaveBought(parseInt(localStorage.getItem("_idaccount")));
    let thisProductHasBought = allProductHaveBought.find(element => element === this.props.product.productId);

    if (thisProductHasBought) {
      console.log("mua rồi");
      this.setState({
        bought: true
      });
    }
    else {
      this.setState({
        bought: false
      });
    }
  }

  componentDidUpdate = async () => {
    console.log("componentDidUpdate", currentId, this.props.product.productId);
    if (currentId !== this.props.product.productId) {
      currentId = this.props.product.productId;
      let allProductHaveBought = await this.getAllIdProductHaveBought(parseInt(localStorage.getItem("_idaccount")));
      let thisProductHasBought = allProductHaveBought.find(element => element === this.props.product.productId);

      if (thisProductHasBought) {
        console.log("mua rồi");
        this.setState({
          bought: true
        });
      }
      else {
        this.setState({
          bought: false
        });
      }
    }
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  }

  openModalSubmitCMT = () => {
    this.setState({ modalIsOpen: true });
  }

  closeModalSubmitCMT = () => {
    this.setState({ modalIsOpen: false });
  }

  handleSubmitCMT = (event) => {
    let { cmtContent, cmtRating } = this.state;
    let idOrder = localStorage.getItem('_orderId');
    let idAccount = localStorage.getItem('_idaccount');
    let idProduct = localStorage.getItem('_idproduct');

    let token = localStorage.getItem('_auth');
    //chưa đăng nhập
    if (!token) {
      Swal.fire({
        returnFocus: false,
        icon: 'error',
        title: 'Lỗi',
        text: 'Bạn cần đăng nhập để thực hiện chức năng này!',
      })
      this.props.history.push(`/login`);
      return;
    }

    let body = {
      accountId: parseInt(idAccount),
      productId: parseInt(idProduct),
      contents: cmtContent,
      rate: cmtRating,
    }

    //gọi api
    let res = callApi('reviews', 'POST', body, token)
      .then(result => {
        toast.success('Đánh giá thành công.');
        console.log('handleSubmitCMT result', result);

        //cập nhật lại sản phẩm hiện tại
        store.dispatch(actGetProductRequest(idProduct));
      });
  }


  handleOnclickRating = (startRating) => {
    //1 sao
    if (startRating === 20) {
      this.setState({
        cmtRating: 1,
      });
    }
    //2 sao
    else if (startRating === 40) {
      this.setState({
        cmtRating: 2,
      });
    }
    //3 sao
    else if (startRating === 60) {
      this.setState({
        cmtRating: 3,
      });
    }
    //4 sao
    else if (startRating === 80) {
      this.setState({
        cmtRating: 4,
      });
    }
    //5 sao
    else if (startRating === 100) {
      this.setState({
        cmtRating: 5,
      });
    }

    setTimeout(() => {
      console.log('cmtRating:', this.state.cmtRating);
    }, 1000);
  }

  getAllIdProductHaveBought = async (userId) => {
    let result = [];
    let productIdArr = [];
    let resultAPI = await store.dispatch(actFetchOrdersRequest(4, userId));
    // console.log("resultAPI", resultAPI);

    resultAPI.listOrders.forEach(order => {
      order.lstOrdersDetail.forEach(product => {
        productIdArr.push(product.productId);
      });
    });

    result = [...productIdArr.filter((value, index) => productIdArr.indexOf(value) === index)];
    // console.log("result", result);
    return result;
  }

  render() {
    const { commented, rating, listReviews } = this.props;
    const { modalIsOpen } = this.state;
    let token = localStorage.getItem('_auth');

    let count = 0;
    let showFixRating = "0";

    let oneStart = 0;
    let twoStart = 0;
    let threeStart = 0;
    let fourStart = 0;
    let fiveStart = 0;

    let showOneStart = 0;
    let showTwoStart = 0;
    let showThreeStart = 0;
    let showFourStart = 0;
    let showFiveStart = 0;

    showFixRating = is_empty(rating) ? 0 : rating;
    showFixRating = showFixRating.toFixed(1);

    if (listReviews && listReviews.length > 0) {
      listReviews.forEach(item => {
        if (item.rating === 1) {
          oneStart++;
        }
        if (item.rating === 2) {
          twoStart++;
        }
        if (item.rating === 3) {
          threeStart++;
        }
        if (item.rating === 4) {
          fourStart++;
        }
        if (item.rating === 5) {
          fiveStart++;
        }
        count++;
      })

      // console.log('1 sao có:', oneStart);
      // console.log('list review:', listReviews);

      showOneStart = ((oneStart / count) * 100).toFixed(0);
      showTwoStart = ((twoStart / count) * 100).toFixed(0);
      showThreeStart = ((threeStart / count) * 100).toFixed(0);
      showFourStart = ((fourStart / count) * 100).toFixed(0);
      showFiveStart = ((fiveStart / count) * 100).toFixed(0);
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4>Đánh giá sản phẩm</h4>
          </div>
          <div className="col-md-5">
            <div className="rating-block">
              <h2 className="bold padding-bottom-7">
                {showFixRating}
                <small>/5</small>
              </h2>
              <div>
                {/* <BeautyStars
                  size={12}
                  editable={false}
                  activeColor={"#ed8a19"}
                  inactiveColor={"#c1c1c1"}
                  value={showFixRating}
                /> */}
                <Rating
                  initialValue={showFixRating}
                  readonly={true}
                />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="pull-left">
              <div
                className="pull-left"
                style={{ width: "35px", lineHeight: 1 }}
              >
                <div style={{ height: "9px", margin: "5px 0" }}>
                  {" "}
                  <img
                    src="https://i.ibb.co/2KKnLBh/148839.png"
                    style={{ height: 15 }}
                    alt="not found"
                  />{" "}
                  5 <span className="glyphicon glyphicon-star" />
                </div>
              </div>
              <div className="pull-left" style={{ width: "180px" }}>
                <div
                  className="progress"
                  style={{ height: "9px", margin: "8px 0" }}
                >
                  <div
                    className="progress-bar progress-bar-success"
                    role="progressbar"
                    aria-valuenow={5}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    style={{ width: `${showFiveStart}%` }}

                  >
                    <span className="sr-only">
                      80% Complete (danger)
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="pull-right"
                style={{ marginLeft: "10px" }}
              >
                {fiveStart}
              </div>
            </div>
            <div className="pull-left">
              <div
                className="pull-left"
                style={{ width: "35px", lineHeight: 1 }}
              >
                <div style={{ height: "9px", margin: "5px 0" }}>
                  {" "}
                  <img
                    src="https://i.ibb.co/2KKnLBh/148839.png"
                    style={{ height: 15 }}
                    alt="not found"
                  />{" "}
                  4 <span className="glyphicon glyphicon-star" />
                </div>
              </div>
              <div className="pull-left" style={{ width: "180px" }}>
                <div
                  className="progress"
                  style={{ height: "9px", margin: "8px 0" }}
                >
                  <div
                    className="progress-bar progress-bar-success"
                    role="progressbar"
                    aria-valuenow={5}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    style={{ width: `${showFourStart}%` }}

                  >
                    <span className="sr-only">
                      80% Complete (danger)
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="pull-right"
                style={{ marginLeft: "10px" }}
              >
                {fourStart}
              </div>
            </div>
            <div className="pull-left">
              <div
                className="pull-left"
                style={{ width: "35px", lineHeight: 1 }}
              >
                <div style={{ height: "9px", margin: "5px 0" }}>
                  {" "}
                  <img
                    src="https://i.ibb.co/2KKnLBh/148839.png"
                    style={{ height: 15 }}
                    alt="not found"
                  />{" "}
                  3 <span className="glyphicon glyphicon-star" />
                </div>
              </div>
              <div className="pull-left" style={{ width: "180px" }}>
                <div
                  className="progress"
                  style={{ height: "9px", margin: "8px 0" }}
                >
                  <div
                    className="progress-bar progress-bar-success"
                    role="progressbar"
                    aria-valuenow={5}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    style={{ width: `${showThreeStart}%` }}

                  >
                    <span className="sr-only">
                      80% Complete (danger)
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="pull-right"
                style={{ marginLeft: "10px" }}
              >
                {threeStart}
              </div>
            </div>
            <div className="pull-left">
              <div
                className="pull-left"
                style={{ width: "35px", lineHeight: 1 }}
              >
                <div style={{ height: "9px", margin: "5px 0" }}>
                  {" "}
                  <img
                    src="https://i.ibb.co/2KKnLBh/148839.png"
                    style={{ height: 15 }}
                    alt="not found"
                  />{" "}
                  2 <span className="glyphicon glyphicon-star" />
                </div>
              </div>
              <div className="pull-left" style={{ width: "180px" }}>
                <div
                  className="progress"
                  style={{ height: "9px", margin: "8px 0" }}
                >
                  <div
                    className="progress-bar progress-bar-success"
                    role="progressbar"
                    aria-valuenow={5}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    style={{ width: `${showTwoStart}%` }}

                  >
                    <span className="sr-only">
                      80% Complete (danger)
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="pull-right"
                style={{ marginLeft: "10px" }}
              >
                {twoStart}
              </div>
            </div>
            <div className="pull-left">
              <div
                className="pull-left"
                style={{ width: "35px", lineHeight: 1 }}
              >
                <div style={{ height: "9px", margin: "5px 0" }}>
                  {" "}
                  <img
                    src="https://i.ibb.co/2KKnLBh/148839.png"
                    style={{ height: 15 }}
                    alt="not found"
                  />{" "}
                  1 <span className="glyphicon glyphicon-star" />
                </div>
              </div>
              <div className="pull-left" style={{ width: "180px" }}>
                <div
                  className="progress"
                  style={{ height: "9px", margin: "8px 0" }}
                >
                  <div
                    className="progress-bar progress-bar-success"
                    role="progressbar"
                    aria-valuenow={5}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    style={{ width: `${showOneStart}%` }}

                  >
                    <span className="sr-only">
                      80% Complete (danger)
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="pull-right"
                style={{ marginLeft: "10px" }}
              >
                {oneStart}
              </div>
            </div>

          </div>
          <div className="col-md-4 submit-rating-area">
            {
              !token ?
                (
                  <span className="bold">Bạn cần đăng nhập để đánh giá sản phẩm này</span>
                )
                :
                (
                  !this.state.bought ?
                    (
                      <span className="bold">Hãy mua sản phẩm để được đánh giá bạn nhé!</span>
                    )
                    :
                    (
                      commented ?
                        (
                          <span className="bold">Bạn đã đánh giá sản phẩm này</span>
                        )
                        :
                        (
                          <>
                            <span className="bold">Bạn chưa đánh giá sản phẩm này</span>
                            <button className="btn-submit-rating" type="button" onClick={() => { this.openModalSubmitCMT() }}>Gửi đánh giá</button>
                            <Modal
                              isOpen={modalIsOpen}
                              onRequestClose={this.closeModalSubmitCMT}
                              style={modalStyles}
                              ariaHideApp={false}
                              contentLabel="Example Modal"
                            >
                              <div className="cmtArea">
                                <br />
                                <span
                                  style={{ fontSize: "15px", fontWeight: "bold" }}
                                >
                                  Bạn chưa đánh giá sản phẩm này.
                                </span>
                                <br />
                                <span
                                  style={{ marginLeft: "20px" }}
                                >
                                  Đánh giá:&emsp;
                                  <Rating
                                    initialValue={1}
                                    readonly={false}
                                    size={18}
                                    onClick={(startRating) => { this.handleOnclickRating(startRating) }}
                                  />
                                  {null}
                                </span>
                                <textarea placeholder="Nhập comment của bạn"
                                  rows="5"
                                  name="cmtContent"
                                  value={this.state.cmtContent}
                                  onChange={this.handleChange}
                                  style={{ resize: "none", marginLeft: "20px" }}
                                >
                                </textarea>
                                <br />
                                <button
                                  className="btn btn-primary"
                                  onClick={this.handleSubmitCMT}
                                  style={{ marginLeft: "20px" }}
                                >
                                  Gửi
                                </button>
                                <button onClick={this.closeModalSubmitCMT} className="btn-close-rating-modal">
                                  Thoát
                                </button>
                                <br />
                                <br />
                              </div>
                            </Modal>
                          </>
                        )
                    )
                )

            }
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    product: state.product,
  };
};

export default connect(mapStateToProps, undefined)(withRouter(RatingView));
