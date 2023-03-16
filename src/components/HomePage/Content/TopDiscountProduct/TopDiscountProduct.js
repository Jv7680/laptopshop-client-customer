import React, { Component } from 'react'
import TopDiscountProductItems from './TopDiscountProductItems'
import ProductItem from '../../../ProductAll/ProductItem';
import { connect } from 'react-redux'
import { actFetchProductsDiscountRequest } from '../../../../redux/actions/products';
import Slider from "react-slick";
import './style.css';

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1
};

class TopDiscountProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    }
  }

  componentDidMount() {
    const { page } = this.state;
    this.props.fetch_products_new(page);
  }

  render() {
    const { products } = this.props;

    return (
      <section className="product-area li-trending-product pt-30">
        <div className="container">
          <div className="row">
            {/* trending product title */}
            <div className="col-lg-12">
              <div className="trending-laptop-title">
                <span>Top sản phẩm giảm giá</span>
              </div>
              {/* slider discount product */}
              <div className="slider-discount-product tab-content li-tab-content li-trending-product-content">
                <Slider {...settings}>
                  {products && products.length ? products.map((product, index) => {
                    return (
                      <div key={index} className="">
                        <TopDiscountProductItems product={product} ></TopDiscountProductItems>
                      </div>
                    )
                  }) : null
                  }
                </Slider>
                {/* </div> */}
                {/* </div> */}
              </div>
              {/* Tab Menu Content Area End Here */}
            </div>
            {/* Tab Menu Area End Here */}
          </div>
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.productsTopDiscount
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_products_new: (page) => {
      dispatch(actFetchProductsDiscountRequest(page))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopDiscountProduct)
