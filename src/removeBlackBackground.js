// Coloca este código en un archivo JavaScript que se ejecute después de cargar la página
// Por ejemplo, puedes crear un nuevo archivo src/removeBlackBackground.js

// Función para eliminar el fondo negro de Productos Relacionados
function removeBlackBackground() {
    // Buscar el título "Productos Relacionados"
    const headings = document.querySelectorAll('h2');
    let targetSection = null;
    
    headings.forEach(heading => {
      if (heading.textContent.includes('Productos Relacionados')) {
        // Encontrar el contenedor padre grande
        let parentContainer = heading.closest('.container');
        
        if (parentContainer) {
          // Buscar hacia arriba el contenedor negro que queremos eliminar
          let section = parentContainer.parentElement;
          if (section) {
            // Si hay algún elemento div entre el section y el container, ese es nuestro objetivo
            let blackBackground = Array.from(section.children).find(child => 
              child !== parentContainer && 
              child.tagName.toLowerCase() === 'div'
            );
            
            if (blackBackground) {
              // Eliminar el fondo negro
              blackBackground.style.backgroundColor = 'transparent';
              blackBackground.style.boxShadow = 'none';
              blackBackground.style.border = 'none';
            }
            
            // También podemos intentar buscar cualquier div que sea un contenedor directo del section
            for (let i = 0; i < section.children.length; i++) {
              let child = section.children[i];
              // Si no es el contenedor principal y parece ser un div de fondo
              if (child !== parentContainer && child.tagName.toLowerCase() === 'div') {
                child.style.backgroundColor = 'transparent';
                child.style.boxShadow = 'none';
                child.style.border = 'none';
              }
            }
          }
        }
      }
    });
  }
  
  // Ejecutar después de que la página se haya cargado completamente
  window.addEventListener('load', removeBlackBackground);
  
  // También ejecutar cuando cambia la URL (navegación entre páginas)
  window.addEventListener('popstate', removeBlackBackground);
  
  // Para sitios que utilizan navegación sin recargar la página completa
  // ejecutar periódicamente para asegurarnos de capturar todos los cambios
  setInterval(removeBlackBackground, 1000);