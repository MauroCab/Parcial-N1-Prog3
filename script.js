function showSection(id) {
  // Selecciona todas las etiquetas <section>
  const sections = document.querySelectorAll('section');
    
  // Recorre todas las secciones
  sections.forEach(section => {
    // Si el id coincide, la muestra, si no, la oculta
    section.style.display = (section.id === id) ? 'block' : 'none';
  });
}

function convertirSegundos(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;

  // Opcional: agregar ceros a la izquierda para que quede como 01:05:09
  const formato = (n) => n.toString().padStart(2, '0');

  return `${formato(horas)}:${formato(minutos)}:${formato(segs)}`;
}

// https://cors-anywhere.herokuapp.com/corsdemo

function buscarAlbumes() {
  const termino = document.getElementById('searchbar').value;
  const url = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/album?q=${encodeURIComponent(termino)}`;
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById('searchdisplay');
      contenedor.innerHTML = '';

      if (data.data.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron álbumes.</p>';
        return;
      }

      data.data.slice(0, 10).forEach(album => {
        console.log(album.release_date);
       contenedor.innerHTML += `
          <div class="albumItem">
            <div class="AlbumImageAndTitle">
                <img src="${album.cover}" alt="Portada del álbum" class="searchImageAndTitle">
                <br><strong>${album.title}</strong></br>
            </div>
            <div class="AlbumDetails">
              <p>Artista: ${album.artist.name}</p>
              <p>Año: ${album.release_date}</p>
              <p>Duración: ${convertirSegundos(album.duration)}</p>
            </div>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error('Error al obtener álbumes:', err);
    });
}
