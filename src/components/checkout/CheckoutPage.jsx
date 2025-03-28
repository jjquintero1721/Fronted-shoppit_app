import OrderSummary from "./OrderSummary"
import PaymentSection from "./PaymentSection"
import useCartData from "../../hooks/useCartData"

const CheckoutPage = () => {

    const {cartItems, setCartItems, cartTotal, setCartTotal, tax, loading} = useCartData()

  return (
    <div className="container my-3">
        <div className="row">
            <OrderSummary cartItems={cartItems} cartTotal={cartTotal} tax={tax} />
            <PaymentSection />
        </div>
    </div>
  )
}

export default CheckoutPage
