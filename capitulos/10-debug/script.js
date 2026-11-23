const debugButtons = document.querySelectorAll('[data-debug]')
const bugCode = document.querySelector('#bug-code')
const bugOutput = document.querySelector('#bug-output')
let fixed = false

function debugSelector() {
  return fixed ? '#botao-teste' : '#botao-teste-errado'
}

function showDebugCode() {
  bugCode.textContent =
    "const botao = document.querySelector('" +
    debugSelector() +
    "')\n\nbotao.addEventListener('click', () => {\n  saida.textContent = 'Clique recebido.'\n})"
  bugOutput.textContent = 'Pronto para executar.'
}

for (const button of debugButtons) {
  button.addEventListener('click', () => {
    selectButton(debugButtons, button)
    fixed = button.dataset.debug === 'certo'
    showDebugCode()
  })
}

document.querySelector('#run').addEventListener('click', () => {
  const botao = document.querySelector(debugSelector())
  const saida = bugOutput
  try {
    botao.addEventListener(
      'click',
      () => {
        saida.textContent = 'Clique recebido.'
      },
      { once: true }
    )
    botao.click()
  } catch (error) {
    saida.textContent = error.name + ': o seletor não encontrou o botão (null).'
  }
})

showDebugCode()
