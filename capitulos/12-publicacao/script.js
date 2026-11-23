const checks = Array.from(document.querySelectorAll('.checklist input'))
const count = document.querySelector('#check-count')

function showProgress() {
  const done = checks.filter((check) => check.checked).length
  count.textContent = done + ' de ' + checks.length + ' conferidos'
}

for (const check of checks) check.addEventListener('change', showProgress)
showProgress()
