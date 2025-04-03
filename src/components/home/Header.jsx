import React from 'react'

const Header = () => {
  return (
    <header className="py-5" style={{
      backgroundImage: 'url("https://mir-s3-cdn-cf.behance.net/project_modules/1400/641c2b170466977.645e34a7760bf.gif")', // Replace with your GIF path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="container px-4 px-lg-5 my-5"> 
            <div className="text-center text-white">
                <h1 className="display-4 fw-bolder" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                  Bienvenido a A.I.A.G
                </h1>
                <p className="lead fw-normal text-white mb-4" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>
                  Tu tienda favorita y el futuro del mercado online
                </p>
                <a href='#shop' className="btn btn-light btn-lg rounded-pill px-4 py-2">
                  Comprar ahora
                </a>
            </div>
        </div>
    </header>
  )
}

export default Header