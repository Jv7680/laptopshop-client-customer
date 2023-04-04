import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import { actGetProductRequest } from '../../redux/actions/products';
import { actAddWishListRequest } from '../../redux/actions/wishlist'
import { actAddCartRequest } from "../../redux/actions/cart";
import { startLoading, doneLoading } from '../../utils/loading'
import { connect } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import BeautyStars from 'beauty-stars';
import './style.css'
import { set } from 'nprogress';
import Swal from "sweetalert2";
import { getProductFirstImageURL } from '../../firebase/CRUDImage';
import { async } from '@firebase/util';
toast.configure()
let token, id;
id = parseInt(localStorage.getItem("_id"));

class ProductItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      quantity: 1,
      productID: this.props.product.productId,
      imageURL: "",
    }
  }

  componentDidMount = async () => {
    let { productId } = this.props.product;
    // console.log('vào componentDidMount pItem:', productId);
    let imageURL = await getProductFirstImageURL(productId);
    // console.log(`vào componentDidMount imageURL ${productId}:`, imageURL);

    if (imageURL === '') {
      imageURL = process.env.PUBLIC_URL + '/images/logo/logoPTCustomer.png';
      document.getElementsByClassName(`image-product-${productId}`)[0].setAttribute('src', imageURL);
    }
    else {
      document.getElementsByClassName(`image-product-${productId}`)[0].setAttribute('src', imageURL);
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
      localStorage.setItem('_idproduct', id);
      this.props.history.push(`/products/${id}`);
    }, 250);

  }
  addItemToCart = product => {
    const { quantity } = this.state;
    id = parseInt(localStorage.getItem("_id"));
    token = localStorage.getItem("_auth");
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Bạn cần đăng nhập để thực hiện chức năng này!',
      })
      this.setState({
        redirectYourLogin: true
      })
    }
    else {
      this.setState({
        redirectYourLogin: false
      })
      this.props.addCart(id, product, quantity);
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
    const { quantity, redirectYourLogin, imageURL } = this.state;

    console.log('vào render');

    if (redirectYourLogin) {
      return <Redirect to='/login'></Redirect>
    }

    return (
      <div className="col-lg-3 col-md-4 col-sm-6 mt-30">
        {/* single-product-wrap start */}
        <div className="single-product-wrap">
          <div className="fix-img-div-for-item product-image">
            <img
              className={`fix-img image-product-${product.productId}`}
              src=''
              alt={'/images/logo/logoPTCustomer.png'}
              onClick={(id) => this.getInfoProduct(product.productId)}
              style={{ cursor: "pointer" }}
            />
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
                <Link to='' className="product_name text-truncate" onClick={(id) => this.getInfoProduct(product.productId)} style={{ cursor: "pointer" }}>{product.productName}</Link>
              </h4>
              {
                product.discount > 0 ?
                  (
                    <>
                      <span className="new-price new-price-2" style={{ color: 'black', textDecoration: "line-through", userSelect: "none" }}>
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
              {/* {
                product.quantity === 0 ?
                  (
                    null
                  )
                  :
                  (
                    product.discount > 0 ?
                      (
                        <>
                          <p className="new-price new-price-2" style={{ color: 'black', textDecoration: "line-through" }}>
                            {product.unitprice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}  <span>&emsp;-{product.discount}%</span><br />
                            <span>Chỉ còn: {(product.unitprice * ((100 - product.discount) / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                          </p>

                        </>
                      )
                      :
                      (
                        <>
                          <span className="new-price new-price-2" style={{ color: 'black', textDecoration: "none" }}>
                            {product && product.unitprice ? product.unitprice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : null}
                          </span>
                        </>
                      )
                  )
              } */}

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
                      <div>
                        <li className="add-cart active"><a style={{ cursor: "pointer" }} onClick={() => this.addItemToCart(product)} >Thêm vào giỏ</a></li>
                        <li><a style={{ cursor: "pointer" }} onClick={(id) => this.getInfoProduct(product.productId)} title="chi tiểt" className="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter"><i className="fa fa-eye" /></a></li>
                        <li><a style={{ cursor: "pointer" }} onClick={() => this.addItemToFavorite(product.productId)} className="links-details" title="yêu thích" ><i className="fa fa-heart-o" /></a></li>
                      </div>
                    )

                }
              </ul>
            </div>
          </div>
        </div>

        {/*// QUICK VIEW */}

        {/* single-product-wrap end */}
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
    addCart: (idCustomer, product, quantity) => {
      dispatch(actAddCartRequest(idCustomer, product, quantity));
    },
    addWishList: (id, idProduct) => {
      dispatch(actAddWishListRequest(id, idProduct));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductItem))
