const chapters = [
  {
    id: "capa",
    title: "Início",
    src: "capitulos/01-capa/index.html",
    phase: "pedir",
  },
  {
    id: "provocacao",
    title: "A pergunta inicial",
    src: "capitulos/02-provocacao/index.html",
    phase: "pedir",
  },
  {
    id: "sociedade",
    title: "Internet e Sociedade",
    src: "capitulos/02-sociedade/index.html",
    phase: "conferir",
  },
  {
    id: "termo",
    title: "De onde veio o termo",
    src: "capitulos/03-termo/index.html",
    phase: "conferir",
  },
  {
    id: "abordagens",
    title: "Abordagens e ferramentas",
    src: "capitulos/04-abordagens/index.html",
    phase: "construir",
  },
  {
    id: "conceito",
    title: "Como funciona o Vibe Coding",
    src: "capitulos/03-conceito/index.html",
    phase: "construir",
  },
  {
    id: "ambiente",
    title: "Preparar o projeto",
    src: "capitulos/05-ambiente/index.html",
    phase: "construir",
  },
  {
    id: "prompt",
    title: "O primeiro pedido",
    src: "capitulos/06-prompt/index.html",
    phase: "pedir",
  },
  {
    id: "revisao",
    title: "Segurança",
    src: "capitulos/11-revisao/index.html",
    phase: "conferir",
  },
  {
    id: "publicacao",
    title: "Conferir e publicar",
    src: "capitulos/12-publicacao/index.html",
    phase: "conferir",
  },
  {
    id: "perguntas",
    title: "Conclusão",
    src: "capitulos/13-perguntas/index.html",
    phase: "conferir",
  },
];
const main = document.querySelector("#conteudo");
const phases = Array.from(
  document.querySelectorAll(".phase-marker [data-phase]"),
);
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const frames = new Map();
const sections = chapters.map((chapter) => {
  const section = document.createElement("section");
  section.id = chapter.id;
  section.className = "page-section";
  section.dataset.phase = chapter.phase;
  const frame = document.createElement("iframe");
  frame.title = chapter.title;
  frame.src = chapter.src;
  section.append(frame);
  main.append(section);
  frames.set(frame.contentWindow, frame);
  frame.addEventListener("load", () => sizeChapter(frame));
  return section;
});
let current = 0;

function sizeChapter(frame) {
  const headerHeight = document
    .querySelector(".site-header")
    .getBoundingClientRect().height;
  document.documentElement.style.setProperty(
    "--site-header-height",
    headerHeight + "px",
  );
  const panelHeight = Math.max(320, window.innerHeight - headerHeight);
  frame.style.height =
    Math.max(panelHeight, Number(frame.dataset.contentHeight) || 0) + "px";
  frame.contentWindow.postMessage(
    { type: "viewport", height: panelHeight, presenting: false },
    "*",
  );
}

function setCurrent(index) {
  current = Math.max(0, Math.min(index, sections.length - 1));
  const active = sections[current];
  phases.forEach((phase) =>
    phase.dataset.phase === active.dataset.phase
      ? phase.setAttribute("aria-current", "step")
      : phase.removeAttribute("aria-current"),
  );
  navLinks.forEach((link) =>
    link.hash === "#" + active.id
      ? link.setAttribute("aria-current", "location")
      : link.removeAttribute("aria-current"),
  );
  document.querySelector("#previous").disabled = current === 0;
  document.querySelector("#next").disabled = current === sections.length - 1;
}

function goTo(index) {
  const target = Math.max(0, Math.min(index, sections.length - 1));
  sections[target].scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", "#" + sections[target].id);
  setCurrent(target);
}

document
  .querySelector("#previous")
  .addEventListener("click", () => goTo(current - 1));
document
  .querySelector("#next")
  .addEventListener("click", () => goTo(current + 1));
document
  .querySelector("#fullscreen")
  .addEventListener("click", async (event) => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
    event.currentTarget.setAttribute(
      "aria-pressed",
      String(Boolean(document.fullscreenElement)),
    );
  });

document.addEventListener("fullscreenchange", () => {
  const button = document.querySelector("#fullscreen");
  button.setAttribute(
    "aria-pressed",
    String(Boolean(document.fullscreenElement)),
  );
  button.textContent = document.fullscreenElement
    ? "Sair da tela cheia"
    : "Tela cheia";
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;
    const index = sections.indexOf(visible[0].target);
    setCurrent(index);
  },
  { rootMargin: "-12% 0px -68% 0px", threshold: [0, 0.2, 0.5, 0.8] },
);
sections.forEach((section) => observer.observe(section));

window.addEventListener("message", (event) => {
  const frame = frames.get(event.source);
  if (
    frame &&
    event.data?.type === "chapter-height" &&
    Number.isFinite(event.data.height) &&
    event.data.height > 0
  ) {
    frame.dataset.contentHeight = String(Math.ceil(event.data.height));
    const headerHeight = document
      .querySelector(".site-header")
      .getBoundingClientRect().height;
    const panelHeight = Math.max(320, window.innerHeight - headerHeight);
    frame.style.height =
      Math.max(panelHeight, Math.ceil(event.data.height)) + "px";
  }
  if (event.data?.type === "chapter-link") {
    const index = sections.findIndex((section) => section.id === event.data.id);
    if (index >= 0) goTo(index);
  }
});
window.addEventListener("resize", () => frames.forEach(sizeChapter));
window.addEventListener("hashchange", () => {
  const index = sections.findIndex(
    (section) => "#" + section.id === location.hash,
  );
  if (index >= 0) setCurrent(index);
});
document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === "ArrowRight") goTo(current + 1);
  if (event.key === "ArrowLeft") goTo(current - 1);
});
const initial = sections.findIndex(
  (section) => "#" + section.id === location.hash,
);
if (initial >= 0)
  sections[initial].scrollIntoView({ behavior: "instant", block: "start" });
setCurrent(initial < 0 ? 0 : initial);
