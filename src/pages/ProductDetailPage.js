import React, { Component } from 'react'
import ProductViewDetail from '../components/ProductDetail/ProductViewDetail'
import LinkHere from '../components/LinkHere/LinkHere'
import { useEffect, useState } from 'react';

// export default class ProductDetailPage extends Component {
//   render() {
//     const url = this.props.match.match.url;
//     console.log('this.props.match:', this.props.match);
//     const { id } = this.props.match.match.params;
//     setTimeout(() => {
//       window.scrollTo(0, 0);
//     }, 100);
//     return (
//       <div>
//         <LinkHere url='/ Chi tiết sản phẩm'></LinkHere>
//         <ProductViewDetail id={id}></ProductViewDetail>
//       </div>
//     )
//   }
// }

export default function ProductDetailPage(props) {
  const url = props.match.match.url;
  console.log('this.props.match:', props.match);
  const [id, setId] = useState(props.match.match.params.id);;
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);

  useEffect(() => {
    // console.log(props.match);
    setId(props.match.match.params.id);
  }, [props.match.match.params.id]);

  return (
    <div> {console.log("render")}
      <LinkHere url='/ Chi tiết sản phẩm'></LinkHere>
      <ProductViewDetail id={id}></ProductViewDetail>
    </div>
  )
}