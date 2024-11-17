let accessToken;

async function loadAccessToken() {
  try {
    const response = await fetch('./config.json');
    const data = await response.json();
    accessToken = data.accessToken;
  } catch (error) {
    console.error('Erro ao carregar o token:', error);
  }
}

async function inicializar() {
  await loadAccessToken();
  carregarModelos();
}

let paginaAtual = 1; // Página inicial para a API
const modelosPorPagina = 6;

async function carregarModelos() {
  if (!accessToken) {
    console.error('Token de acesso não disponível');
    return;
  }

  const url = `https://api.thingiverse.com/search?q=3d&access_token=${accessToken}&per_page=${modelosPorPagina}&page=${paginaAtual}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.hits.length > 0) {
      const container = document.getElementById('modelos-container');

      data.hits.forEach(modelo => {
        const card = document.createElement('div');
        card.classList.add('model-card');

        const imagem = modelo.preview_image ? modelo.preview_image : 'https://via.placeholder.com/250x200?text=Imagem+não+disponível';
        const titulo = modelo.name;
        const urlModelo = modelo.public_url;

        card.innerHTML = `
          <a href="${urlModelo}" target="_blank">
            <img src="${imagem}" alt="Model Image">
          </a>
          <div>
            <h3>${titulo}</h3>
          </div>
        `;

        container.appendChild(card);
      });

      paginaAtual++;
    } else {
      console.log('Não há mais modelos ou erro na resposta');
    }
  } catch (error) {
    console.error('Erro ao carregar modelos:', error);
    alert('Ocorreu um erro ao carregar os modelos. Recarregue a página...');
  }
}

function carregarMaisModelos() {
  carregarModelos();
}

window.onload = inicializar;