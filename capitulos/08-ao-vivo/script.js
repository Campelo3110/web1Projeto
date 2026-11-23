const livePrompt = document.querySelector('#live-prompt')
const copy = document.querySelector('#copy')
const copyFallback = document.querySelector('#copy-fallback')

copy.addEventListener('click', async () => {
  const text = livePrompt.textContent.trim().replace(/\s+/g, ' ')
  try {
    await navigator.clipboard.writeText(text)
    copy.textContent = 'Copiado'
  } catch {
    copyFallback.value = text
    copyFallback.hidden = false
    copyFallback.focus()
    copyFallback.select()
  }
})
