

(() => {
  "use strict";

  const CONFIG = {
    whatsapp: "5524981172181",
    instagram: "https://www.instagram.com/adv.pedromendonca/",
    oab: "OAB/RJ 258453"
  };

  const whatsappURL = `https://wa.me/${CONFIG.whatsapp}`;

  

  document.querySelectorAll("[data-whatsapp]").forEach(link => {
    link.href = whatsappURL;
  });

  document.querySelectorAll("[data-instagram]").forEach(link => {
    link.href = CONFIG.instagram;
  });

  

  const elementoAno = document.getElementById("ano");

  if (elementoAno) {
    elementoAno.textContent = new Date().getFullYear();
  }

 

  const botaoMenu = document.querySelector(".menu-toggle");
  const menuMobile = document.getElementById("menu-mobile");

  function controlarMenu(aberto) {
    if (!botaoMenu || !menuMobile) return;

    menuMobile.hidden = !aberto;

    botaoMenu.setAttribute(
      "aria-expanded",
      String(aberto)
    );

    botaoMenu.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );

    document.body.classList.toggle(
      "menu-is-open",
      aberto
    );
  }

  if (botaoMenu && menuMobile) {

    botaoMenu.addEventListener("click", () => {
      controlarMenu(menuMobile.hidden);
    });

    
    menuMobile.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        controlarMenu(false);
      });
    });

    document.addEventListener("keydown", evento => {
      if (evento.key === "Escape") {
        controlarMenu(false);
      }
    });

    
    document.addEventListener("click", evento => {
      if (
        !menuMobile.hidden &&
        !menuMobile.contains(evento.target) &&
        !botaoMenu.contains(evento.target)
      ) {
        controlarMenu(false);
      }
    });

   
    window.addEventListener("resize", () => {
      if (window.innerWidth > 940) {
        controlarMenu(false);
      }
    });

  }

  

  const linksNavegacao =
    document.querySelectorAll("[data-nav]");

  const secoes = [
    "inicio",
    "atuacao",
    "sobre",
    "conteudos",
    "contato"
  ];

  function atualizarLinkAtivo(id) {
    linksNavegacao.forEach(link => {

      const ativo =
        link.getAttribute("href") === `#${id}`;

      link.classList.toggle("active", ativo);

      if (ativo) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }

    });
  }

  if ("IntersectionObserver" in window) {

    const observador = new IntersectionObserver(
      entradas => {

        entradas.forEach(entrada => {

          if (entrada.isIntersecting) {
            atualizarLinkAtivo(entrada.target.id);
          }

        });

      },
      {
        rootMargin: "-25% 0px -64% 0px",
        threshold: 0
      }
    );

    secoes.forEach(id => {
      const secao = document.getElementById(id);

      if (secao) {
        observador.observe(secao);
      }
    });

  }

 

  const formulario = document.getElementById("contact-form");
  const retorno = document.getElementById("form-feedback");

  function mostrarMensagem(texto, erro = false) {
    if (!retorno) return;

    retorno.textContent = texto;
    retorno.classList.toggle("error", erro);
  }

  function prepararWhatsApp(nome, assunto, descricao) {

    let mensagem =
      `Olá, meu nome é ${nome}.\n\n` +
      `Gostaria de informações sobre atendimento jurídico.\n\n` +
      `Assunto: ${assunto}.`;

    if (descricao) {
      mensagem += `\n\nDescrição geral: ${descricao}`;
    }

    return (
      `${whatsappURL}?text=${encodeURIComponent(mensagem)}`
    );
  }

  if (formulario) {

    formulario.addEventListener("submit", evento => {
      evento.preventDefault();

      const campoNome =
        formulario.elements.namedItem("nome");

      const campoAssunto =
        formulario.elements.namedItem("assunto");

      const campoDescricao =
        formulario.elements.namedItem("mensagem");

      if (!campoNome || !campoAssunto) {
        mostrarMensagem(
          "Não foi possível preparar a mensagem.",
          true
        );
        return;
      }

      const nome = campoNome.value
        .trim()
        .replace(/\s+/g, " ");

      const assunto = campoAssunto.value.trim();

      const descricao = campoDescricao
        ? campoDescricao.value.trim()
        : "";

      
      if (nome.length < 2 || nome.length > 90) {

        mostrarMensagem(
          "Informe seu nome com pelo menos dois caracteres.",
          true
        );

        campoNome.focus();
        return;
      }

      const assuntosValidos = Array.from(
        campoAssunto.options
      )
        .map(opcao => opcao.value)
        .filter(Boolean);

      if (!assuntosValidos.includes(assunto)) {

        mostrarMensagem(
          "Selecione o assunto principal.",
          true
        );

        campoAssunto.focus();
        return;
      }

      
      const link = prepararWhatsApp(
        nome,
        assunto,
        descricao
      );

      mostrarMensagem(
        "Abrindo o WhatsApp para conferir sua mensagem."
      );

      window.location.assign(link);

    });

  }

})();
