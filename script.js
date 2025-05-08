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

// Link para pedir autorización a la API
// https://cors-anywhere.herokuapp.com/corsdemo

function buscarAlbumes() {
  const termino = document.getElementById('searchbar').value;
  const url = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/album?q=${encodeURIComponent(termino)}`;

  fetch(url)
    .then(res => {
      if (res.status === 429) {
        alert("Has hecho demasiadas solicitudes. Esperá unos segundos e intentá de nuevo.");
        throw new Error("Too Many Requests");
      }
      return res.json();
    })
    .then(data => {
      const contenedor = document.getElementById('searchdisplay');
      contenedor.innerHTML = '';

      if (data.data.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron álbumes.</p>';
        return;
      }

      data.data.slice(0, 10).forEach(album => {
        const albumDetallesUrl = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/album/${album.id}`;

        fetch(albumDetallesUrl)
          .then(res => {
            if (res.status === 429) {
              alert("Has hecho demasiadas solicitudes. Esperá unos segundos e intentá de nuevo.");
              throw new Error("Too Many Requests");
            }
            return res.json();
          })
          .then(detalles => {
            const generos = detalles.genres?.data?.map(g => g.name).join(', ') || "Desconocido";

            contenedor.innerHTML += `
              <div class="albumItem">
                <div class="AlbumImageAndTitle">
                    <img src="${album.cover}" alt="Portada del álbum" class="searchImageAndTitle">
                    <br><strong>${album.title}</strong></br>
                </div>
                <div class="AlbumDetails">
                  <p>Artista: ${album.artist.name}</p>
                  <p>Año: ${new Date(detalles.release_date).getFullYear()}</p>
                  <p>Géneros: ${generos}</p>
                  <p>Duración: ${convertirSegundos(detalles.duration)}</p>
                </div>
              </div>
            `;
          })
          .catch(err => {
            console.error(`Error al obtener detalles del álbum ID ${album.id}:`, err);
          });
      });
    })
    .catch(err => {
      console.error('Error al obtener álbumes:', err);
    });
}


