// import firebase from 'firebase';
import { storage } from './firebaseConfig';
import { ref, getDownloadURL, listAll, uploadBytes, deleteObject } from "firebase/storage";
import { startLoading, stopLoading } from '../components/Loading/setLoadingState';
import Swal from 'sweetalert2';

// Function for user


// Lấy link ảnh trên firebase
// Hàm này trả về mảng chứa danh sách image URL
export async function getProductListImageURL(productID) {
  startLoading();
  // biến lưu danh sách URL và Ref
  let listImage = {
    images: [],
    listImageRef: [],
  };

  // Tạo vị trí lưu trữ trên storage và tham chiếu đến đó
  // Tham chiếu đến thư mục images
  await listAll(ref(storage, `products/p_${productID}/images`))
    .then(res => {
      res.items.forEach(item => {
        listImage.listImageRef.push(item);
      });
    })
    .catch(err => {
      console.log('err on get listImageRef:', err);
      return null;
    }
    );

  // Lưu link ảnh vào object listImage
  // Lưu vào listImage.images
  for (let i = 0; i < listImage.listImageRef.length; i++) {
    await getDownloadURL(listImage.listImageRef[i])
      .then(url => {
        listImage.images.push(url);
      })
      .catch(err => {
        console.log('err on get listImage.images:', err);
        return null;
      });
  }

  stopLoading();
  console.log('listImage:', listImage);
  return listImage;
}

// Hàm này trả về mảng chứa danh sách image360 URL
export async function getProductListImage360URL(productID) {
  // startLoading();
  // biến lưu danh sách URL và Ref
  let listImage = {
    images360: [],
    listImage360Ref: [],
  };

  // Tạo vị trí lưu trữ trên storage và tham chiếu đến đó
  // Tham chiếu đến thư mục images360
  await listAll(ref(storage, `products/p_${productID}/images360`))
    .then(res => {
      res.items.forEach(item => {
        listImage.listImage360Ref.push(item);
      });
    })
    .catch(err => {
      console.log('err on get listImage360Ref:', err);
      return null;
    }
    );

  // nếu listImage.listImage360Ref rỗng(nghĩa là sản phẩm này không có ảnh 360)
  if (listImage.listImage360Ref.length === 0) {
    listImage.images360 = null;
  }
  else {
    // Lưu link ảnh vào object listImage
    // Lưu vào listImage.images360
    for (let i = 0; i < listImage.listImage360Ref.length; i++) {
      await getDownloadURL(listImage.listImage360Ref[i])
        .then(url => {
          listImage.images360.push(url);
        })
        .catch(err => {
          console.log('err on get listImage.images360:', err);
          return null;
        });
    }
  }

  // stopLoading();
  console.log('listImage360:', listImage);
  return listImage;
}

// Hàm này trả về image URL đầu tiên
export async function getProductFirstImageURL(productID, loading = true) {
  loading && startLoading();
  // biến lưu danh sách URL và Ref
  let image = {
    imageURL: "",
    imageRef: null,
  };

  // Tạo vị trí lưu trữ trên storage và tham chiếu đến đó
  // Tham chiếu đến thư mục images
  await listAll(ref(storage, `products/p_${productID}/images`))
    .then(res => {
      image.imageRef = res.items[0];
    })
    .catch(err => {
      console.log('err on get image.imageRef:', err);
      return null;
    }
    );
  console.log('image obj:', image);

  // Lưu link ảnh vào object listImage
  // Lưu vào listImage.images
  if (image.imageRef) {
    await getDownloadURL(image.imageRef)
      .then(url => {
        image.imageURL = url;
      })
      .catch(err => {
        console.log('err on get image.imageURL:', err);
        return null;
      });
  }

  loading && stopLoading();
  console.log(`image getProductFirstImageURL ${productID}:`, image);
  return image.imageURL;
}