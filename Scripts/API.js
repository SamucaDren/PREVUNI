async function getToken() {
  const payload = {
    email: "hackathon@unifenas.br",
    password: "hackathon#2025",
  };

  try {
    const response = await fetch("https://api.unifenas.br/v1/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data); // <-- Veja aqui o que a API retorna

    if (!response.ok) {
      throw new Error(data.message || "Erro na requisição");
    }

    return data.access_token;
  } catch (error) {
    console.error("Erro ao obter token:", error.message);
  }
}

// Função para listar usuários
async function listarUsuarios(token) {
  try {
    const response = await fetch("https://api.unifenas.br/v1/moodle/usuarios", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Erro ao listar usuários:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return [];
  }
}

// Função para carregar os usuários na página
async function carregarUsuarios() {
  const container = document.getElementById("us_cont");

  // Obter o token
  const token = await getToken();

  if (!token) {
    container.innerHTML = "Erro ao obter token. Verifique suas credenciais.";
    return;
  }

  // Listar usuários
  const usuarios = await listarUsuarios(token);

  if (usuarios.length === 0) {
    container.innerHTML = "Nenhum usuário encontrado.";
    return;
  }

  container.innerHTML = ""; // Limpar qualquer conteúdo anterior

  usuarios.forEach((user) => {
    // Criar os elementos HTML para cada usuário
    const div = document.createElement("div");
    div.className = "flex QuadroCards_List coluna";
    div.style.gap = "24px";

    div.innerHTML = `
          <div class="linha" style="align-items: center">
            <img src="icons/caderno.svg" height="16px" />
            <h4 class="corPreta40B">${user.name}</h4>
          </div>
          <div class="coluna" style="gap: 4px">
            <span class="subH4 corCinza60B">Prof: ${user.user_id}</span>
            <span class="subH4 corCinza60B">Último Acesso: ${user.user_lastaccess}</span>
          </div>
          <div class="linha">
            <div class="linha cur_porcVerd" style="gap: 8px">
              <img src="icons/rostofeliz.svg" height="16px" />
              <span class="cur_porcFont corCinza80B">50%</span>
            </div>
            <div class="linha cur_porcAzul" style="gap: 8px">
              <img src="icons/rostosememocao.svg" height="16px" />
              <span class="cur_porcFont corCinza80B">50%</span>
            </div>
            <div class="linha cur_porcVerm" style="gap: 8px">
              <img src="icons/rostotriste.svg" height="16px" />
              <span class="cur_porcFont corCinza80B">50%</span>
            </div>
          </div>
        `;
    container.appendChild(div);
  });
}

// Adiciona o evento de clique no botão assim que o DOM for carregado
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("carregarUsuariosBtn");
  btn.addEventListener("click", carregarUsuarios);
});
