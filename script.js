// Referência para a galeria de miniaturas
const gallery = document.getElementById('gallery');

// Referência para a imagem grande principal
const mainImage = document.getElementById('main-image');

// Referência para o título da imagem
const imageTitle = document.getElementById('image-title');

// URL da API do Flickr com imagens interessantes (sem localização)
const flickrUrl = 'https://www.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=1d49ddb0af7a7a2bc8145756f38d677a&per_page=50&format=json&nojsoncallback=1';

// Faz uma requisição à API do Flickr
fetch(flickrUrl)
  .then(response => response.json()) // Converte a resposta para JSON
  .then(data => {
    const photos = data.photos.photo; // Extrai a lista de fotos

    // Itera por cada foto da lista
    for (const photo of photos) {
      // URL da miniatura da imagem (tamanho pequeno)
      const thumbUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;

      // URL da imagem em tamanho grande
      const fullUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;

      // Cria um elemento <img> para a miniatura
      const img = document.createElement('img');
      img.src = thumbUrl;
      img.alt = photo.title;

      // Ao clicar na imagem, mostra a imagem grande e o título
      img.addEventListener('click', () => {
        mainImage.src = fullUrl;
        imageTitle.textContent = photo.title || 'Sem descrição';
      });

      // Efeito de hover para opacidade
      img.addEventListener('mouseenter', () => {
        gallery.classList.add('hover-active');
        img.classList.add('hovered');
      });

      // Sai do hover, remove classes de efeito
      img.addEventListener('mouseleave', () => {
        gallery.classList.remove('hover-active');
        img.classList.remove('hovered');
      });

      // Adiciona a miniatura na galeria
      gallery.appendChild(img);
    }
  })
  .catch(error => console.error('Erro ao buscar imagens:', error)); // Mostra erro se a API falhar
