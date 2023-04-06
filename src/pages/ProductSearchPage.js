import React, { Component } from 'react'
import LinkHere from '../components/LinkHere/LinkHere'
import ProductSearch from '../components/ProductAll/ProductSearch'
export default class ProductSearchPage extends Component {
  render() {
    console.log("keySearch from this.props.match", this.props.match.match.params.key);
    // const url = this.props.match.match.url;
    const keySearch = this.props.match.match.params.key;

    return (
      <div>
        <LinkHere url='/ Tìm kiếm'></LinkHere>
        <ProductSearch keySearch={keySearch}></ProductSearch>
      </div>
    )
  }
}

