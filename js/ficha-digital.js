// FICHA DIGITAL VÉTUS — SCRIPT ÚNICO
// Reúne os utilitários, a montagem dos cards e a geração do PDF.

// ==================================================
// 1. Utilitários, máscaras e controles
// ==================================================
// ==============================================
// Funções auxiliares da ficha
// ==============================================

// 📞 Máscara de telefone + Bloqueia números repetidos
function aplicarMascaraTelefone(input) {
  let valor = input.value.replace(/\D/g, "");

  // Limita a 11 dígitos
  if (valor.length > 11) valor = valor.substring(0, 11);

  // 🔒 BLOQUEIA sequência com todos os números iguais (ex: 00000000000)
  const todosRepetidos = /^(\d)\1+$/.test(valor);
  if (todosRepetidos && valor.length >= 8) {
    valor = valor.slice(0, -1); // remove o último dígito
  }

  // Aplica a máscara
  if (valor.length > 6) {
    input.value = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7)}`;
  } else if (valor.length > 2) {
    input.value = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
  } else if (valor.length > 0) {
    input.value = `(${valor}`;
  } else {
    input.value = "";
  }
}

// ✉️ Verificar se e-mail de recuperação é diferente do principal
window.verificarEmails = function (input) {
  const card = input.closest(".card-email");
  if (!card) return;
  const emailPrincipal = card.querySelector(".email-endereco");
  const emailRecuperacao = card.querySelector(".email-recuperacao");
  const aviso = card.querySelector(".aviso-email");

  if (emailPrincipal && emailRecuperacao && aviso) {
    const princVal = emailPrincipal.value.trim().toLowerCase();
    const recVal = emailRecuperacao.value.trim().toLowerCase();
    aviso.style.display =
      princVal && recVal && princVal === recVal ? "block" : "none";
  }
};

// 🔄 Mostra/esconde campos extras e aviso de 2 etapas
function configurarTrocaEtapa(select) {
  const container = select.closest(".grupo-campo").nextElementSibling;
  const avisoNao = select.nextElementSibling;

  select.addEventListener("change", function () {
    if (this.value === "sim") {
      container.style.display = "block";
      avisoNao.style.display = "none";
    } else if (this.value === "nao") {
      container.style.display = "none";
      avisoNao.style.display = "block";
      container
        .querySelectorAll("input, textarea, select")
        .forEach((el) => {
          if (el.type === "checkbox") {
            el.checked = false;
            el.dispatchEvent(new Event("change", { bubbles: true }));
          } else {
            el.value = "";
          }
        });
    } else {
      container.style.display = "none";
      avisoNao.style.display = "none";
      container
        .querySelectorAll("input, textarea, select")
        .forEach((el) => {
          if (el.type === "checkbox") {
            el.checked = false;
            el.dispatchEvent(new Event("change", { bubbles: true }));
          } else {
            el.value = "";
          }
        });
    }
  });
}

function configurarOpcaoCodigos(container = document) {
  const opcoes = [];
  if (container.matches?.(".incluir-codigos")) opcoes.push(container);
  opcoes.push(...container.querySelectorAll(".incluir-codigos"));

  opcoes.forEach((opcao) => {
    if (opcao.dataset.configurada === "true") return;
    const campo = opcao
      .closest(".grupo-campo")
      ?.querySelector(".codigos-recuperacao");
    if (!campo) return;

    const atualizarCampo = () => {
      campo.hidden = !opcao.checked;
      campo.disabled = !opcao.checked;
      if (!opcao.checked) campo.value = "";
    };

    opcao.addEventListener("change", atualizarCampo);
    opcao.dataset.configurada = "true";
    atualizarCampo();
  });
}

// Adiciona um controle acessível para revelar/ocultar campos de senha.
function configurarBotoesSenha(container = document) {
  const campos = [];
  if (container.matches?.('input[type="password"]')) campos.push(container);
  campos.push(...container.querySelectorAll('input[type="password"]'));

  campos.forEach((campo) => {
    if (campo.closest(".campo-com-olho")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "campo-com-olho";
    campo.parentNode.insertBefore(wrapper, campo);
    wrapper.appendChild(campo);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-ver-senha";
    botao.setAttribute("aria-label", "Mostrar senha");
    botao.setAttribute("aria-pressed", "false");
    botao.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
        <path class="risco-olho" d="m4 4 16 16"></path>
      </svg>
    `;
    wrapper.appendChild(botao);
  });
}

document.addEventListener("click", function (evento) {
  const botao = evento.target.closest(".botao-ver-senha");
  if (!botao) return;

  const campo = botao.closest(".campo-com-olho")?.querySelector("input");
  if (!campo) return;

  const mostrar = campo.type === "password";
  campo.type = mostrar ? "text" : "password";
  botao.classList.toggle("visivel", mostrar);
  botao.setAttribute("aria-pressed", String(mostrar));
  botao.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
});

document.addEventListener("DOMContentLoaded", function () {
  configurarBotoesSenha();
  configurarOpcaoCodigos();
});

// ==================================================
// 2. Criação e eventos dos cards
// ==================================================
// ==================================================
// FICHA DIGITAL — CARDS E EVENTOS
// ==================================================

const listaEmails = document.getElementById("lista-emails");
const listaAplicativos = document.getElementById("lista-aplicativos");
const btnAdicionarEmail = document.getElementById("btn-adicionar-email");
const btnAdicionarApp = document.getElementById("btn-adicionar-app");

// Criar card de E-mail
function criarCardEmail(tituloPadrao = "E-mail Secundário") {
  const div = document.createElement("div");
  div.className = "card-email";
  div.innerHTML = `
        <div class="card-titulo">
            <span class="icone">📧</span>
            <h3 class="titulo-card-editavel" contenteditable="true">${tituloPadrao}</h3>
        </div>
        <div class="grupo-campo">
            <label>Endereço de e-mail</label>
            <input type="email" class="email-endereco" placeholder="exemplo@gmail.com" onblur="verificarEmails(this)" />
        </div>
        <div class="grupo-campo">
            <label>Senha</label>
            <input type="password" class="email-senha" placeholder="Sua senha" autocomplete="new-password" />
        </div>
        <div class="grupo-campo">
            <label>E-mail de recuperação</label>
            <input type="email" class="email-recuperacao" placeholder="Deve ser diferente do e-mail principal" onblur="verificarEmails(this)" />
            <p class="aviso-email" style="color: #dc2626; font-size: 13px; margin-top: 5px; display: none;">⚠️ Este e-mail não pode ser o mesmo que o e-mail principal</p>
        </div>
        <div class="grupo-campo">
            <label>Telefone de recuperação</label>
            <input type="tel" class="email-telefone" placeholder="(00) 00000-0000" maxlength="15" />
        </div>
        <div class="grupo-campo">
            <label>Verificação em duas etapas</label>
            <select class="email-duas-etapas" aria-label="Verificação em duas etapas ativada?">
                <option value="">Selecione...</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
            </select>
            <p class="aviso-nao" style="color: #b45309; font-size: 13px; margin-top: 5px; display: none;">⚠️ Sem essa proteção, quem descobrir sua senha poderá acessar sua conta com mais facilidade.</p>
        </div>
        <div class="campos-duas-etapas">
            <div class="grupo-campo">
                <label>Método usado</label>
                <select class="metodo-duas-etapas" aria-label="Método usado na verificação em duas etapas">
                    <option value="">Selecione...</option>
                    <option value="Aplicativo autenticador">Aplicativo autenticador</option>
                    <option value="SMS">SMS</option>
                    <option value="Ligação telefônica">Ligação telefônica</option>
                    <option value="Chave de segurança ou passkey">Chave de segurança ou passkey</option>
                    <option value="Notificação no dispositivo">Notificação no dispositivo</option>
                    <option value="Outro">Outro</option>
                    <option value="Não sei informar">Não sei informar</option>
                </select>
            </div>
            <div class="grupo-campo">
                <p class="aviso-codigos">Códigos de recuperação são códigos de uso único fornecidos pelo serviço se você perder acesso ao celular. Só inclua se quiser guardá-los no PDF protegido. Não digite o código temporário que muda a cada login.</p>
                <label class="opcao-codigos">
                    <input type="checkbox" class="incluir-codigos" />
                    Quero incluir os códigos de recuperação no PDF protegido
                </label>
                <textarea class="codigos-recuperacao" aria-label="Códigos de recuperação, um por linha" rows="4" placeholder="Cole aqui os códigos de recuperação, um por linha" hidden disabled></textarea>
            </div>
        </div>
    `;

  // Aplicar máscara nos telefones do card
  div.querySelector(".email-telefone").addEventListener("input", function () {
    aplicarMascaraTelefone(this);
  });
  // Configurar select de verificação em 2 etapas
  const selectEmail = div.querySelector(".email-duas-etapas");
  configurarTrocaEtapa(selectEmail);
  configurarBotoesSenha(div);
  configurarOpcaoCodigos(div);

  return div;
}

// Criar card de Aplicativo
function criarCardAplicativo() {
  const div = document.createElement("div");
  div.className = "card-aplicativo";
  div.innerHTML = `
        <div class="card-titulo">
            <span class="icone">📱</span>
            <h3 class="titulo-card-editavel" contenteditable="true">Aplicativo</h3>
        </div>
        <div class="grupo-campo">
            <label>Usuário / E-mail</label>
            <input type="text" class="app-usuario" placeholder="Seu usuário ou e-mail" />
        </div>
        <div class="grupo-campo">
            <label>Senha</label>
            <input type="password" class="app-senha" placeholder="Sua senha" autocomplete="new-password" />
        </div>
        <div class="grupo-campo">
            <label>E-mail de recuperação (opcional)</label>
            <input type="email" class="app-email-recuperacao" placeholder="E-mail para recuperação" />
        </div>
        <div class="grupo-campo">
            <label>Telefone de recuperação (opcional)</label>
            <input type="tel" class="app-telefone" placeholder="(00) 00000-0000" maxlength="15" />
        </div>
        <div class="grupo-campo">
            <label>Verificação em duas etapas</label>
            <select class="app-duas-etapas" aria-label="Verificação em duas etapas ativada?">
                <option value="">Selecione...</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
            </select>
            <p class="aviso-nao" style="color: #b45309; font-size: 13px; margin-top: 5px; display: none;">⚠️ Sem essa proteção, quem descobrir sua senha poderá acessar sua conta com mais facilidade.</p>
        </div>
        <div class="campos-duas-etapas">
            <div class="grupo-campo">
                <label>Método usado</label>
                <select class="metodo-duas-etapas" aria-label="Método usado na verificação em duas etapas">
                    <option value="">Selecione...</option>
                    <option value="Aplicativo autenticador">Aplicativo autenticador</option>
                    <option value="SMS">SMS</option>
                    <option value="Ligação telefônica">Ligação telefônica</option>
                    <option value="Chave de segurança ou passkey">Chave de segurança ou passkey</option>
                    <option value="Notificação no dispositivo">Notificação no dispositivo</option>
                    <option value="Outro">Outro</option>
                    <option value="Não sei informar">Não sei informar</option>
                </select>
            </div>
            <div class="grupo-campo">
                <p class="aviso-codigos">Códigos de recuperação são códigos de uso único fornecidos pelo serviço se você perder acesso ao celular. Só inclua se quiser guardá-los no PDF protegido. Não digite o código temporário que muda a cada login.</p>
                <label class="opcao-codigos">
                    <input type="checkbox" class="incluir-codigos" />
                    Quero incluir os códigos de recuperação no PDF protegido
                </label>
                <textarea class="codigos-recuperacao" aria-label="Códigos de recuperação, um por linha" rows="4" placeholder="Cole aqui os códigos de recuperação, um por linha" hidden disabled></textarea>
            </div>
        </div>
    `;

  // Aplicar máscara nos telefones do card
  div.querySelector(".app-telefone").addEventListener("input", function () {
    aplicarMascaraTelefone(this);
  });
  // Configurar select de verificação em 2 etapas
  const selectApp = div.querySelector(".app-duas-etapas");
  configurarTrocaEtapa(selectApp);
  configurarBotoesSenha(div);
  configurarOpcaoCodigos(div);

  return div;
}

// Inicializar eventos ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  // Máscaras nos campos que já existem na página
  document
    .querySelectorAll(".email-telefone, .app-telefone")
    .forEach(function (input) {
      input.addEventListener("input", function () {
        aplicarMascaraTelefone(this);
      });
    });

  // Configurar selects que já existem na página
  document
    .querySelectorAll(".email-duas-etapas, .app-duas-etapas")
    .forEach(function (select) {
      configurarTrocaEtapa(select);
    });
});

// Botões de adicionar novos cards
btnAdicionarEmail.addEventListener("click", function () {
  listaEmails.appendChild(criarCardEmail("E-mail Secundário"));
});

btnAdicionarApp.addEventListener("click", function () {
  listaAplicativos.appendChild(criarCardAplicativo());
});

// ==================================================
// 3. Geração e download do PDF
// ==================================================
// ==================================================
// FICHA DIGITAL — GERAÇÃO DE PDF PROTEGIDO
// ==================================================

const btnGerarPdf = document.getElementById("btn-gerar-pdf");

function valorDoCampo(card, seletor) {
  const campo = card.querySelector(seletor);
  return campo?.value?.trim() || "Não informado";
}

function criarSenhaProprietario() {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Este navegador não oferece geração segura de chaves.");
  }

  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function textoCompativelComHelvetica(texto) {
  return String(texto)
    .replace(/\r\n?/g, "\n")
    .replace(/[—–]/g, "-")
    .replace(/→/g, "->")
    .replace(/[^\x20-\x7E\u00A0-\u00FF\n]/g, "?");
}

function quebrarTexto(texto, fonte, tamanho, larguraMaxima) {
  const linhas = [];

  textoCompativelComHelvetica(texto).split("\n").forEach((linha) => {
    let atual = "";
    const palavras = linha.split(/\s+/).filter(Boolean);

    palavras.forEach((palavra) => {
      const tentativa = atual ? `${atual} ${palavra}` : palavra;
      if (fonte.widthOfTextAtSize(tentativa, tamanho) <= larguraMaxima) {
        atual = tentativa;
        return;
      }

      if (atual) linhas.push(atual);
      atual = "";

      // Senhas e códigos podem ser longos e não conter espaços.
      for (const caractere of palavra) {
        const tentativaCaractere = atual + caractere;
        if (
          atual &&
          fonte.widthOfTextAtSize(tentativaCaractere, tamanho) > larguraMaxima
        ) {
          linhas.push(atual);
          atual = caractere;
        } else {
          atual = tentativaCaractere;
        }
      }
    });

    linhas.push(atual);
  });

  return linhas.length ? linhas : [""];
}

function textoStatusDuasEtapas(valor) {
  if (valor === "sim") return "Sim";
  if (valor === "nao") return "Não";
  return "Não informado";
}

function escreverRegistro(pdf, registro, fonteNegrito) {
  pdf.escrever(`--- ${registro.titulo} ---`, 11, fonteNegrito);
  registro.campos.forEach(([rotulo, valor]) =>
    pdf.escrever(`${rotulo}: ${valor}`),
  );

  if (registro.duasEtapas === "sim") {
    pdf.escrever(
      `Método usado: ${valorDoCampo(registro.card, ".metodo-duas-etapas")}`,
    );

    const incluirCodigos = registro.card.querySelector(".incluir-codigos")?.checked;
    const codigos = valorDoCampo(registro.card, ".codigos-recuperacao");
    if (incluirCodigos && codigos !== "Não informado") {
      pdf.escrever("Códigos de recuperação:", 10, fonteNegrito);
      pdf.escrever(codigos);
    }
  }

  pdf.espaciar(6);
}

btnGerarPdf.addEventListener("click", async function () {
  const senhaPdf = document.getElementById("senha-pdf").value;
  if (senhaPdf.trim().length < 8) {
    alert("Defina uma senha com pelo menos 8 caracteres para proteger o PDF.");
    document.getElementById("senha-pdf").focus();
    return;
  }

  if (!globalThis.PDFLib?.PDFDocument) {
    alert("A biblioteca de PDF não carregou. Verifique sua conexão e recarregue a página.");
    return;
  }

  const textoOriginalBotao = this.textContent;
  this.disabled = true;
  this.textContent = "Gerando PDF protegido...";
  const avisoDownloadAnterior = document.getElementById("aviso-download");
  if (avisoDownloadAnterior) avisoDownloadAnterior.hidden = true;

  try {
    const { PDFDocument, StandardFonts } = globalThis.PDFLib;
    const pdfDoc = await PDFDocument.create();
    const fonte = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fonteNegrito = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const larguraPagina = 550;
    const alturaPagina = 780;
    const margemEsquerda = 35;
    const margemInferior = 45;
    let pagina = pdfDoc.addPage([larguraPagina, alturaPagina]);
    let y = alturaPagina - 38;

    const pdf = {
      escrever(texto, tamanho = 10, fonteAtual = fonte) {
        const linhas = quebrarTexto(
          texto,
          fonteAtual,
          tamanho,
          larguraPagina - 70,
        );
        linhas.forEach((linha) => {
          if (y < margemInferior) {
            pagina = pdfDoc.addPage([larguraPagina, alturaPagina]);
            y = alturaPagina - 38;
          }
          pagina.drawText(linha, {
            x: margemEsquerda,
            y,
            font: fonteAtual,
            size: tamanho,
          });
          y -= Math.max(15, tamanho + 5);
        });
      },
      espaciar(quantidade = 8) {
        y -= quantidade;
      },
    };

    pdf.escrever(
      "FICHA DIGITAL PROTEGIDA - VETUS GESTAO DE ACESSO",
      14,
      fonteNegrito,
    );
    pdf.espaciar(10);
    pdf.escrever("E-MAILS", 12, fonteNegrito);

    document.querySelectorAll(".card-email").forEach((card) => {
      escreverRegistro(
        pdf,
        {
          card,
          titulo:
            card.querySelector(".titulo-card-editavel")?.textContent.trim() ||
            "E-mail",
          duasEtapas: card.querySelector(".email-duas-etapas")?.value,
          campos: [
            ["Endereço", valorDoCampo(card, ".email-endereco")],
            ["Senha", valorDoCampo(card, ".email-senha")],
            ["E-mail de recuperação", valorDoCampo(card, ".email-recuperacao")],
            ["Telefone de recuperação", valorDoCampo(card, ".email-telefone")],
            [
              "Verificação em duas etapas",
              textoStatusDuasEtapas(card.querySelector(".email-duas-etapas")?.value),
            ],
          ],
        },
        fonteNegrito,
      );
    });

    pdf.espaciar(8);
    pdf.escrever("APLICATIVOS E REDES SOCIAIS", 12, fonteNegrito);

    document.querySelectorAll(".card-aplicativo").forEach((card) => {
      escreverRegistro(
        pdf,
        {
          card,
          titulo:
            card.querySelector(".titulo-card-editavel")?.textContent.trim() ||
            "Aplicativo",
          duasEtapas: card.querySelector(".app-duas-etapas")?.value,
          campos: [
            ["Usuário", valorDoCampo(card, ".app-usuario")],
            ["Senha", valorDoCampo(card, ".app-senha")],
            [
              "E-mail de recuperação",
              valorDoCampo(card, ".app-email-recuperacao"),
            ],
            ["Telefone de recuperação", valorDoCampo(card, ".app-telefone")],
            [
              "Verificação em duas etapas",
              textoStatusDuasEtapas(card.querySelector(".app-duas-etapas")?.value),
            ],
          ],
        },
        fonteNegrito,
      );
    });

    pdf.espaciar(8);
    pdf.escrever("ISENCAO DE RESPONSABILIDADE", 10, fonteNegrito);
    pdf.escrever(
      "Após o download, a guarda e a segurança dos dados deste arquivo são de responsabilidade do cliente.",
    );
    pdf.escrever(
      "A Vetus não armazena nem retém os dados preenchidos nesta página.",
    );
    pdf.espaciar(6);
    pdf.escrever("COMO ENCONTRAR ESTA FICHA", 10, fonteNegrito);
    pdf.escrever(
      "Procure Ficha-Digital-Vetus.pdf na pasta Downloads ou na lista de downloads do navegador.",
    );
    pdf.escrever(
      "Para imprimir, abra o arquivo com a senha e escolha a opção Imprimir.",
    );

    pdfDoc.encrypt({
      userPassword: senhaPdf,
      ownerPassword: criarSenhaProprietario(),
      permissions: {
        printing: "highResolution",
        modifying: false,
        copying: false,
        annotating: false,
      },
    });

    const pdfBytes = await pdfDoc.save();
    const url = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "Ficha-Digital-Vetus.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);

    const avisoDownload = document.getElementById("aviso-download");
    if (avisoDownload) {
      avisoDownload.hidden = false;
      avisoDownload.focus();
      avisoDownload.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } catch (erro) {
    console.error("Erro ao gerar PDF protegido:", erro);
    alert(
      `Não foi possível gerar o PDF protegido. ${erro.message || "Tente novamente."}`,
    );
  } finally {
    this.disabled = false;
    this.textContent = textoOriginalBotao;
  }
});
