import React from 'react';
import ProfileCard from './ProfileCard';
import styles from './ContactPage.module.css';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';

// Import your team member profile images
// You'll need to add these images to your project
import defaultProfile from '../../assets/158487709.jpg'; // Create a default profile image

const ContactPage = () => {
  // Team member data
  const teamMembers = [
    {
      id: 1,
      name: 'Juan Jose Quintero',
      role: 'La pampara',
      image: defaultProfile, // Replace with actual image
      description: 'Líder del equipo no elaboro nada lo hizo todo la IA, le gusta molestar a arle.',
      socialLinks: [
        { name: 'LinkedIn', url: 'https://linkedin.com/', icon: <FaLinkedin /> },
        { name: 'GitHub', url: 'https://github.com/jjquintero1721', icon: <FaGithub /> },
        { name: 'Email', url: 'jjquintero_9@cue.edu.co', icon: <FaEnvelope /> }
      ]
    },
    {
      id: 2,
      name: 'Nicolas Santiago Carmona',
      role: 'Puso Presencia',
      image: defaultProfile, // Replace with actual image
      description: 'Experto en ser negro, estuvo 3 dias intentando desplegar un trabajo.',
      socialLinks: [
        { name: 'LinkedIn', url: 'https://linkedin.com/', icon: <FaLinkedin /> },
        { name: 'GitHub', url: 'https://github.com/Nsantg', icon: <FaGithub /> },
        { name: 'Email', url: 'nscarmona_170@cue.edu.co', icon: <FaEnvelope /> }
      ]
    },
    {
      id: 3,
      name: 'Miguel Bedoya Leon',
      role: 'Tambien puso presencia',
      image: defaultProfile, // Replace with actual image
      description: 'Experto en comer y en hablar mierda, segun el el hizo todos los proyectos finales anteriores.',
      socialLinks: [
        { name: 'LinkedIn', url: 'https://linkedin.com/', icon: <FaLinkedin /> },
        { name: 'Instagram', url: 'https://instagram.com/', icon: <FaInstagram /> },
        { name: 'Email', url: 'mailto:maria@aiag.com', icon: <FaEnvelope /> }
      ]
    },
    {
      id: 4,
      name: 'Carlos Artuto (Archu)',
      role: 'Llego en unltimo momento',
      image: defaultProfile, // Replace with actual image
      description: 'Experto en ChatGpt y en ia "de eso va su carrera".',
      socialLinks: [
        { name: 'LinkedIn', url: 'https://linkedin.com/', icon: <FaLinkedin /> },
        { name: 'Instagram', url: 'https://instagram.com/', icon: <FaInstagram /> },
        { name: 'Email', url: 'mailto:javier@aiag.com', icon: <FaEnvelope /> }
      ]
    }
  ];

  return (
    <div className={styles.contactPage}>
      <div className="container py-5">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Nuestro Equipo</h1>
          <p className={styles.pageDescription}>
            Conoce al talentoso equipo detrás de A.I.A.G. Cada miembro aporta habilidades únicas
            para ofrecerte la mejor experiencia en videojuegos.
          </p>
        </div>

        <div className="row g-4">
          {teamMembers.map(member => (
            <div key={member.id} className="col-md-6 col-lg-3">
              <ProfileCard
                image={member.image}
                name={member.name}
                role={member.role}
                description={member.description}
                socialLinks={member.socialLinks}
              />
            </div>
          ))}
        </div>

        <div className={styles.contactSection}>
          <h2 className={styles.contactTitle}>Contáctanos</h2>
          <p className={styles.contactDescription}>
            ¿Tienes preguntas sobre nuestros productos o servicios? ¡Estamos aquí para ayudarte!
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>jjquintero_9@cue.edu.co</span>
            </div>
            <div className={styles.contactItem}>
              <i className="bi bi-telephone-fill"></i>
              <span>+57 313 7082781</span>
            </div>
            <div className={styles.contactItem}>
              <i className="bi bi-geo-alt-fill"></i>
              <span>Debajo de un puente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;