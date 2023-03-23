import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { actGetProductRequest } from '../../../../redux/actions/products';
import { startLoading, doneLoading } from '../../../../utils/loading'
import { actAddCartRequest } from "../../../../redux/actions/cart"
import { actAddWishListRequest } from '../../../../redux/actions/wishlist'
import { connect } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import BeautyStars from 'beauty-stars';
import { getProductFirstImageURL } from '../../../../firebase/CRUDImage';
import './style.css'
import Swal from 'sweetalert2';
toast.configure()
let token, id;
id = parseInt(localStorage.getItem("_id"));

class TopTreddingProductItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      quantity: 1,
      imageURL: '',
    }
  }

  componentDidMount = async () => {
    let { productId } = this.props.product;
    let imageURL = await getProductFirstImageURL(productId);
    // console.log(`vào componentDidMount imageURL ${productId}:`, imageURL);

    if (imageURL === '') {
      this.setState({
        imageURL: process.env.PUBLIC_URL + '/images/logo/logoPTCustomer.png',
      });
    }
    else {
      this.setState({
        imageURL
      });
    }
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  }
  getInfoProduct = async (id) => {
    console.log("getInfoProduct id", id)
    await this.props.getInfoProduct(id);

    //Cần delay để tránh việc vào trang thông tin sản phẩm mà chưa call api xong
    setTimeout(() => {
      console.log('call api xong');
      this.props.history.push(`/products/${id}`);
    }, 250);

  }
  addItemToCart = product => {
    const { quantity } = this.state;

    token = localStorage.getItem("_auth");
    id = parseInt(localStorage.getItem("_id"));
    if (!token) {
      Swal.fire({
        returnFocus: false,
        icon: 'error',
        title: 'Lỗi',
        text: 'Bạn cần đăng nhập để thực hiện chức năng này!',
      })
      this.props.history.push(`/login`);
    }
    else {
      this.setState({
        redirectYourLogin: false
      })
      this.props.addCart(id, product, quantity, token);
    }

  };
  addItemToFavorite = (productId) => {
    startLoading()
    if (!id) {
      return toast.error('vui lòng đăng nhập !')
    }
    this.props.addWishList(id, productId);
    doneLoading();
  }


  render() {
    const { product } = this.props;
    const { imageURL } = this.state;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 50px' }}>
        <div className="single-product-wrap" style={{ width: '90%' }}>
          <div className="fix-img-div-new product-image">
            <img className="fix-img"
              src={imageURL}
              alt="Li's Product"
              onClick={(id) => this.getInfoProduct(product.productId)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            {
              product.discount === 0 ?
                (
                  null
                )
                :
                (
                  <span className="sticker">{product.discount}%</span>
                )
            }
          </div>
          <div className="product_desc">
            <div className="product_desc_info">
              <h4>
                <Link to='' className="product_name text-truncate" onClick={(id) => this.getInfoProduct(product.productId)} >{product.productName}</Link>
              </h4>
              {
                product.discount > 0 ?
                  (
                    <>
                      <span className="new-price new-price-2" style={{ color: 'black', textDecoration: "line-through" }}>
                        {product.unitprice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}  <span>&emsp;-{product.discount}%</span><br />
                        <span>Chỉ còn: {(product.unitprice * ((100 - product.discount) / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                      </span>

                    </>
                  )
                  :
                  (
                    <>
                      <span className="new-price new-price-2" style={{ color: 'black', textDecoration: "none" }}>
                        {product && product.unitprice ? product.unitprice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : null}<br />&emsp;
                      </span>
                    </>
                  )
              }

            </div>

            <div className="add-actions">
              <ul className="add-actions-link">
                {
                  product.quantity === 0 ?
                    (
                      <h5>Tạm Hết Hàng</h5>
                    )
                    :
                    (
                      <div style={{ marginLeft: '15px' }}>
                        <li className="add-cart active"><a onClick={() => this.addItemToCart(product)} >Thêm vào giỏ</a></li>
                        <li><a onClick={(id) => this.getInfoProduct(product.productId)} title="chi tiểt" className="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter"><i className="fa fa-eye" /></a></li>
                        {/* <li><Link to="#" onClick={() => this.addItemToFavorite(product.productId)} className="links-details" title="yêu thích" ><i className="fa fa-heart-o" /></Link></li> */}
                      </div>
                    )

                }
              </ul>
            </div>
          </div>
        </div >
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    getProduct: state.product
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInfoProduct: (id) => {
      dispatch(actGetProductRequest(id))
    },
    addCart: (idCustomer, product, quantity, token) => {
      dispatch(actAddCartRequest(idCustomer, product, quantity, token));
    },
    addWishList: (id, idProduct) => {
      dispatch(actAddWishListRequest(id, idProduct));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopTreddingProductItems))
