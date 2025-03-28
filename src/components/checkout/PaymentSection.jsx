import { useState } from "react"
import styles from "./PaymentSection.module.css"
import api from "../../api"

const PaymentSection = () => {

    const cart_code = localStorage.getItem("cart_code")
    const [loading, setLoading] = useState(false)

    function makePayment(){
        api.post("initiate_payment/", {cart_code})
        .then(res => {
            console.log(res.data)
            window.location.href = res.data.data.link
        })

        .catch(err => {
            console.log(err.message)
        })
    }

  return (
    <div className='col-md-4'>
    <div className={`card ${styles.card}`}>
        <div className="card-header" style={{ backgroundColor: '#6050DC', color:"white"}}>
            <h5>Payment Options</h5>
        </div>
        <div className="card-body">
            {/* PayPal Button */}
            <button className={`btn btn-primary w-100 mb-3 ${styles.paypalButton}`} id="paypal-button">
                <i className="bi bi-paypal"></i> Pay with Paypal
            </button>

            {/* Flutterwave Button */}
            <button className={`btn btn-warning w-100 ${styles.flutterwaveButton}`} onClick={makePayment} id="flutterwave-button">
                <i className="bi bi-credit-card"></i> Pay with Flutterwave
            </button>
        </div>
    </div>
      
    </div>
  )
}

export default PaymentSection
