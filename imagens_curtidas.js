const firebaseConfig = {
  apiKey: "AIzaSyCMJ5ZxSZLEZo5zf0xeWyVSWI8A7J0jMK8",
  authDomain: "programacao-web-895cc.firebaseapp.com",
  databaseURL: "https://programacao-web-895cc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "programacao-web-895cc",
  storageBucket: "programacao-web-895cc.appspot.com",
  messagingSenderId: "274307303993",
  appId: "1:274307303993:web:d2071fbd3f34c6a5c15be8"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const container = document.getElementById('liked-gallery');

database.ref('likes').once('value')
  .then(snapshot => {
    const likes = snapshot.val();
    if (!likes) {
      container.innerHTML = '<p style="color: gray;">Nenhuma imagem curtida ainda.</p>';
      return;
    }

    Object.values(likes).forEach(data => {
      const item = document.createElement('div');
      item.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = data.url || '';
      img.alt = data.title || 'Sem título';

      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.textContent = data.title || 'Sem título';

      item.appendChild(img);
      item.appendChild(caption);
      container.appendChild(item);
    });
  })
  .catch(err => {
    console.error('Erro ao carregar imagens curtidas:', err);
    container.innerHTML = '<p style="color: red;">Erro ao carregar imagens.</p>';
  });
