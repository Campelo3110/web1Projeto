const links = Array.from(document.querySelectorAll('#index-links a'))
const main = document.querySelector('#conteudo')
const index = document.querySelector('#index')
const previous = document.querySelector('#previous')
const next = document.querySelector('#next')
const position = document.querySelector('#position')
const progress = document.querySelector('#progress')
const present = document.querySelector('#present')
const fullscreen = document.querySelector('#fullscreen')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const frames = []
let current = 0
let presenting = true

for (const link of links) {
  const frame = document.createElement('iframe')
  frame.title = link.textContent
  frame.hidden = true
  main.append(frame)
  frames.push(frame)

  link.addEventListener('click', (event) => {
    event.preventDefault()
    index.close()
    goTo(links.indexOf(link))
  })

  frame.addEventListener('load', () => sizeChapter(frame))
}

function sizeChapter(frame) {
  const height = window.innerHeight - main.getBoundingClientRect().top - window.scrollY
  frame.contentWindow.postMessage(
    { type: 'viewport', height: Math.max(0, height), presenting },
    '*'
  )
}

function loadChapter(number) {
  const frame = frames[number]
  if (!frame.hasAttribute('src')) frame.src = links[number].href
  frame.hidden = false
  sizeChapter(frame)
}

function updatePosition(number) {
  current = number
  position.textContent = number + 1 + ' / ' + links.length
  progress.value = number + 1
  previous.disabled = number === 0
  next.disabled = number === links.length - 1

  for (const [step, link] of links.entries()) {
    if (step === number) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  }
}

function goTo(number, focus = true) {
  if (number < 0 || number >= links.length) return

  const active = frames[number]
  updatePosition(number)
  history.replaceState(null, '', '#' + links[number].dataset.id)

  if (presenting) {
    for (const frame of frames) frame.hidden = frame !== active
    loadChapter(number)
    window.scrollTo({ top: 0, behavior: 'instant' })
  } else {
    active.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' })
  }

  if (focus) active.focus({ preventScroll: true })
}

function togglePresentation() {
  presenting = !presenting
  present.setAttribute('aria-pressed', String(presenting))
  present.textContent = presenting ? 'Modo leitura' : 'Apresentar'

  if (!presenting) {
    for (const [number] of frames.entries()) loadChapter(number)
  }
  goTo(current)
}

function useArrow(key) {
  if (index.open) return false
  if (key === 'ArrowRight' || key === 'ArrowLeft') {
    goTo(current + (key === 'ArrowRight' ? 1 : -1))
    return true
  }
  if (
    presenting &&
    key === 'ArrowDown' &&
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
  ) {
    goTo(current + 1)
    return true
  }
  if (presenting && key === 'ArrowUp' && window.scrollY <= 1) {
    goTo(current - 1)
    return true
  }
  return false
}

window.addEventListener('message', (event) => {
  const frame = frames.find((item) => item.contentWindow === event.source)
  if (!frame || !event.data) return

  if (
    event.data.type === 'chapter-height' &&
    Number.isFinite(event.data.height) &&
    event.data.height > 0
  ) {
    const height = Math.ceil(event.data.height) + 'px'
    if (frame.style.height !== height) frame.style.height = height
  }
  if (event.data.type === 'chapter-link') {
    const number = links.findIndex((link) => link.dataset.id === event.data.id)
    goTo(number)
  }
  if (!frame.hidden && event.data.type === 'chapter-key') useArrow(event.data.key)
})

window.addEventListener('resize', () => {
  for (const frame of frames) if (!frame.hidden) sizeChapter(frame)
})

window.addEventListener(
  'scroll',
  () => {
    if (presenting) return
    let number = 0
    for (const [step, frame] of frames.entries()) {
      if (frame.getBoundingClientRect().top <= window.innerHeight * 0.3) number = step
    }
    if (number !== current) {
      updatePosition(number)
      history.replaceState(null, '', '#' + links[number].dataset.id)
    }
  },
  { passive: true }
)

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  if (useArrow(event.key)) event.preventDefault()
})

function followHash() {
  const number = links.findIndex((link) => '#' + link.dataset.id === location.hash)
  goTo(number < 0 ? 0 : number, false)
}

window.addEventListener('hashchange', followHash)
document.querySelector('#open-index').addEventListener('click', () => index.showModal())
previous.addEventListener('click', () => goTo(current - 1))
next.addEventListener('click', () => goTo(current + 1))
present.addEventListener('click', togglePresentation)

if (!document.fullscreenEnabled) fullscreen.hidden = true

fullscreen.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  } catch {
    fullscreen.textContent = 'Tela cheia indisponível'
  }
})

document.addEventListener('fullscreenchange', () => {
  const active = Boolean(document.fullscreenElement)
  fullscreen.setAttribute('aria-pressed', String(active))
  fullscreen.textContent = active ? 'Sair da tela cheia' : 'Tela cheia'
})

progress.max = links.length
followHash()
