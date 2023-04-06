import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actGetProductOfKeyRequest } from '../../redux/actions/products';
import Paginator from 'react-js-paginator';
import ProductItem from "./../ProductAll/ProductItem";
import ProductAll from './ProductAll';

let categoryId;
class ProductSearch extends Component {
  render() {
    let { keySearch } = this.props;
    return (
      <>
        <ProductAll keySearch={keySearch}></ProductAll>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
    search: state.search
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_products: (key, page) => {
      return dispatch(actGetProductOfKeyRequest(key, page));
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(ProductSearch)

