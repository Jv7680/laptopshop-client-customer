import React, { Component } from 'react'
import TopTreddingProductItems from './TopTreddingProductItems';
import { connect } from 'react-redux'
import { actFetchProductsBestRequest } from '../../../../redux/actions/products';
import Slider from "react-slick";
import './style.css'

class TopTreddingProduct extends Component {
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

    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1
    };
    return (
      <section className="product-area li-trending-product pt-15">
        <div className="container">
          <div className="row">
            {/* Begin Li's Tab Menu Area */}
            <div className="col-lg-12">
              <div className="trending-laptop-title">
                <span>Top sản phẩm bán chạy</span>
              </div>
              {/* slider trending product */}
              <div className="slider-trending-product tab-content li-tab-content li-trending-product-content">
                {/* <div className="row"> */}
                <Slider {...settings}>
                  {products && products.length ? products.map((product, index) => {
                    return (
                      <div key={index} className="">
                        <TopTreddingProductItems product={product} ></TopTreddingProductItems>
                      </div>
                    )
                  }) : null
                  }
                </Slider>
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
    products: state.productsTopBestProduct
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_products_new: (page) => {
      dispatch(actFetchProductsBestRequest(page))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopTreddingProduct)
