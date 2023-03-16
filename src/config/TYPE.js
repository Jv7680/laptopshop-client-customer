// export const formatNumber = new Intl.NumberFormat('it-IT', {
//   style: 'currency',
//   currency: 'VND'
// })

export function formatNumber(number) {
  if (number !== null && number !== undefined && typeof (number) !== 'string') {
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }
  return number;

}

export function formatNumberToVND(number) {
  if (number !== null && number !== undefined && typeof (number) !== 'string') {
    return (number.toLocaleString('vi-VN') + "đ");
  }
  return number;

}