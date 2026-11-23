const revisionButtons = document.querySelectorAll('[data-version]')
const revisionFilter = document.querySelector('#revision-filter')
const revisionOpening = document.querySelector('#revision-opening')
const revisionCount = document.querySelector('#revision-count')
const revisionEmpty = document.querySelector('#revision-empty')
const revisionNumber = revisionCount.querySelector('strong')

for (const button of revisionButtons) {
  button.addEventListener('click', () => {
    const after = button.dataset.version === 'depois'
    selectButton(revisionButtons, button)
    revisionCount.hidden = !after
    revisionEmpty.hidden = after
  })
}

revisionFilter.addEventListener('click', () => {
  revisionOpening.hidden = !revisionOpening.hidden
  revisionFilter.setAttribute('aria-pressed', String(revisionOpening.hidden))
  revisionNumber.textContent = revisionOpening.hidden ? '2' : '3'
})
