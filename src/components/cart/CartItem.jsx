import { useState } from 'react';
import { BASE_URL } from '../../api';
import api from '../../api';
import { toast } from "react-toastify";
import styles from './CartItem.module.css';

const CartItem = ({ item, setCartTotal, setCartItems, cartItems, setNumberCartItems }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const itemData = { quantity: quantity, item_id: item.id };
  const itemID = { item_id: item.id };

  function deleteCartItem() {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este item?");
    if (confirmDelete) {
      api.post("delete_cartitem", itemID)
        .then(res => {
          toast.success("Item del carrito eliminado correctamente");
          setCartItems(cartItems.filter(cartItem => cartItem.id != item.id));
          setCartTotal(cartItems.filter((cartItem) => cartItem.id != item.id)
            .reduce((acc, curr) => acc + curr.total, 0));

          setNumberCartItems(cartItems.filter((cartItem) => cartItem.id != item.id)
            .reduce((acc, curr) => acc + curr.quantity, 0));
        })
        .catch(err => {
          console.log(err.message);
          toast.error("Error al eliminar el item del carrito");
        });
    }
  }

  function updateCartItem() {
    if (quantity < 1) {
      toast.error("La cantidad debe ser al menos 1");
      setQuantity(1);
      return;
    }
    
    setLoading(true);
    api.patch("update_quantity/", itemData)
      .then(res => {
        setLoading(false);
        toast.success("Item del carrito actualizado correctamente");
        setCartTotal(cartItems.map((cartItem) => cartItem.id === item.id ? res.data.data : cartItem)
          .reduce((acc, curr) => acc + curr.total, 0));

        setNumberCartItems(cartItems.map((cartItem) => cartItem.id === item.id ? res.data.data : cartItem)
          .reduce((acc, curr) => acc + curr.quantity, 0));
      })
      .catch(err => {
        console.log(err.message);
        setLoading(false);
        toast.error("Error al actualizar el item del carrito");
      });
  }

  return (
    <div className="col-md-12">
      <div className={styles.cartItemContainer}>
        <div className="d-flex align-items-center">
          <div className={styles.imageContainer}>
            <img
              src={`${BASE_URL}${item.product.image}`}
              alt={item.product.name}
              className={styles.productImage}
            />
          </div>
          
          <div className={styles.productInfo}>
            <h5 className={styles.productName}>{item.product.name}</h5>
            <p className={styles.productPrice}>${item.product.price}</p>
          </div>
          
          <div className={styles.quantityControl}>
            <input
              type="number"
              min="1"
              className={styles.quantityInput}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <button 
              className={`${styles.updateButton} mx-2`}
              onClick={updateCartItem}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button 
              className={styles.deleteButton}
              onClick={deleteCartItem}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;