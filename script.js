const gallery = document.getElementById('gallery');
const mainImage = document.getElementById('main-image');
const imageTitle = document.getElementById('image-title');
const mapContainer = document.getElementById('map');

let map;
let marker;

const flickrUrl = 'https://www.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=b5543b9dc0abf356d5dc8b79ee3dc8c3&per_page=50&format=json&nojsoncallback=1';

fetch(flickrUrl)
  .then(response => response.json())
  .then(data => {
    const photos = data.photos.photo;

    for (const photo of photos) {
      const thumbUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
      const fullUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;

      const img = document.createElement('img');
      img.src = thumbUrl;
      img.alt = photo.title;

      img.addEventListener('click', () => {
        mainImage.src = fullUrl;
        imageTitle.textContent = photo.title || 'Sem descrição';

        const lat = parseFloat(photo.latitude);
        const lon = parseFloat(photo.longitude);

        // Remove mensagem anterior
        const existingMsg = document.getElementById('map-message');
        if (existingMsg) existingMsg.remove();

        if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
          if (!map) {
            map = L.map('map').setView([lat, lon], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            marker = L.marker([lat, lon]).addTo(map);
          } else {
            map.flyTo([lat, lon], 12, {
              animate: true,
              duration: 1.2
            });
            marker.setLatLng([lat, lon]);

            setTimeout(() => {
              map.invalidateSize();
            }, 300);
          }
        } else {
          const msg = document.createElement('p');
          msg.id = 'map-message';
          msg.style.color = 'grey';
          msg.textContent = 'Sem localização disponível para esta imagem.';
          mapContainer.appendChild(msg);
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
  })
  .catch(error => console.error('Erro ao buscar imagens:', error));
