import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { startLoading, stopLoading } from '../components/Loading/setLoadingState';
import * as Config from '../constants/Config';
import store from '../index';
import { actFetchCart } from '../redux/actions/cart';
toast.configure()

export default async function callApi(endpoint, method = 'GET', body, token, setStartLoading) {
  if (setStartLoading) {
    startLoading();
  }
  try {
    let data;
    if (token !== undefined && token !== null && token !== '') {
      data = await axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        headers: { Authorization: `${token}` },
        data: body
      });
      return data;
    } else {
      data = await axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        data: body
      });
      console.log("data axios", data);
      return data;
    }
  }
  catch (err) {
    if (err.response && err.response.data) {
      console.log('err.response.data: ', err.response.data);
      localStorage.setItem('errorCode', err.response.data.message);
      const error = err.response.data.message || err.response.data[0].defaultMessage;
      if (error === 'Giỏ hàng trống') {
        store.dispatch(actFetchCart([]));
      }
      // else if (error === 'Không tìm được sản phẫm') {
      //   store.dispatch(actFetchProducts([]));
      //   Swal.fire({
      //     returnFocus: false,
      //     icon: 'error',
      //     title: 'Lỗi',
      //     text: `${error}`
      //   })
      // }
      else {
        Swal.fire({
          returnFocus: false,
          icon: 'error',
          title: 'Lỗi',
          text: `${error}`
        })
      }

    } else {
      Swal.fire({
        returnFocus: false,
        icon: 'error',
        title: 'Lỗi Server',
        text: 'không thể kết nối server!'
      })
    }
  }
  finally {
    if (setStartLoading) {
      stopLoading();
    }
  }
}