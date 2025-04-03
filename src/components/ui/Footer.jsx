// src/components/ui/Footer.jsx
import React from 'react'
import { FaFacebook } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="py-3 bg-dark text-light">
        <div className="container text-center">
            {/* Quick links section */}
            <div className="mb-2">
                <a href="#" className="text-light text-decoration-none mx-2">Casa</a>
                <a href="#" className="text-light text-decoration-none mx-2">Sobre</a>
                <a href="#" className="text-light text-decoration-none mx-2">Tienda</a>
                <a href="/contact" className="text-light text-decoration-none mx-2">Contacto</a>
            </div>
        {/* social media icons section */}
            <div className="mb-2">
                <a href="#" className="text-light mx-2"><FaFacebook/></a>
                <a href="#" className="text-light mx-2"><FaTwitter/></a>
                <a href="#" className="text-light mx-2"><FaInstagram/></a>
            </div>

        {/* Copyright Section */}
            <p className="small mb-0">&copy; 2025 A.I.A.G </p>
        </div>
    </footer>
  )
}

export default Footer