let gravando = false;
let recognition;

const btn = document.getElementById('btn-gravar');
const display = document.getElementById('caixa-texto');

btn.addEventListener('click', () => {
  if (!gravando) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let texto = "";
      for (let i = 0; i < event.results.length; i++) {
        texto += event.results[i][0].transcript;
      }
      display.innerText = texto;
    };

    recognition.onerror = (event) => {
      alert("Erro no microfone: " + event.error);
      parar();
    };

    recognition.start();
    btn.innerText = "PARAR TRANSCRIÇÃO 🛑";
    btn.classList.add('gravando');
    gravando = true;
  } else {
    parar();
  }
});

function parar() {
  recognition.stop();
  btn.innerText = "INICIAR TRANSCRIÇÃO 🎤";
  btn.classList.remove('gravando');
  gravando = false;
}