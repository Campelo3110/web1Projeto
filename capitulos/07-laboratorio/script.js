const layerButtons = document.querySelectorAll('[data-layer]')
const layerCode = document.querySelector('#layer-code')
const layerFilename = document.querySelector('#layer-filename')
const layerNote = document.querySelector('#layer-note')
const fair = document.querySelector('#fair-demo')
const filter = document.querySelector('#filter')
const opening = document.querySelector('#opening-event')
const layers = {
  html: {
    code: '<h3>Feira de Ciências</h3>\n<p>24 de outubro · Pátio da escola</p>\n<ul>\n  <li id="opening-event">09h · Abertura</li>\n  <li>10h · Oficina de foguetes</li>\n  <li>11h · Oficina de robótica</li>\n</ul>',
    note: 'O HTML já mostra os horários. O filtro ainda não tem comportamento.'
  },
  css: {
    code: '.fair-demo {\n  background: #a53227;\n  color: #fff4e9;\n}\n\n.fair-demo h3 {\n  font-size: 2em;\n}',
    note: 'O CSS muda o visual. Os horários e o filtro continuam iguais.'
  },
  js: {
    code: "filter.addEventListener('click', () => {\n  const active = !opening.hidden\n  opening.hidden = active\n  filter.setAttribute('aria-pressed', String(active))\n})",
    note: 'O JavaScript dá comportamento ao botão. Ative e desative o filtro.'
  }
}

function showFilter(active) {
  opening.hidden = active
  filter.setAttribute('aria-pressed', String(active))
}

function selectLayer(mode) {
  const filenames = { html: 'index.html', css: 'style.css', js: 'script.js' }
  fair.dataset.mode = mode
  layerFilename.textContent = filenames[mode]
  layerCode.textContent = layers[mode].code
  layerNote.textContent = layers[mode].note
  filter.disabled = mode !== 'js'
  showFilter(false)
}

for (const button of layerButtons) {
  button.addEventListener('click', () => {
    selectButton(layerButtons, button)
    selectLayer(button.dataset.layer)
  })
}

filter.addEventListener('click', () => {
  const active = !opening.hidden
  showFilter(active)
  layerNote.textContent = active
    ? 'Filtro ligado: 2 atividades visíveis.'
    : 'Filtro desligado: 3 atividades visíveis.'
})

selectLayer('html')
