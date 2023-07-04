import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
import { toast } from 'react-toastify';

export const actFetchWishListRequest = (id) => {
  const userId = parseInt(id)
  return async dispatch => {
    let token = localStorage.getItem('_auth');
    const res = await callApi(`wishlist/wishlist/${userId}`, 'GET', undefined, token);
    console.log("res sđsds", res);
    if (res && res.status === 200) {

      dispatch(actFetchWishList(res.data));
    }
    if (res && res.status === 204) {
      dispatch(actFetchWishList([]));
    }
  };
}

export const actFetchWishList = (wishlist) => {
  return {
    type: Types.FETCH_WISHLIST,
    wishlist
  }
}

export const actAddWishListRequest = (customerId, productId) => {
  let data = {
    accountId: customerId,
    productId
  }
  console.log("haha", data)
  return async dispatch => {
    let token = localStorage.getItem('_auth');
    const res = await callApi('wishlist/create', 'POST', data, token);
    if (res && res.status === 200) {
      dispatch(actFetchWishListRequest(customerId))
      toast.success('Đã thêm vào mục ưa thích')
    }
  };
}

// export const actAddFavorite = (favorite) => {
//   return {
//     type: Types.ADD_FAVORITE,
//     favorite
//   }
// }

export const actDeleteWishListRequest = (idwishlist) => {
  return async dispatch => {
    const res = await callApi(`wishlist?wishlistId=${idwishlist}`, 'PUT');
    if (res && res.status == 200) {
      dispatch(actDeleteWishList(idwishlist))
    }
  };
}

export const actDeleteWishList = (id) => {
  return {
    type: Types.REMOVE_WISHLIST,
    id
  }
}
