import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import api from "../../api";

const PaymentStatusPage = ({setNumberCartItems}) => {

    const [statusMessage, setStatusMessage] = useState('Verificando tu pago');
    const [statusSubMessage, setStatusSubMessage] = useState('Espera un momento, estamos verificando tu pago')
    const location = useLocation();


    useEffect(function(){
        const queryParams = new URLSearchParams(location.search);
        const paymentId = queryParams.get("paymentId")
        const payId = queryParams.get('PayerID')
        const ref = queryParams.get('ref')

        if(paymentId && payId && ref){
            api.post(`paypal_payment_callback/?paymentId=${paymentId}&PayerID=${payId}&ref=${ref}`)
            .then(res =>{
                setStatusMessage(res.data.message)
                setStatusSubMessage(res.data.subMessage)
                localStorage.removeItem("cart_code")
                setNumberCartItems(0)
            })

            .catch(err => console.log(err.message))
        }
    }, [])

    useEffect(function(){

        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        const txRef = queryParams.get('tx_ref');
        const transactionId = queryParams.get('transaction_id')

        if(status && txRef && transactionId){
            api.post(`payment_callback/?status=${status}&tx_ref=${txRef}&transaction_id=${transactionId}`)
            .then(res =>{
                setStatusMessage(res.data.message)
                setStatusSubMessage(res.data.subMessage)
                localStorage.removeItem("cart_code")
                setNumberCartItems(0)
            })

            .catch(err => console.log(err.message))
        }


    }, [])

  return (
    <header className='py-5' style={{backgroundColor: "#6050DC"}}>
    <div className='container px-4 px-lg-5 my-5'>
        <div className='text-center text-white'>
            <h2 className='display-4 fw-bold'>{statusMessage}</h2>
            <p className='lead fw-normal text-white-75 mb-4'>{statusSubMessage}</p>
            <span>
            <Link to="/profile" className="btn btn-light btn-lg px-4 py-2 mx-3">Ver detalles de la ordne</Link>
            <Link to="/" className="btn btn-light btn-lg px-4 py-2 ">Continuar comprando</Link>

            </span>

        </div>
    </div>
    </header>
  )
}

export default PaymentStatusPage
