import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import PulseLoader from 'react-spinners/PulseLoader';
import { withRouter } from 'react-router-dom';
import { React360Viewer } from "react-360-product-viewer";
import { css } from "@emotion/core";

const cssPulseLoader = css`
    margin: auto;
    z-index: 9999;
    display: block;
`;

class ProductInfor extends Component {

    componentDidMount = () => {
        // console.log('vào componentDidMount');
        setTimeout(() => {
            // this.applylistImage360URLForReact360Viewer();
        }, 300);
    }

    componentDidUpdate = () => {
        // console.log('vào componentDidUpdate');
        setTimeout(() => {
            // this.applylistImage360URLForReact360Viewer();
        }, 300);
    }

    render() {
        const { listImage360URL } = this.props;

        return (
            <>
                {
                    listImage360URL === null ?
                        (
                            <div className="not-upadted">Chúng tôi đang cập nhật mục này</div>
                        )
                        :
                        (
                            <>
                                {
                                    listImage360URL.length > 0 ?
                                        (
                                            <>
                                                {/* Thông tin CPU */}
                                                <div className="row product-configuration-title-modal product-configuration-content--grey mt-25">
                                                    <div className="col">Bộ xử lý</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">CPU:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Số nhân:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Số luồng:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Tốc độ CPU:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Bộ nhớ đệm:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>

                                                {/* Thông tin ổ cứng */}
                                                <div className="row product-configuration-title-modal product-configuration-content--grey">
                                                    <div className="col">Ổ cứng</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Dung lượng:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Loại ổ cứng:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>

                                                {/* Thông tin RAM */}
                                                <div className="row product-configuration-title-modal product-configuration-content--grey">
                                                    <div className="col">Bộ nhớ RAM</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Dung lượng:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Loại RAM:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Tốc độ BUS RAM:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>

                                                {/* Thông tin màn hình */}
                                                <div className="row product-configuration-title-modal product-configuration-content--grey">
                                                    <div className="col">Màn hình</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Kích thước:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Độ phân giải:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Tần số quét:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>

                                                {/* Thông tin card đồ họa và âm thanh */}
                                                <div className="row product-configuration-title-modal product-configuration-content--grey">
                                                    <div className="col">Đồ họa và âm thanh</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Card màn hình:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Công nghệ âm thanh:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>

                                                {/* Thông tin khối lượng và chất liệu */}
                                                <div className="row product-configuration-title-modal product-configuration-content--grey">
                                                    <div className="col">Khối lượng và chất liệu</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Khối lượng:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Chất liệu vỏ:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>

                                                {/* Thông tin khác */}
                                                <div className="row product-configuration-title-modal product-configuration-content--grey">
                                                    <div className="col">Thông tin khác</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Pin:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Hệ điều hành:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                                <div className="row product-configuration-content">
                                                    <div className="col-4 product-configuration-content__title">Thời điểm ra mắt:</div>
                                                    <div className="col product-configuration-content__content">Nội dung</div>
                                                </div>
                                            </>
                                        )
                                        :
                                        (
                                            <div className="not-upadted">
                                                <PulseLoader
                                                    css={cssPulseLoader}
                                                    sizeUnit={"px"}
                                                    size={20}
                                                    color={'rgba(71, 74, 240, 0.8)'}
                                                    loading={true}
                                                />
                                            </div>
                                        )
                                }
                            </>
                        )
                }
            </>
        )
    }

}

export default withRouter(ProductInfor);
