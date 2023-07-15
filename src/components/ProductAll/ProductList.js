import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import ProductItem from "./ProductItem";
import { connect } from "react-redux";
import { actFetchProductsRequest, actGetProductOfKeyRequest, actFetchProducts, actFetchKeySearch } from "../../redux/actions/products";
import { actFetchFilterData } from '../../redux/reducers/filterData';
import store from '../..';
import callApi from '../../utils/apiCaller';
import Paginator from 'react-js-paginator';

import './style.css'

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            currentPage: 1,
            currentKeySearch: "",
        }
    }

    componentDidMount = async () => {
        // trường hợp vào trang products
        if (this.props.history.location.pathname === "/products") {
            await store.dispatch(actFetchFilterData([]));
            await this.fetch_reload_data();
        }
        // trường hợp vào trang search
        else {
            await store.dispatch(actFetchFilterData([]));
            await this.fetch_reload_data_search_page();
        }
    }

    componentDidUpdate = () => {
        console.log("componentDidUpdate");
        let { keySearch } = this.props;
        let { currentKeySearch } = this.state;
        if (keySearch && keySearch !== currentKeySearch) {
            this.fetch_reload_data_search_page();
        }

        // console.log("page là:", this.state.currentPage);
        // if (this.props.filterData && this.props.filterData.length > 0 && this.state.currentPage !== 1) {
        //     this.setState({
        //         currentPage: 1
        //     });
        // }
    }

    async fetch_reload_data() {
        await this.props.fetch_products().then(res => {
            console.log("fetch_reload_data", res);
            this.setState({
                total: res.totalPage
            });
        }).catch(err => {
            console.log(err);
        })
    }

    async fetch_reload_data_search_page() {
        let { keySearch } = this.props; console.log("keySearch", keySearch);
        // mới vào search sẽ clear products
        const newKeyPage = { key: keySearch, totalPage: 1 };
        if (keySearch !== this.state.currentKeySearch && this.props.products.length !== 0) {
            await store.dispatch(actFetchProducts([]));
        }

        // await store.dispatch(actFetchKeySearch(newKeyPage));

        this.setState({
            currentKeySearch: keySearch,
        }, async () => {
            let res = await actGetProductOfKeyRequest(keySearch)();

            console.log("fetch_reload_data_keySearch", res);

            this.setState({
                total: res.totalPage,
            });
        });
    }

    async pageChange(content) {
        const page = content;
        // trường hợp vào trang search thì ko get lại data mặc định
        if (this.props.history.location.pathname === "/products") {
            await this.props.fetch_products(page);
            this.setState({
                currentPage: page
            });
        }
        else {
            let { keySearch } = this.props;
            let res = await actGetProductOfKeyRequest(keySearch, page)();
            console.log("fetch_reload_data_keySearch_changePage", res);
            this.setState({
                currentPage: page
            });
        }
        window.scrollTo(0, 0);
    }

    sortByNewestProduct = (a, b) => {
        let x = a.productId;
        let y = b.productId;
        return y - x;
    }

    sortByPricesGoUp = (a, b) => {
        let x = a.unitprice * ((100 - a.discount) / 100);
        let y = b.unitprice * ((100 - b.discount) / 100);
        return x - y;
    }

    sortByPricesGoDown = (a, b) => {
        let x = a.unitprice * ((100 - a.discount) / 100);
        let y = b.unitprice * ((100 - b.discount) / 100);
        return y - x;
    }

    sortByMostSold = (a, b) => {
        let x = a.soldQuantity;
        let y = b.soldQuantity;
        return y - x;
    }

    render() {
        let { products, filterData, sort } = this.props;
        const { total } = this.state;
        console.log('filter in product', this.props.filter);
        console.log('sort in product', this.props.sort);

        if (filterData && filterData.length > 0) {
            products = [...filterData];
        }

        // sort products
        if (sort.newestProduct) {
            products.sort(this.sortByNewestProduct);
        }
        else if (sort.pricesGoUp) {
            products.sort(this.sortByPricesGoUp);

        }
        else if (sort.pricesGoDown) {
            products.sort(this.sortByPricesGoDown)
        }
        else if (sort.mostSold) {
            products.sort(this.sortByMostSold)
        }

        return (
            <>
                <div className="row">
                    {
                        products && products.length > 0 ?
                            (
                                products.map((item, index) => {
                                    return (
                                        <ProductItem
                                            key={item.productId}
                                            product={item}
                                        ></ProductItem>
                                    );
                                })
                            )
                            :
                            (
                                null
                            )
                    }
                </div>

                {
                    filterData && filterData.length > 0 ?
                        (
                            null
                        )
                        :
                        (
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
                        )
                }
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        products: state.products,
        filterData: state.filterData,
        search: state.search,
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
