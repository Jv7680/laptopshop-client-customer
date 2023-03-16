import React, { Component } from 'react'
import LinkHere from '../components/LinkHere/LinkHere'
import ProductAll from '../components/ProductAll/ProductAll'
export default class ProductPage extends Component {
  render() {
    const url = this.props.match.match.url;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return (
      <div>
        <LinkHere url='/ Sản phẩm'></LinkHere>
        <ProductAll></ProductAll>
      </div>
    )
  }
}

