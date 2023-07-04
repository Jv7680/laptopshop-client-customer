import React, { useRef, useEffect, useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


export default function PaypalCheckoutButton(props) {
  const paypal = useRef();
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    let amount = parseFloat((parseInt(localStorage.getItem("total")) / 23465).toFixed(2));
    console.log("amount", amount);
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Buy laptop",
                amount: {
                  currency_code: "USD",
                  value: amount,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          // const order = await actions.order.authorize();

          console.log("success", order);
          setTransactionStatus("success");

          props.onSuccess("Paypal");
        },
        onError: (err) => {
          console.log(err);
          setTransactionStatus("failure");
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: `Error: ${err}`,
          })
        },
      })
      .render(paypal.current);
  }, []);

  // if (transactionStatus === "success") {
  //   return <div>thanh cong</div>;
  // }

  // if (transactionStatus === "failure") {
  //   return <div>that bai</div>;
  // }

  return (
    <div ref={paypal}>
    </div>
  );
}