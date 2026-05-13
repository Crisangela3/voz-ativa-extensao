let gravando = false;
let recognition;
let textoAcumulado = "";

const btnGravar = document.getElementById('btn-gravar');
const btnPdf = document.getElementById('btn-pdf');
const caixa = document.getElementById('caixa');
const selectCategoria = document.getElementById('categoria');

btnGravar.addEventListener('click', () => {
    if (!gravando) {
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Speech) {
            alert("Navegador não suportado");
            return;
        }
        
        recognition = new Speech();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;

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
            caixa.scrollTop = caixa.scrollHeight; // Rola para baixo sozinho
        };

        recognition.start();
        btnGravar.innerText = "PARAR TRANSCRIÇÃO 🛑";
        btnGravar.classList.add('gravando');
        gravando = true;
    } else {
        recognition.stop();
        btnGravar.innerText = "INICIAR TRANSCRIÇÃO 🎤";
        btnGravar.classList.remove('gravando');
        gravando = false;
    }
});

btnPdf.addEventListener('click', () => {
    if (!textoAcumulado && caixa.innerText.length < 10) {
        alert("Não há conteúdo para gerar o PDF.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const categoria = selectCategoria.value;

    // Estilização do PDF (Igual ao seu App)
    doc.setFontSize(22);
    doc.setTextColor(107, 112, 92); // Verde Oliva
    doc.text("Voz Ativa - Relatório", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    doc.text(`Data: ${dataAtual} | Categoria: ${categoria}`, 20, 30);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(11);
    const textoParaPdf = textoAcumulado || caixa.innerText;
    const splitText = doc.splitTextToSize(textoParaPdf, 170);
    doc.text(splitText, 20, 45);

    doc.save(`Extensao_VozAtiva_${dataAtual}.pdf`);
});