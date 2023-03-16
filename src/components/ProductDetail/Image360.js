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

class Image360 extends Component {
    applylistImage360URLForReact360Viewer = () => {
        let { listImage360URL } = this.props;
        let imageReact360Viewer;
        let image360Area;
        // Thay thế lần lượt theo thứ tự src hiện tại của component bằng link ảnh
        if (listImage360URL.length > 0) {
            for (let i = 0; i < listImage360URL.length; i++) {
                imageReact360Viewer = document.getElementsByClassName('sc-beySbM hmghSZ')[i];
                if (imageReact360Viewer) {
                    imageReact360Viewer.setAttribute('src', listImage360URL[i]);
                }
            }

            // show khu vực ảnh 360, vòng for trên sẽ thay ảnh lỗi, thay xong ms show thì sẽ ko bị hiện phần thuộc tính alt
            image360Area = document.getElementsByClassName('image-360-area')[0];
            if (image360Area) {
                image360Area.classList.add('image-360-area--show');
            }
        }
    }

    componentDidMount = () => {
        // console.log('vào componentDidMount');
        setTimeout(() => {
            this.applylistImage360URLForReact360Viewer();
        }, 300);
    }

    componentDidUpdate = () => {
        // console.log('vào componentDidUpdate');
        setTimeout(() => {
            this.applylistImage360URLForReact360Viewer();
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
                                            <div className="image-in-slider-modal image-360-area">
                                                <React360Viewer
                                                    imagesBaseUrl={''}
                                                    imagesCount={listImage360URL.length}
                                                    imagesFiletype="jpg"
                                                    mouseDragSpeed={7}
                                                    autoplay={true}
                                                    autoplaySpeed={7}
                                                // reverse={true}
                                                />
                                            </div>
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

export default withRouter(Image360);
