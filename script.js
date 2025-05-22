const gallery = document.getElementById('gallery');
const mainImage = document.getElementById('main-image');
const imageTitle = document.getElementById('image-title');
const mapContainer = document.getElementById('map');

let map;
let marker;

const flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b5543b9dc0abf356d5dc8b79ee3dc8c3&has_geo=1&extras=geo,url_m&sort=interestingness-desc&per_page=100&format=json&nojsoncallback=1';

fetch(flickrUrl)
  .then(response => response.json())
  .then(data => {
    const photos = data.photos.photo;

    for (const photo of photos) {
      const thumbUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
      const fullUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
      const lat = parseFloat(photo.latitude);
      const lon = parseFloat(photo.longitude);

      const img = document.createElement('img');
      img.src = thumbUrl;
      img.alt = photo.title;

      img.addEventListener('click', () => {
        mainImage.src = fullUrl;
        mainImage.alt = photo.title;
        imageTitle.textContent = photo.title || 'Sem descrição';

        // Limpa mapa anterior
        if (map) {
          map.remove();
          map = null;
        }

        // Verifica localização
        if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
          mapContainer.innerHTML = ''; // limpa mensagens antigas
          map = L.map('map').setView([lat, lon], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          marker = L.marker([lat, lon]).addTo(map)
                   .bindPopup(photo.title || 'Sem título')
                   .openPopup();
        } else {
          mapContainer.innerHTML = '<p style="color: grey;">Sem localização disponível para esta imagem.</p>';
        }
      });

      img.addEventListener('mouseenter', () => {
        gallery.classList.add('hover-active');
        img.classList.add('hovered');
      });

      img.addEventListener('mouseleave', () => {
        gallery.classList.remove('hover-active');
        img.classList.remove('hovered');
      });

      gallery.appendChild(img);
    }

    if (gallery.firstChild) {
      gallery.firstChild.click();
    }
  })
  .catch(error => console.error('Erro ao buscar imagens:', error));

