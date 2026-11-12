# 🔐 Ficha Digital Vétus

## 🎯 Propósito

A Ficha Digital Vétus ajuda o cliente a organizar informações de acesso às próprias contas: e-mails, aplicativos, nomes de usuário, senhas e dados de recuperação. Depois, a ferramenta gera um PDF protegido por senha para o cliente baixar e guardar.

A ferramenta foi pensada para pessoas que querem manter essas informações organizadas, com instruções simples sobre como encontrar e proteger o arquivo.

## 🧰 Tecnologias e publicação

- **HTML** para a página e os campos do formulário.
- **CSS** para a apresentação e adaptação a diferentes telas.
- **JavaScript** para criar os cards, mostrar ou ocultar campos e gerar o PDF no navegador.
- **PDF-Lib:** cópia local do pacote @cantoo/pdf-lib versão 2.11.0, usada para criar e proteger o PDF.
- **GitHub Pages** é a hospedagem estática pretendida. A publicação precisa ser habilitada nas configurações do repositório.

## 🗂️ O que pode ser organizado

- E-mail principal e e-mails adicionais.
- Aplicativos e redes sociais.
- Senhas e dados de recuperação.
- Estado e método da verificação em duas etapas.
- Códigos de recuperação opcionais. Inclua-os somente se quiser guardá-los no PDF protegido.

## ▶️ Como usar e gerar o PDF

1. Abra index.html em um navegador atualizado.
2. Preencha os dados das contas que deseja registrar.
3. Se ativou a verificação em duas etapas, informe o método usado. Códigos de recuperação são opcionais; não coloque códigos temporários de login.
4. Crie uma senha com pelo menos 8 caracteres para o PDF.
5. Selecione **Gerar e Baixar PDF Protegido**.
6. Procure Ficha-Digital-Vetus.pdf na pasta Downloads ou na lista de downloads do navegador.
7. Guarde o arquivo em local protegido e anote a senha em outro lugar seguro.

A página não salva automaticamente o formulário. Se você recarregar ou fechar a página antes de gerar o PDF, os campos serão perdidos. O PDF é gerado no navegador e baixado no dispositivo do cliente.

## 🔗 Link com chave e expiração

**Status: não implementado na versão atual.** A página não gera uma chave administrativa, não valida os parâmetros chave ou expira e não bloqueia o acesso após uma hora. Quem tiver o endereço atual da Ficha poderá abrir a página.

O fluxo planejado para links temporários seria:

1. O administrador informa uma senha validada por um serviço de servidor.
2. O serviço gera uma chave aleatória e define a expiração para 1 hora após a emissão.
3. O cliente abre o link, e o serviço valida a chave e o horário de expiração.
4. Links vencidos ou revogados são recusados.

GitHub Pages publica arquivos estáticos e não executa essa validação no servidor. Para implementar o fluxo com segurança, será necessário adicionar um backend ou uma função serverless que mantenha a senha administrativa e valide os links. Apenas esconder uma página ou verificar a chave no JavaScript não é controle de acesso seguro.

## 🔒 Avisos e limitações de segurança

- O código atual processa os campos no navegador e não os envia para um servidor da Vétus. A Vétus não recebe nem armazena as senhas por meio desta página.
- Os dados digitados permanecem na página enquanto ela está aberta; ao recarregar, são apagados. O arquivo gerado fica no dispositivo do cliente.
- O PDF pede uma senha para ser aberto. Escolha uma senha forte e única e não a envie junto com o PDF pelo mesmo canal.
- Proteja o dispositivo e o local onde guardar o PDF. Quem obtiver o arquivo e sua senha poderá consultar as informações.
- A ferramenta não é um cofre online: não tem conta de usuário, cópia de segurança na nuvem ou recuperação do PDF e da senha.
- A página hospedada no GitHub Pages é acessível pela internet; a documentação do GitHub recomenda não usar Pages para transações sensíveis como senhas. Por isso, a hospedagem pública não deve ser apresentada como acesso privado ou temporário.
- Um PDF protegido ajuda a limitar a abertura do arquivo, mas não substitui um gerenciador de senhas dedicado nem os cuidados com o dispositivo.

## 📁 Estrutura de pastas

- index.html — página da Ficha Digital.
- css/ficha-digital.css — estilos da página.
- js/ficha-digital.js — interações do formulário e geração do PDF.
- js/vendor/pdf-lib.min.js — biblioteca local usada para criar o PDF.
- js/vendor/README.md e js/vendor/LICENSE.txt — informações e licença da biblioteca.
- image/logo-vetus.png — logo incluída neste projeto.

## 📜 Licenças

O projeto da Ficha Digital não declara uma licença de reutilização. A biblioteca PDF-Lib incluída possui sua própria licença MIT, disponível em js/vendor/LICENSE.txt. A licença da biblioteca não concede licença sobre a marca ou os demais arquivos da Vétus.

## 📞 Contato

- **WhatsApp da Vétus:** [+55 34 99824-2733](https://wa.me/5534998242733)

## 📚 Referências de hospedagem

- [Criar um site no GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Segurança e HTTPS no GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
