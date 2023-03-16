import React, { Component } from 'react'
import Slider from '../components/HomePage/Slider/Slider'
import TopDiscountProduct from '../components/HomePage/Content/TopDiscountProduct/TopDiscountProduct'
import TopTreddingProduct from '../components/HomePage/Content/TrenddingProduct/TopTreddingProduct'
export default class HomPage extends Component {
    render() {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        return (
            <div>
                <Slider></Slider>
                <TopDiscountProduct></TopDiscountProduct>
                <TopTreddingProduct></TopTreddingProduct>
            </div>
        )
    }
}
