// src/components/product/RelatedProducts.jsx
import HomeCard from "../home/HomeCard"

const RelatedProducts = ({products}) => {
  return (
    <section className="py-3" 
      style={{
        backgroundImage: 'url("https://mir-s3-cdn-cf.behance.net/project_modules/1400/b32a8c179531059.64fb11033cc3c.gif")', // Replace with your GIF path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#121212',
        position: 'relative'
      }}>
      {/* Overlay to ensure text readability on top of the GIF */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }}></div>
      
      <div className="container px-4 px-lg-5 mt-3" style={{position: 'relative', zIndex: 2}}>
        <h2 className="fw-bolder mb-4" style={{color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
          Productos Relacionados
        </h2>
        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-x1-4 justify-content-center">
          {products.map(product => <HomeCard key={product.id} product={product} />) }
        </div>
      </div>
    </section>
  )
}

export default RelatedProducts