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
        const { product } = this.props;

        return (
            <>
                {/* Thông tin CPU */}
                <div className="row product-configuration-title-modal product-configuration-content--grey mt-25">
                    <div className="col">Bộ xử lý</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">CPU:</div>
                    <div className="col product-configuration-content__content">{product.cpu || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Số nhân:</div>
                    <div className="col product-configuration-content__content">{product.cores || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Số luồng:</div>
                    <div className="col product-configuration-content__content">{product.threads || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Tốc độ CPU:</div>
                    <div className="col product-configuration-content__content">{product.cpuspeed || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Bộ nhớ đệm:</div>
                    <div className="col product-configuration-content__content">{product.cache || "Đang cập nhật"}</div>
                </div>

                {/* Thông tin ổ cứng */}
                <div className="row product-configuration-title-modal product-configuration-content--grey">
                    <div className="col">Ổ cứng</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Dung lượng:</div>
                    <div className="col product-configuration-content__content">{product.storagecapacity || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Loại ổ cứng:</div>
                    <div className="col product-configuration-content__content">{product.storagetype || "Đang cập nhật"}</div>
                </div>

                {/* Thông tin RAM */}
                <div className="row product-configuration-title-modal product-configuration-content--grey">
                    <div className="col">Bộ nhớ RAM</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Dung lượng:</div>
                    <div className="col product-configuration-content__content">{product.ram || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Loại RAM:</div>
                    <div className="col product-configuration-content__content">{product.ramtype || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Tốc độ BUS RAM:</div>
                    <div className="col product-configuration-content__content">{product.rambusspeed || "Đang cập nhật"}</div>
                </div>

                {/* Thông tin màn hình */}
                <div className="row product-configuration-title-modal product-configuration-content--grey">
                    <div className="col">Màn hình</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Kích thước:</div>
                    <div className="col product-configuration-content__content">{product.screensize || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Độ phân giải:</div>
                    <div className="col product-configuration-content__content">{product.screenresolution || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Tần số quét:</div>
                    <div className="col product-configuration-content__content">{product.screenrefreshrate || "Đang cập nhật"}</div>
                </div>

                {/* Thông tin card đồ họa và âm thanh */}
                <div className="row product-configuration-title-modal product-configuration-content--grey">
                    <div className="col">Đồ họa và âm thanh</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Card màn hình:</div>
                    <div className="col product-configuration-content__content">{product.graphicscard || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Công nghệ âm thanh:</div>
                    <div className="col product-configuration-content__content">{product.audiotechnology || "Đang cập nhật"}</div>
                </div>

                {/* Thông tin khối lượng và chất liệu */}
                <div className="row product-configuration-title-modal product-configuration-content--grey">
                    <div className="col">Khối lượng và chất liệu</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Khối lượng:</div>
                    <div className="col product-configuration-content__content">{product.weight || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Chất liệu vỏ:</div>
                    <div className="col product-configuration-content__content">{product.casingmaterial || "Đang cập nhật"}</div>
                </div>

                {/* Thông tin khác */}
                <div className="row product-configuration-title-modal product-configuration-content--grey">
                    <div className="col">Thông tin khác</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Pin:</div>
                    <div className="col product-configuration-content__content">{product.battery || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Hệ điều hành:</div>
                    <div className="col product-configuration-content__content">{product.operatingsystem || "Đang cập nhật"}</div>
                </div>
                <div className="row product-configuration-content">
                    <div className="col-4 product-configuration-content__title">Thời điểm ra mắt:</div>
                    <div className="col product-configuration-content__content">{product.releasedate || "Đang cập nhật"}</div>
                </div>
            </>
        )
    }

}

export default withRouter(ProductInfor);
