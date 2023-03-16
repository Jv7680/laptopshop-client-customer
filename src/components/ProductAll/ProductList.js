import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import ProductItem from "./ProductItem";
import { connect } from "react-redux";
import { actFetchProductsRequest } from "../../redux/actions/products";
import callApi from '../../utils/apiCaller';
import Paginator from 'react-js-paginator';

import './style.css'

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            currentPage: 1,
        }
    }

    componentDidMount = async () => {
        await this.fetch_reload_data();
    }

    async fetch_reload_data() {
        await this.props.fetch_products().then(res => {
            this.setState({
                total: res.totalPage
            });
        }).catch(err => {
            console.log(err);
        })
    }

    async pageChange(content) {
        const page = content;
        await this.props.fetch_products(page);
        this.setState({
            currentPage: content
        })
        window.scrollTo(0, 0);
    }

    render() {
        let { products } = this.props;
        const { total } = this.state;
        console.log('filter in product', this.props.filter);
        console.log('sort in product', this.props.sort);
        return (
            <>
                <div className="row">
                    {products && products.length > 0
                        ? products.map((item, index) => {
                            return (
                                <ProductItem
                                    key={item.productId}
                                    product={item}
                                ></ProductItem>
                            );
                        })
                        :
                        null
                    }
                </div>
                <div className="paginatoin-area">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <p>Xem từ 1-12 sản phẩm</p>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <ul className="pagination-box">
                                <Paginator
                                    pageSize={1}
                                    totalElements={total}
                                    onPageChangeCallback={(e) => { this.pageChange(e) }}
                                />
                            </ul>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        products: state.products,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetch_products: (page) => {
            return dispatch(actFetchProductsRequest(page));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductList))
