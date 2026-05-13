let gravando = false;
let recognition;
let textoAcumulado = "";

const btnGravar = document.getElementById('btn-gravar');
const btnPdf = document.getElementById('btn-pdf');
const caixa = document.getElementById('caixa');
const selectCategoria = document.getElementById('categoria');

btnGravar.addEventListener('click', async () => {
    if (!gravando) {
        try {
            // Solicita permissão de áudio explicitamente
            await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!Speech) {
                alert("Seu navegador não suporta transcrição de voz.");
                return;
            }

            recognition = new Speech();
            recognition.lang = 'pt-BR';
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = () => {
                btnGravar.innerText = "PARAR TRANSCRIÇÃO 🛑";
                btnGravar.classList.add('gravando');
                caixa.innerText = "Ouvindo... Pode falar!";
                gravando = true;
            };

            recognition.onresult = (event) => {
                let textoTemporario = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        textoAcumulado += event.results[i][0].transcript + " ";
                    } else {
                        textoTemporario = event.results[i][0].transcript;
                    }
                }
                caixa.innerText = textoAcumulado + textoTemporario;
                caixa.scrollTop = caixa.scrollHeight;
            };

            recognition.onerror = (event) => {
                console.error("Erro no reconhecimento:", event.error);
                if(event.error === 'not-allowed') alert("Acesso ao microfone negado! Clique no cadeado da barra de endereços.");
                parar();
            };

            recognition.start();
        } catch (err) {
            alert("Para funcionar, você precisa permitir o uso do microfone.");
        }
    } else {
        parar();
    }
});

function parar() {
    if (recognition) recognition.stop();
    btnGravar.innerText = "INICIAR TRANSCRIÇÃO 🎤";
    btnGravar.classList.remove('gravando');
    gravando = false;
}

btnPdf.addEventListener('click', () => {
    const conteudo = textoAcumulado || caixa.innerText;
    if (conteudo.length < 5 || conteudo.includes("Clique em iniciar")) {
        alert("Não há texto suficiente para gerar o PDF.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    doc.setFontSize(20);
    doc.setTextColor(107, 112, 92);
    doc.text("Relatório Voz Ativa", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Data: ${dataAtual} | Categoria: ${selectCategoria.value}`, 20, 30);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(11);
    doc.setTextColor(0);
    const splitText = doc.splitTextToSize(conteudo, 170);
    doc.text(splitText, 20, 45);

    doc.save(`Aula_${dataAtual}.pdf`);
});