import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import BeautyStars from 'beauty-stars';
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import './style.css'

class SortProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pricesGoUp: false,
            pricesGoDown: false,
            mostSold: false,
        };
        this.sort = {};
    }

    // componentDidUpdate = () => {
    //     //cập nhập sort ở ProductAll(thông qua call back) để truyền xuống Productlist
    //     this.props.updateSort(this.sort);
    //     console.log('updateSort');
    // }

    handleOnClickSortItem = (event) => {
        let name = event.target.attributes.name.nodeValue;
        let listSortItem = document.getElementsByClassName('sort-item');

        for (let i = 0; i <= 2; i++) {
            listSortItem[i].classList.remove('sort-item--active');
            this.setState({
                pricesGoUp: false,
                pricesGoDown: false,
                mostSold: false,
            });
        }

        listSortItem[name].classList.add('sort-item--active');
        this.setState({
            [name]: true,
        });

        setTimeout(() => {
            //cập nhập sort ở ProductAll(thông qua call back) để truyền xuống Productlist
            this.props.updateSort(this.sort);
        }, 500);
    }

    handleOnClickBtnFilter = (event) => {
        let btnFilter = document.getElementsByClassName('btn-filter')['btnFilter'].classList;
        let clearBtnFilter = false;

        let classListOfFilterArea = document.getElementsByClassName('filter-area')[0].classList;
        let clearClassListOfFilterArea = false;

        //check xem filter-area--show đã đc add chưa, add rồi thì xóa
        for (let i = 0; i < classListOfFilterArea.length; i++) {
            if (classListOfFilterArea[i] === 'filter-area--show') {
                classListOfFilterArea.remove('filter-area--show');
                clearClassListOfFilterArea = true;
            }
        }
        //nếu chưa đc add thì thêm
        if (!clearClassListOfFilterArea) {
            classListOfFilterArea.add('filter-area--show');
        }

        //check xem btn-filter--active đã đc add chưa, add rồi thì xóa
        for (let i = 0; i < btnFilter.length; i++) {
            if (btnFilter[i] === 'btn-filter--active') {
                btnFilter.remove('btn-filter--active');
                clearBtnFilter = true;
            }
        }
        //nếu chưa đc add thì thêm
        if (!clearBtnFilter) {
            btnFilter.add('btn-filter--active');
        }
        // document.getElementsByClassName('filter-area')[0].classList.add('filter-area--show');
    }

    render() {
        const { pricesGoUp, pricesGoDown, mostSold } = this.state;
        const { filterData } = this.props;

        //biến sort này sẽ được cập nhập mỗi khi state thay đổi
        const newSort = { pricesGoUp, pricesGoDown, mostSold };
        //gán newSort cho sort
        this.sort = newSort;

        return (
            <div className="row sort-area">
                {/* <div className='col-auto'>
                    <span className='btn-filter' onClick={(event) => { this.handleOnClickBtnFilter(event) }} name='btnFilter'><i class="fa fa-filter"></i> Bộ lọc</span>
                </div> */}
                {
                    this.props.history.location.pathname !== "/products" ?
                        (
                            null
                        )
                        :
                        (
                            <div className='col-auto'>
                                <span className='btn-filter' onClick={(event) => { this.handleOnClickBtnFilter(event) }} name='btnFilter'><i class="fa fa-filter"></i> Bộ lọc</span>
                            </div>
                        )
                }
                <div className='col-auto'>
                    <span className='sort-title'>Sắp xếp theo</span>
                </div>
                <div className='col-auto'>
                    <span className='sort-item' onClick={(event) => { this.handleOnClickSortItem(event) }} name='pricesGoUp'>Giá tăng dần</span>
                </div>
                <div className='col-auto'>
                    <span className='sort-item' onClick={(event) => { this.handleOnClickSortItem(event) }} name='pricesGoDown'>Giá giảm dần</span>
                </div>
                <div className='col-auto'>
                    <span className='sort-item' onClick={(event) => { this.handleOnClickSortItem(event) }} name='mostSold'>Bán chạy</span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        filterData: state.filterData,
    };
};

export default connect(mapStateToProps, undefined)(withRouter(SortProduct))
