// ==== CONFIGURAÇÃO FIREBASE ====
const firebaseConfig = {
  apiKey: "AIzaSyCMJ5ZxSZLEZo5zf0xeWyVSWI8A7J0jMK8",
  authDomain: "programacao-web-895cc.firebaseapp.com",
  databaseURL: "https://programacao-web-895cc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "programacao-web-895cc",
  storageBucket: "programacao-web-895cc.firebasestorage.app",
  messagingSenderId: "274307303993",
  appId: "1:274307303993:web:d2071fbd3f34c6a5c15be8"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ==== ELEMENTOS DO DOM ====
const gallery = document.getElementById('gallery');
const mainImage = document.getElementById('main-image');
const imageTitle = document.getElementById('image-title');
const mapContainer = document.getElementById('map');
const likeBtnContainer = document.getElementById('like-button-container');

let map;
let marker;

const flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=28e1be2b4c47585b2a2994c6a7c14c9b&has_geo=1&extras=geo,url_m&sort=interestingness-desc&per_page=100&format=json&nojsoncallback=1';

// ==== FUNÇÃO PARA GUARDAR LIKE NO FIREBASE ====
function salvarLikeFirebase(photo, lat, lon) {
  if (!photo.id) return;

  const likeRef = database.ref('likes/' + photo.id);

  likeRef.once('value').then(snapshot => {
    if (snapshot.exists()) {
      alert('Já curtiste esta imagem!');
    } else {
      likeRef.set({
        title: photo.title || 'Sem título',
        latitude: lat,
        longitude: lon
      }).then(() => {
        alert('Imagem curtida com sucesso!');
      }).catch(() => {
        alert('Erro ao curtir imagem.');
      });
    }
  });
}

// ==== FETCH DAS IMAGENS DO FLICKR ====
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

        // Limpa botão like antigo
        likeBtnContainer.innerHTML = '';

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

        // Cria botão de curtir
        const likeBtn = document.createElement('button');
        likeBtn.textContent = '❤️ Curtir';
        likeBtn.id = 'like-button';
        likeBtn.style.marginTop = '10px';
        likeBtn.style.fontSize = '18px';
        likeBtn.style.cursor = 'pointer';
        likeBtn.style.padding = '8px 12px';
        likeBtn.style.borderRadius = '8px';
        likeBtn.style.border = 'none';
        likeBtn.style.backgroundColor = '#ff6b81';
        likeBtn.style.color = 'white';

        // Coloca o botão no container certo
        likeBtnContainer.appendChild(likeBtn);

        likeBtn.addEventListener('click', () => {
          salvarLikeFirebase(photo, lat, lon);
        });
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

    // Clica automaticamente na primeira imagem
    if (gallery.firstChild) {
      gallery.firstChild.click();
    }
  })
  .catch(error => console.error('Erro ao buscar imagens:', error));
