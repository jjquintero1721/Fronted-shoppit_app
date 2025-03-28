import React from 'react';
import styles from './ProfileCard.module.css';

const ProfileCard = ({ image, name, role, description, socialLinks }) => {
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileImageContainer}>
        <img src={image} alt={name} className={styles.profileImage} />
      </div>
      <div className={styles.profileContent}>
        <h3 className={styles.profileName}>{name}</h3>
        <h4 className={styles.profileRole}>{role}</h4>
        <p className={styles.profileDescription}>{description}</p>
        
        {socialLinks && (
          <div className={styles.socialLinks}>
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                className={styles.socialLink} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;