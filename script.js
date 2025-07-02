const guerreiros = [
  { id: 1, nome: "peka", img: "img/peka.png", ataque: 130, defesa: 100 },
  { id: 2, nome: "gigante", img: "img/gigante.png", ataque: 90, defesa: 140 },
  { id: 3, nome: "Mago", img: "img/mago.png", ataque: 110, defesa: 80 },
  { id: 4, nome: "Princesa", img: "img/princesa.png", ataque: 95, defesa: 70 },
  { id: 5, nome: "Dragão", img: "img/dragão.png", ataque: 100, defesa: 90 },
  { id: 6, nome: "Lancador", img: "img/lancador.png", ataque: 85, defesa: 95 },
  { id: 7, nome: "globins", img: "img/globins.png", ataque: 70, defesa: 60 },
  { id: 8, nome: "Esqueleto Gigante", img: "img/esqueleto.png", ataque: 105, defesa: 85 }
];

const containerGuerreiros = document.getElementById("guerreiros");
const drop1 = document.getElementById("drop1");
const drop2 = document.getElementById("drop2");
const status = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let dragged = null;

function criarCards() {
  guerreiros.forEach(g => {
    const card = document.createElement("div");
    card.classList.add("guerreiro-card");
    card.setAttribute("draggable", true);
    card.dataset.id = g.id;

    card.innerHTML = `
      <div class="icone"><img src="${g.img}" alt="${g.nome}"></div>
      <div class="nome">${g.nome}</div>
      <div class="stats">
        <span class="atk">ATK: ${g.ataque}</span>
        <span class="def">DEF: ${g.defesa}</span>
      </div>
    `;

    card.addEventListener("dragstart", () => {
      dragged = card;
      setTimeout(() => card.classList.add("dragging"), 0);
    });

    card.addEventListener("dragend", () => {
      dragged = null;
      card.classList.remove("dragging");
    });

    containerGuerreiros.appendChild(card);
  });
}

function allowDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.add("dragover");
}

function removeDropHighlight(e) {
  e.currentTarget.classList.remove("dragover");
}

function dropGuerreiro(e) {
  e.preventDefault();
  e.currentTarget.classList.remove("dragover");

  if (!dragged) return;

  const prevCard = e.currentTarget.querySelector(".guerreiro-card");
  if (prevCard) containerGuerreiros.appendChild(prevCard);

  e.currentTarget.innerHTML = "";
  e.currentTarget.appendChild(dragged);
  dragged.classList.remove("dragging");

  updateStatus();
}

function updateStatus() {
  const arena1Guerreiro = drop1.querySelector(".guerreiro-card");
  const arena2Guerreiro = drop2.querySelector(".guerreiro-card");

  if (!arena1Guerreiro && !arena2Guerreiro) {
    status.querySelector("p").textContent = "Aguardando guerreiros...";
    return;
  }

  if (!arena1Guerreiro || !arena2Guerreiro) {
    status.querySelector("p").textContent = "Arraste guerreiros para as duas arenas!";
    return;
  }

  const g1 = guerreiros.find(g => g.id == arena1Guerreiro.dataset.id);
  const g2 = guerreiros.find(g => g.id == arena2Guerreiro.dataset.id);

  const poder1 = g1.ataque + g1.defesa;
  const poder2 = g2.ataque + g2.defesa;

  let resultado = "";
  if (poder1 > poder2) {
    resultado = `🏆 ${g1.nome} vence a batalha!`;
  } else if (poder2 > poder1) {
    resultado = `🏆 ${g2.nome} vence a batalha!`;
  } else {
    resultado = "🤝 A batalha terminou empatada!";
  }

  status.querySelector("p").textContent = resultado;
}

function reset() {
  [drop1, drop2].forEach(dropzone => {
    const card = dropzone.querySelector(".guerreiro-card");
    if (card) {
      containerGuerreiros.appendChild(card);
      dropzone.textContent = "Arraste um guerreiro aqui";
    }
  });

  status.querySelector("p").textContent = "Aguardando guerreiros...";
}

function setupDropzones() {
  [drop1, drop2].forEach(dropzone => {
    dropzone.addEventListener("dragover", allowDrop);
    dropzone.addEventListener("dragleave", removeDropHighlight);
    dropzone.addEventListener("drop", dropGuerreiro);
  });
}

function init() {
  criarCards();
  setupDropzones();
  resetBtn.addEventListener("click", reset);
}

init();