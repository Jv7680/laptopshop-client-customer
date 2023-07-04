import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import BeautyStars from 'beauty-stars';
import Slider from 'react-input-slider';
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import './style.css'
import { formatNumberToVND } from '../../config/TYPE';
import axios from "axios";
import { API_URL } from '../../constants/Config';
import { actFetchProducts } from '../../redux/actions/products';
import { connect } from 'react-redux';
import store from '../..';
import { actFetchFilterData } from '../../redux/reducers/filterData';
import { actFetchProductsRequest } from '../../redux/actions/products';
import { startLoading, stopLoading } from '../Loading/setLoadingState';

const sliderStyleFrom = {
    track: {
        backgroundColor: '#474af0',
        width: '78%',
        height: 2,
    },
    active: {
        backgroundColor: '#acaedd'
    },
    thumb: {
        width: 10,
        height: 10,
        border: '1px solid #8183d8'
    },
    disabled: {
        opacity: 0.5
    }
};

const sliderStyleTo = {
    track: {
        backgroundColor: '#acaedd',
        width: '78%',
        height: 2,
    },
    active: {
        backgroundColor: '#474af0'
    },
    thumb: {
        width: 10,
        height: 10,
        border: '1px solid #8183d8'
    },
    disabled: {
        opacity: 0.5
    }
};

class FilterProduct extends Component {
    constructor(props) {
        super(props);
        this.filter = {};
        this.state = {
            fromPriceRange: 0,
            toPriceRange: 100000000,
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
            ram4: false,
            ram8: false,
            ram16: false,
            ram32: false,
            ssd1: false,
            ssd512: false,
            ssd256: false,
            ssd128: false,
            gcAMDRadeonR5520: false,
            gcGTX1650: false,
            gcGTX1650Ti: false,
            gcGeForceMX130: false,
            gcGeForceMX330: false,
            gcRTX1650: false,
            gcRTX2050: false,
        }
    }

    // componentDidUpdate = () => {
    //     //cập nhập filter ở ProductAll(thông qua call back) để truyền xuống Productlist
    //     this.props.updateFilter(this.filter);
    //     console.log('updateFilter');
    // }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });

        setTimeout(() => {
            //cập nhập filter ở ProductAll(thông qua call back) để truyền xuống Productlist
            this.props.updateFilter(this.filter);
        }, 500);
    }

    handleChangeFromPriceRange = (x) => {
        let { fromPriceRange, toPriceRange } = this.state;
        let different = toPriceRange - x;
        if (different <= 10000000) {
            this.setState({
                fromPriceRange: x,
                toPriceRange: (x + 10000000)
            });
        }
        else {
            this.setState({
                fromPriceRange: x
            });
        }

        setTimeout(() => {
            //cập nhập filter ở ProductAll(thông qua call back) để truyền xuống Productlist
            this.props.updateFilter(this.filter);
        }, 500);
    }

    handleChangeToPriceRange = (x) => {
        let { fromPriceRange, toPriceRange } = this.state;
        let different = x - fromPriceRange;
        if (different <= 10000000) {
            this.setState({
                fromPriceRange: (x - 10000000),
                toPriceRange: x
            });
        }
        else {
            this.setState({
                toPriceRange: x
            });
        }

        setTimeout(() => {
            //cập nhập filter ở ProductAll(thông qua call back) để truyền xuống Productlist
            this.props.updateFilter(this.filter);
        }, 500);
    }

    handleFilter = async () => {
        console.log("Lọc nè");
        let newFormat = this.formatFilter(this.filter);

        try {
            startLoading();
            await axios({
                method: 'GET',
                url: `${API_URL}/product/filter`,
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    fromPriceRange: newFormat.priceRange[0] || 0,
                    toPriceRange: newFormat.priceRange[1] || 100000000,
                    cpu: newFormat.cpu[0] || "",
                    ram: newFormat.ram[0] || "",
                    storagecapacity: newFormat.ssd[0] || "",
                    screensize: newFormat.screenSize[0] || "",
                    producer: newFormat.producer[0] || "",
                },
            })
                .then((res) => {
                    console.log('res filter', res);

                    if (res.data.length && res.data.length > 0) {
                        // store.dispatch(actFetchProducts(res.data));
                        store.dispatch(actFetchFilterData(res.data));
                        store.dispatch(actFetchProducts([]));
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: `Không tìm thấy sản phẩm phù hợp với bộ lọc`
                        })
                    }
                })
                .catch((error) => {
                    console.log('error filter', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: `${error}`
                    })
                });
        }
        catch (error) {
            console.log('error in filter:', error);
        }
        finally {
            stopLoading();
        }

    }

    handleResetFilter = async () => {
        console.log("reset lọc nè");

        await store.dispatch(actFetchFilterData([]));
        await store.dispatch(actFetchProductsRequest(1));
        this.setState({
            fromPriceRange: 0,
            toPriceRange: 100000000,
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
            ram4: false,
            ram8: false,
            ram16: false,
            ram32: false,
            ssd1: false,
            ssd512: false,
            ssd256: false,
            ssd128: false,
            gcAMDRadeonR5520: false,
            gcGTX1650: false,
            gcGTX1650Ti: false,
            gcGeForceMX130: false,
            gcGeForceMX330: false,
            gcRTX1650: false,
            gcRTX2050: false,
        });
    }

    getExactKey = (key) => {
        switch (key) {
            case 'celeron':
                return 'celeron';
            case 'coreI3':
                return 'intel core i3';
            case 'coreI5':
                return 'intel core i5';
            case 'coreI7':
                return 'intel core i7';
            case 'coreI9':
                return 'intel core i9';
            case 'pentium':
                return 'pentium';
            case 'ryzen3':
                return 'amd ryzen 3';
            case 'ryzen5':
                return 'amd ryzen 5';
            case 'ryzen7':
                return 'amd ryzen 7';
            case 'ryzen9':
                return 'amd ryzen 9';
            case 'snapdragon':
                return 'snapdragon';

            case 'gcAMDRadeonR5520':
                return 'AMD Radeon R5520';
            case 'gcGTX1650':
                return 'GTX 1650';
            case 'gcGTX1650Ti':
                return 'GTX 1650Ti';
            case 'gcGeForceMX130':
                return 'GeForce MX130';
            case 'gcGeForceMX330':
                return 'GeForce MX330';
            case 'gcRTX1650':
                return 'RTX 1650';
            case 'gcRTX2050':
                return 'RTX 2050';

            case 'pAcer':
                return 'acer';
            case 'pAsus':
                return 'asus';
            case 'pAvita':
                return 'avita';
            case 'pDell':
                return 'dell';
            case 'pGigabyte':
                return 'gigabyte';
            case 'pHP':
                return 'hp';
            case 'pHuawei':
                return 'huawei';
            case 'pLG':
                return 'lg';
            case 'pLenovo':
                return 'lenovo';
            case 'pMSI':
                return 'msi';

            case 'ram4':
                return '4 gb';
            case 'ram8':
                return '8 gb';
            case 'ram16':
                return '16 gb';
            case 'ram32':
                return '32 gb';

            case 'sz13':
                return '13 inch';
            case 'sz14':
                return '14 inch';
            case 'sz16':
                return '16 inch';
            case 'sz17':
                return '17 inch';
            case 'sz18':
                return '18 inch';
            case 'sz116':
                return '11.6 inch';
            case 'sz133':
                return '13.3 inch';
            case 'sz134':
                return '13.4 inch';
            case 'sz135':
                return '13.5 inch';
            case 'sz145':
                return '14.5 inch';
            case 'sz156':
                return '15.6 inch';
            case 'sz161':
                return '16.1 inch';
            case 'sz173':
                return '17.3 inch';

            case 'ssd1':
                return '1 tb';
            case 'ssd128':
                return '128 gb';
            case 'ssd256':
                return '256 gb';
            case 'ssd512':
                return '512 gb';

            default:
                return '';
        }
    }

    formatFilter = (filter) => {
        let newFormat = {
            cpu: [],
            graphicCard: [],
            priceRange: [],
            producer: [],
            ram: [],
            screenSize: [],
            ssd: [],
        };


        console.log("filter key Obj", Object.keys(filter));

        for (let key1 in filter) {
            for (let key2 in filter[key1]) {
                if (key1 === 'priceRange') {
                    newFormat[key1].push(filter[key1][key2]);
                }
                else if (filter[key1][key2]) {
                    newFormat[key1].push(this.getExactKey(key2));
                }
            }
        }
        console.log("filter new forma", newFormat);

        return newFormat;
    }

    render() {
        //price range
        const { fromPriceRange, toPriceRange } = this.state;
        //screen size
        const { sz116, sz13, sz133, sz134, sz135, sz14, sz145, sz156, sz16, sz161, sz17, sz173, sz18 } = this.state;
        //producer
        const { pAcer, pAsus, pAvita, pDell, pGigabyte, pHP, pHuawei, pLG, pLenovo, pMSI } = this.state;
        //CPU
        const { celeron, pentium, snapdragon, coreI3, coreI5, coreI7, coreI9, ryzen3, ryzen5, ryzen7, ryzen9 } = this.state;
        //ram
        const { ram4, ram8, ram16, ram32 } = this.state;
        //ssd
        const { ssd1, ssd512, ssd256, ssd128 } = this.state;
        //graphic card
        const { gcAMDRadeonR5520, gcGTX1650, gcGTX1650Ti, gcGeForceMX130, gcGeForceMX330, gcRTX1650, gcRTX2050 } = this.state;

        //biến newFilter này sẽ được cập nhập mỗi khi state thay đổi
        const newFilter = {
            priceRange: { fromPriceRange, toPriceRange },
            screenSize: { sz116, sz13, sz133, sz134, sz135, sz14, sz145, sz156, sz16, sz161, sz17, sz173, sz18 },
            // producer: { pAcer, pAsus, pAvita, pDell, pGigabyte, pHP, pHuawei, pLG, pLenovo, pMSI },
            producer: { pAcer, pAsus, pDell, pHP, pMSI },
            cpu: { celeron, pentium, snapdragon, coreI3, coreI5, coreI7, coreI9, ryzen3, ryzen5, ryzen7, ryzen9 },
            ram: { ram4, ram8, ram16, ram32 },
            ssd: { ssd1, ssd512, ssd256, ssd128 },
            graphicCard: { gcAMDRadeonR5520, gcGTX1650, gcGTX1650Ti, gcGeForceMX130, gcGeForceMX330, gcRTX1650, gcRTX2050 },
        };
        //gán newFilter cho filter
        this.filter = newFilter;


        return (
            <div className="col-2 filter-area">
                <span className="filter-tittle"><i class="fa fa-filter"></i> Bộ lọc tìm kiếm</span>

                {/* Button filter */}
                <div className="row no-gutters producer-area" style={{ flexDirection: "column" }}>
                    <button className='btnFilterPush' type='button' onClick={() => { this.handleFilter() }}>Lọc</button>
                    <button className='btnFilterReset' type='button' onClick={() => { this.handleResetFilter() }}>Đặt lại</button>
                </div>

                {/* Phần filter giá */}
                <div className="row no-gutters price-range-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Khoảng giá</span>
                    </div>
                    <div className="col from-price-range text-center">
                        <span className="input-range">{formatNumberToVND(fromPriceRange)}</span>
                        <Slider
                            styles={sliderStyleFrom}
                            axis="x"
                            xmin={0}
                            xmax={90000000}
                            xstep={500000}
                            x={fromPriceRange}
                            onChange={({ x }) => { this.handleChangeFromPriceRange(x) }}
                        />
                    </div>
                    <div className="col to-price-range text-center">
                        <span className="input-range">{formatNumberToVND(toPriceRange)}</span>
                        <Slider
                            styles={sliderStyleTo}
                            axis="x"
                            xmin={10000000}
                            xmax={100000000}
                            xstep={500000}
                            x={toPriceRange}
                            onChange={({ x }) => { this.handleChangeToPriceRange(x) }}
                        />
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter hãng sản xuất */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Hãng sản xuất</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pAcer' checked={pAcer} onChange={(event) => { this.handleChange(event) }} />
                        <span>Acer</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pAsus' checked={pAsus} onChange={(event) => { this.handleChange(event) }} />
                        <span>Asus</span>
                    </div>
                    {/* <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pAvita' checked={pAvita} onChange={(event) => { this.handleChange(event) }} />
                        <span>Avita</span>
                    </div> */}
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pDell' checked={pDell} onChange={(event) => { this.handleChange(event) }} />
                        <span>Dell</span>
                    </div>
                    {/* <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pGigabyte' checked={pGigabyte} onChange={(event) => { this.handleChange(event) }} />
                        <span>Gigabyte</span>
                    </div> */}
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pHP' checked={pHP} onChange={(event) => { this.handleChange(event) }} />
                        <span>HP</span>
                    </div>
                    {/* <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pHuawei' checked={pHuawei} onChange={(event) => { this.handleChange(event) }} />
                        <span>Huawei</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pLG' checked={pLG} onChange={(event) => { this.handleChange(event) }} />
                        <span>LG</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pLenovo' checked={pLenovo} onChange={(event) => { this.handleChange(event) }} />
                        <span>Lenovo</span>
                    </div> */}
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pMSI' checked={pMSI} onChange={(event) => { this.handleChange(event) }} />
                        <span>MSI</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter CPU */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">CPU</span>
                    </div>
                    <div className="col-12 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='celeron' checked={celeron} onChange={(event) => { this.handleChange(event) }} />
                        <span>Celeron</span>
                    </div>
                    <div className="col-12 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='pentium' checked={pentium} onChange={(event) => { this.handleChange(event) }} />
                        <span>Pentium</span>
                    </div>
                    <div className="col-12 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='snapdragon' checked={snapdragon} onChange={(event) => { this.handleChange(event) }} />
                        <span>Snapdragon</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='coreI3' checked={coreI3} onChange={(event) => { this.handleChange(event) }} />
                        <span>Core i3</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='coreI5' checked={coreI5} onChange={(event) => { this.handleChange(event) }} />
                        <span>Core i5</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='coreI7' checked={coreI7} onChange={(event) => { this.handleChange(event) }} />
                        <span>Core i7</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='coreI9' checked={coreI9} onChange={(event) => { this.handleChange(event) }} />
                        <span>Core i9</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='ryzen3' checked={ryzen3} onChange={(event) => { this.handleChange(event) }} />
                        <span>Ryzen 3</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='ryzen5' checked={ryzen5} onChange={(event) => { this.handleChange(event) }} />
                        <span>Ryzen 5</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='ryzen7' checked={ryzen7} onChange={(event) => { this.handleChange(event) }} />
                        <span>Ryzen 7</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='ryzen9' checked={ryzen9} onChange={(event) => { this.handleChange(event) }} />
                        <span>Ryzen 9</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter RAM */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">RAM</span>
                    </div>
                    <div className="col-6 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ram4' checked={ram4} onChange={(event) => { this.handleChange(event) }} />
                        <span>4 GB</span>
                    </div>
                    <div className="col-6 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ram8' checked={ram8} onChange={(event) => { this.handleChange(event) }} />
                        <span>8 GB</span>
                    </div>
                    <div className="col-6 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ram16' checked={ram16} onChange={(event) => { this.handleChange(event) }} />
                        <span>16 GB</span>
                    </div>
                    <div className="col-6 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ram32' checked={ram32} onChange={(event) => { this.handleChange(event) }} />
                        <span>32 GB</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter Ổ cứng */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Ổ cứng</span>
                    </div>
                    <div className="col-12 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ssd1' checked={ssd1} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 1 TB</span>
                    </div>
                    <div className="col-12 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ssd512' checked={ssd512} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 512 GB</span>
                    </div>
                    <div className="col-12 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ssd256' checked={ssd256} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 256 GB</span>
                    </div>
                    <div className="col-12 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ssd128' checked={ssd128} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 128 GB</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter Card đồ họa */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Card đồ họa</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='gcAMDRadeonR5520' checked={gcAMDRadeonR5520} onChange={(event) => { this.handleChange(event) }} />
                        <span>AMD Radeon R5 520</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='gcGTX1650' checked={gcGTX1650} onChange={(event) => { this.handleChange(event) }} />
                        <span>GTX 1650</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='gcGTX1650Ti' checked={gcGTX1650Ti} onChange={(event) => { this.handleChange(event) }} />
                        <span>GTX 1650Ti</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='gcGeForceMX130' checked={gcGeForceMX130} onChange={(event) => { this.handleChange(event) }} />
                        <span>GeForce MX130</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='gcGeForceMX330' checked={gcGeForceMX330} onChange={(event) => { this.handleChange(event) }} />
                        <span>GeForce MX330</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='gcRTX1650' checked={gcRTX1650} onChange={(event) => { this.handleChange(event) }} />
                        <span>RTX 1650</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='gcRTX2050' checked={gcRTX2050} onChange={(event) => { this.handleChange(event) }} />
                        <span>RTX 2050</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter kích thước màn hình */}
                <div className="row no-gutters screen-size-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Kích thước màn hình</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz116' checked={sz116} onChange={(event) => { this.handleChange(event) }} />
                        <span>11.6"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz13' checked={sz13} onChange={(event) => { this.handleChange(event) }} />
                        <span>13"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz133' checked={sz133} onChange={(event) => { this.handleChange(event) }} />
                        <span>13.3"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz134' checked={sz134} onChange={(event) => { this.handleChange(event) }} />
                        <span>13.4"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz135' checked={sz135} onChange={(event) => { this.handleChange(event) }} />
                        <span>13.5"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz14' checked={sz14} onChange={(event) => { this.handleChange(event) }} />
                        <span>14"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz145' checked={sz145} onChange={(event) => { this.handleChange(event) }} />
                        <span>14.5"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz156' checked={sz156} onChange={(event) => { this.handleChange(event) }} />
                        <span>15.6"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz16' checked={sz16} onChange={(event) => { this.handleChange(event) }} />
                        <span>16"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz161' checked={sz161} onChange={(event) => { this.handleChange(event) }} />
                        <span>16.1"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz17' checked={sz17} onChange={(event) => { this.handleChange(event) }} />
                        <span>17"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz173' checked={sz173} onChange={(event) => { this.handleChange(event) }} />
                        <span>17.3"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz18' checked={sz18} onChange={(event) => { this.handleChange(event) }} />
                        <span>18"</span>
                    </div>
                </div>

                {/* Button filter */}
                {/* <div className="row no-gutters producer-area" style={{ flexDirection: "column" }}>
                    <button className='btnFilterPush' type='button' onClick={() => { this.handleFilter() }}>Lọc</button>
                    <button className='btnFilterReset' type='button' onClick={() => { this.handleResetFilter() }}>Đặt lại</button>
                </div> */}
            </div>
        )
    }
}

export default withRouter(FilterProduct)

