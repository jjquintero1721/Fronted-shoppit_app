import { useEffect, useState } from "react";
import ProductPagePlaceHolder from "./ProductPagePlaceHolder";
import RelatedProducts from "./RelatedProducts";
import { useParams } from "react-router-dom";
import api from "../../api";
import { BASE_URL } from "../../api";
import { toast } from "react-toastify";
import styles from "./ProductPage.module.css";

const ProductPage = ({ setNumberCartItems }) => {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(false);
  const cart_code = localStorage.getItem("cart_code");

  // We'll directly use the product image without loading/error states
  // This is because the error handling was causing issues

  useEffect(() => {
    if (product.id) {
      api
        .get(`product_in_cart?cart_code=${cart_code}&product_id=${product.id}`)
        .then((res) => {
          setInCart(res.data.product_in_cart);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [cart_code, product.id]);

  const newItem = { cart_code: cart_code, product_id: product.id };

  function add_item() {
    api
      .post("add_item/", newItem)
      .then((res) => {
        setInCart(true);
        toast.success("Producto añadido al carrito");
        setNumberCartItems((curr) => curr + 1);
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Error al añadir al carrito");
      });
  }

  useEffect(() => {
    setLoading(true);
    api
      .get(`/product_detail/${slug}`)
      .then((res) => {
        console.log("Product data:", res.data);
        setProduct(res.data);
        setSimilarProducts(res.data.similar_products);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        toast.error("Error al cargar el producto");
      });
  }, [slug]);

  if (loading) {
    return <ProductPagePlaceHolder />;
  }

  return (
    <div>
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-5 align-items-center">
            <div className="col-md-6">
              <div className={styles.productImageContainer}>
                {product.category && (
                  <span className={styles.categoryBadge}>{product.category}</span>
                )}
                {/* Directly display the image without conditionals */}
                <img
                  className={styles.productImage}
                  src={`${BASE_URL}${product.image}`}
                  alt={product.name}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="small mb-1">SKU: GAME-{product.id || "000"}</div>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <div className={styles.productPrice}>${product.price}</div>
              <p className={styles.productDescription}>{product.description}</p>
              <div className="d-flex">
                <button
                  className={`btn btn-primary ${styles.addToCartButton}`}
                  type="button"
                  onClick={add_item}
                  disabled={inCart}
                >
                  <i className="bi-cart-fill me-1"></i>
                  {inCart ? "Producto añadido al carrito" : "Añadir al carro"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={similarProducts} />
    </div>
  );
};

export default ProductPage;