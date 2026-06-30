import { useState, useEffect } from "react"
import { products } from "./data/products"
import "./App.css"

function App() {
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filter, setFilter] = useState("all")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)


  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) setCart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => p.category === filter)

  const getPrice = (size) => {
    if (size === "30x40") return 20
    if (size === "42x59") return 30
    if (size === "50x70") return 35
    return 0
  }
const isSuccessPage = window.location.pathname === "/success";

if (isSuccessPage) {
  localStorage.removeItem("cart");

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>✅ Thank you for your order!</h1>
      <p>Your payment was successful.</p>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
        onClick={() => (window.location.href = "/")}
      >
        Back to shop
      </button>
    </div>
  );
}
  return (
    <div className="container">

      {/* HEADER */}
      <header className="header">
        <div className="logo">NoLabelArt</div>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div className="mini-cart" onClick={() => setIsCartOpen(true)}>
          🛒 {cart.reduce((sum, item) => sum + item.qty, 0)}
        </div>
      </header>

      {/* PRODUCTS */}
      <section className="products">
      <h2 className="section-title">Posters</h2>

        <div className="grid">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="card"
              onClick={() => {
                setSelectedProduct(p)
                setSelectedSize(null) // reset size
              }}
            >
              <img src={p.img} alt={p.name} />
              <p>{p.name}</p>
              <span>From €{getPrice("30x40")}</span>

            </div>
          ))}
        </div>
      </section>

      {/* CHECKOUT */}
      {checkoutOpen && (
        <div className="checkout-overlay">
          <div className="checkout">
            <button
  className="close-btn"
  onClick={() => setCheckoutOpen(false)}
>
  ✖
</button>
            <h2>Checkout</h2>

            <p>
              Total: €
              {cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
            </p>

            <button
              disabled={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => {
                  setLoading(false)
                  setSuccess(true)
                  setCheckoutOpen(false)
                  setCart([])
                }, 1000)
              }}
            >
              {loading ? "Processing..." : "Pay now"}
            </button>
          </div>
        </div>
      )}

      {/* CART */}
      {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-drawer">
            
<button
    className="close-btn"
    onClick={() => setIsCartOpen(false)}
  >
    ✖
  </button>

            <h3>Your Cart</h3>

            {cart.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              <>
                {cart.map((item) => (
  <div key={item.id} className="cart-item">
    <span>
      {item.name} ({item.size})
    </span>

    <span>
      €{(item.price * item.qty).toFixed(2)}
    </span>
  </div>
))}

<h4>
  Total: €
  {cart
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2)}
</h4>

<button
  onClick={async () => {
    console.log("12345");
    const response = await fetch("https://nolabelart-server.onrender.com/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cart })
    });

    const data = await response.json();
    window.location.href = data.url;
  }}
>
  Pay for order 💳
</button>

<button onClick={() => setCheckoutOpen(true)}>
  Checkout
</button>
``
              </>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="success-overlay">
          <div className="success-box">
            <h1>✅ Payment successful</h1>
            <button onClick={() => setSuccess(false)}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {selectedProduct && (

        <div
          className="product-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedProduct.img} alt="" />
            <h2>{selectedProduct.name}</h2>
            <p className="product-extra">
  Printed on high-quality matte paper. Perfect for modern interiors.
</p>

<ul className="product-details">
  <li>✔ High quality print</li>
  <li>✔ 200g premium paper</li>
  <li>✔ Shipped in protective tube</li>
</ul>

            <h3>
              €{selectedSize ? getPrice(selectedSize) : selectedProduct.price}
            </h3>

           <div className="size-picker">
  <button
    className={selectedSize === "30x40" ? "active" : ""}
    onClick={() => setSelectedSize("30x40")}
  >
    30×40
  </button>

  <button
    className={selectedSize === "42x59" ? "active" : ""}
    onClick={() => setSelectedSize("42x59")}
  >
    42×59
  </button>

  <button
    className={selectedSize === "50x70" ? "active" : ""}
    onClick={() => setSelectedSize("50x70")}
  >
    50×70
  </button>
</div>

            <button
              disabled={!selectedSize}
              onClick={() => {
                setCart((prev) => [
                  ...prev,
                  {
                    ...selectedProduct,
                    size: selectedSize,
                    price: getPrice(selectedSize),
                    qty: 1
                  }
                ])
                setSelectedProduct(null)
              }}
            >
              {selectedSize ? "Add to cart" : "Select size"}
            </button>
            <button
  disabled={!selectedSize}
  onClick={() => {
    window.open("https://buy.stripe.com/test_7sY4gtfsl5cU9FD6cCfw400")
  }}
>
  Pay now 💳
</button>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
