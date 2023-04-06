import React, { Component } from "react";
import ProductItem from "./ProductItem";
import { connect } from "react-redux";
import { actFetchProductsRequest } from "../../redux/actions/products";
import Paginator from 'react-js-paginator';
import FilterProduct from "./FilterProduct";
import SortProduct from "./SortProduct";
import ProductList from "./ProductList";
import { withRouter } from 'react-router-dom';


class ProductAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      currentPage: 1,
      //filter hiện tại
      filter: {
        priceRange: {
          fromPriceRange: 0,
          toPriceRange: 100000000
        },
        screenSize: {
          sz116: false,
          sz13: false,
          sz133: false,
          sz134: false,
          sz135: false,
          sz14: false,
          sz145: false,
          sz156: false,
          sz16: false,
          sz161: false,
          sz17: false,
          sz173: false,
          sz18: false,
        },
        producer: {
          pAcer: false,
          pAsus: false,
          pAvita: false,
          pDell: false,
          pGigabyte: false,
          pHP: false,
          pHuawei: false,
          pLG: false,
          pLenovo: false,
          pMSI: false,
        },
        cpu: {
          celeron: false,
          pentium: false,
          snapdragon: false,
          coreI3: false,
          coreI5: false,
          coreI7: false,
          coreI9: false,
          ryzen3: false,
          ryzen5: false,
          ryzen7: false,
          ryzen9: false,
        },
        ram: {
          ram4: false,
          ram8: false,
          ram16: false,
          ram32: false,
        },
        ssd: {
          ssd1: false,
          ssd512: false,
          ssd256: false,
          ssd128: false,
        },
        graphicCard: {
          gcAMDRadeonR5520: false,
          gcGTX1650: false,
          gcGTX1650Ti: false,
          gcGeForceMX130: false,
          gcGeForceMX330: false,
          gcRTX1650: false,
          gcRTX2050: false,
        },
      },
      //sort hiện tại
      sort: {
        pricesGoUp: false,
        pricesGoDown: false,
        mostSold: false,
      }
    };

  }

  componentWillUnmount = () => {
    console.log("componentWillUnmount");
  }

  updateFilter = (newFilter) => {
    this.setState({
      filter: newFilter,
    });
  }

  updateSort = (newSort) => {
    this.setState({
      sort: newSort,
    });
  }

  render() {
    const { total, filter, sort } = this.state;
    let { keySearch } = this.props; console.log("keySearch", keySearch);

    return (
      <div className="content-wraper pb-60">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* Begin Li's Banner Area */}
              {
                this.props.history.location.pathname === "/products" && (
                  <div className="single-banner shop-page-banner  pt-60">
                    <a href="/">
                      <img
                        src={process.env.PUBLIC_URL + '/images/bannerproductpage.png'}
                        alt="Li's Static Banner"
                      />
                    </a>
                  </div>
                )
              }
              {/* Li's Banner Area End Here *presentation/} */}

              {/* row chứa phần filter và list sản phẩm */}
              <div className="row ">
                {/* Cột chứa phần filter */}
                <FilterProduct updateFilter={this.updateFilter}></FilterProduct>

                {/* Cột chứa danh sách sản phẩm và sort, trong cột này có 1 row cho phần sort và 1 cho phần danh sách*/}
                <div className="col shop-products-wrapper">
                  <SortProduct updateSort={this.updateSort}></SortProduct>
                  <div className="tab-content">
                    <div
                      id="grid-view"
                      className="tab-pane fade active show"
                      role="tabpanel"
                    >
                      <div className="product-area shop-product-area">
                        <ProductList filter={filter} sort={sort} keySearch={keySearch}></ProductList>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
            {/* shop-products-wrapper end */}
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     products: state.products,
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     fetch_products: (page) => {
//       return dispatch(actFetchProductsRequest(page));
//     }
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ProductAll);
export default withRouter(ProductAll);
