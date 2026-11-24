const promptButtons = document.querySelectorAll("[data-prompt]");
const promptShort = document.querySelector("#prompt-vago");
const promptDetailed = document.querySelector("#prompt-detalhado");
const promptNote = document.querySelector("#prompt-note");
const promptOpen = document.querySelector("#prompt-open");
const promptFull = document.querySelector("#prompt-full");

for (const button of promptButtons) {
  button.addEventListener("click", () => {
    const detailed = button.dataset.prompt === "detalhado";
    selectButton(promptButtons, button);
    promptShort.hidden = detailed;
    promptDetailed.hidden = !detailed;
    promptOpen.hidden = !detailed;
    promptNote.textContent = detailed
      ? "A turma já consegue repetir os dois testes."
      : "O pedido vago deixa público, conteúdo e testes em aberto.";
  });
}

promptOpen.addEventListener("click", () => promptFull.showModal());
