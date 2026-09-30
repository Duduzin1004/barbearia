"use strict";


/*
=========================================================
VARIÁVEIS
=========================================================
*/

let servicoSelecionado = null;
let precoSelecionado = 0;
let horarioSelecionado = null;


/*
=========================================================
HORÁRIOS
=========================================================
*/

const horarios = [

    "10:20",
    "10:40",

    "11:00",
    "11:20",
    "11:40",

    "12:00",
    "12:20",
    "12:40",

    "13:00",
    "13:20",
    "13:40",

    "14:00",
    "14:20",
    "14:40",

    "15:00",
    "15:20",
    "15:40",

    "16:00",
    "16:20",
    "16:40",

    "17:00",
    "17:20",
    "17:40",

    "18:00",
    "18:20",
    "18:40",

    "19:00",
    "19:20",
    "19:40",

    "20:00",
    "20:20",
    "20:40",

    "21:00"

];


/*
=========================================================
PEGAR AGENDAMENTOS
=========================================================
*/

function pegarAgendamentos() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "agendamentosBarbearia"
            )
        ) || [];

    } catch (erro) {

        console.error(
            "Erro ao ler agendamentos:",
            erro
        );

        return [];

    }

}


/*
=========================================================
SALVAR AGENDAMENTOS
=========================================================
*/

function salvarAgendamentos(
    agendamentos
) {

    localStorage.setItem(

        "agendamentosBarbearia",

        JSON.stringify(
            agendamentos
        )

    );

}


/*
=========================================================
SELECIONAR SERVIÇO
=========================================================
*/

function selecionarServico(
    elemento
) {

    const nome =
        elemento.dataset.nome;

    const preco =
        Number(
            elemento.dataset.preco
        );


    /*
    Remove seleção dos outros
    */

    document
        .querySelectorAll(".servico")
        .forEach(servico => {

            servico.classList.remove(
                "selecionado"
            );

        });


    /*
    Seleciona o atual
    */

    elemento.classList.add(
        "selecionado"
    );


    /*
    Guarda dados
    */

    servicoSelecionado =
        nome;

    precoSelecionado =
        preco;


    /*
    Atualiza resumo
    */

    const resumoServico =
        document.getElementById(
            "resumoServico"
        );

    const resumoValor =
        document.getElementById(
            "resumoValor"
        );


    if (resumoServico) {

        resumoServico.textContent =
            nome;

    }


    if (resumoValor) {

        resumoValor.textContent =
            formatarValor(preco);

    }


    /*
    Vai para agendamento
    */

    setTimeout(
        function() {

            const agendamento =
                document.getElementById(
                    "agendamento"
                );

            if (agendamento) {

                agendamento.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        },
        100
    );

}


/*
=========================================================
FORMATAR VALOR
=========================================================
*/

function formatarValor(
    valor
) {

    return (

        "R$ " +

        Number(valor)
            .toFixed(2)
            .replace(".", ",")

    );

}


/*
=========================================================
VERIFICAR HORÁRIO OCUPADO
=========================================================
*/

function horarioOcupado(
    data,
    horario
) {

    const agendamentos =
        pegarAgendamentos();


    return agendamentos.some(
        agendamento =>

            String(
                agendamento.data
            ) === String(data)

            &&

            String(
                agendamento.horario
            ) === String(horario)

    );

}


/*
=========================================================
CARREGAR HORÁRIOS
=========================================================
*/

function carregarHorarios() {

    const container =
        document.getElementById(
            "horarios"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const campoData =
        document.getElementById(
            "data"
        );


    if (!campoData) {

        return;

    }


    const data =
        campoData.value;


    /*
    Se não escolheu data
    */

    if (!data) {

        container.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    color:#777;
                    text-align:center;
                    padding:20px;
                "
            >

                📅

                <br><br>

                Escolha uma data
                para ver os horários.

            </div>

        `;

        return;

    }


    /*
    Cria todos os horários
    */

    horarios.forEach(
        horario => {


            const ocupado =
                horarioOcupado(
                    data,
                    horario
                );


            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                horario;


            if (ocupado) {

                /*
                HORÁRIO OCUPADO
                */

                div.className =
                    "horario indisponivel";


                const status =
                    document.createElement(
                        "span"
                    );

                status.className =
                    "status";

                status.textContent =
                    "Indisponível";


                div.appendChild(
                    status
                );

            }

            else {

                /*
                HORÁRIO DISPONÍVEL
                */

                div.className =
                    "horario disponivel";


                const status =
                    document.createElement(
                        "span"
                    );

                status.className =
                    "status";

                status.textContent =
                    "Disponível";


                div.appendChild(
                    status
                );


                /*
                CLICK / TOUCH
                */

                div.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        selecionarHorario(
                            horario,
                            div
                        );

                    },
                    {
                        passive: false
                    }
                );

            }


            container.appendChild(
                div
            );

        }
    );

}


/*
=========================================================
SELECIONAR HORÁRIO
=========================================================
*/

function selecionarHorario(
    horario,
    elemento
) {

    /*
    Remove seleção
    */

    document
        .querySelectorAll(
            ".horario"
        )
        .forEach(item => {

            item.classList.remove(
                "selecionado"
            );

        });


    /*
    Seleciona horário
    */

    elemento.classList.add(
        "selecionado"
    );


    horarioSelecionado =
        horario;


    /*
    Atualiza resumo
    */

    const resumoHorario =
        document.getElementById(
            "resumoHorario"
        );


    if (resumoHorario) {

        resumoHorario.textContent =
            horario;

    }

}


/*
=========================================================
ATUALIZAR DATA
=========================================================
*/

function atualizarData() {

    const campoData =
        document.getElementById(
            "data"
        );


    if (!campoData) {

        return;

    }


    const data =
        campoData.value;


    /*
    Reseta horário
    */

    horarioSelecionado =
        null;


    const resumoHorario =
        document.getElementById(
            "resumoHorario"
        );


    if (resumoHorario) {

        resumoHorario.textContent =
            "Não selecionado";

    }


    /*
    Se não tem data
    */

    if (!data) {

        carregarHorarios();

        return;

    }


    /*
    Formata data
    */

    const dataFormatada =
        new Date(
            data + "T00:00:00"
        )
        .toLocaleDateString(
            "pt-BR"
        );


    const resumoData =
        document.getElementById(
            "resumoData"
        );


    if (resumoData) {

        resumoData.textContent =
            dataFormatada;

    }


    /*
    Mostra horários
    */

    carregarHorarios();

}


/*
=========================================================
ATUALIZAR CLIENTE
=========================================================
*/

function atualizarCliente() {

    const nome =
        document.getElementById(
            "nome"
        )?.value.trim() || "";


    const sobrenome =
        document.getElementById(
            "sobrenome"
        )?.value.trim() || "";


    const telefone =
        document.getElementById(
            "telefone"
        )?.value.trim() || "";


    const resumoCliente =
        document.getElementById(
            "resumoCliente"
        );


    const resumoTelefone =
        document.getElementById(
            "resumoTelefone"
        );


    if (resumoCliente) {

        resumoCliente.textContent =

            `${nome} ${sobrenome}`.trim()

            ||

            "Não informado";

    }


    if (resumoTelefone) {

        resumoTelefone.textContent =

            telefone

            ||

            "Não informado";

    }

}


/*
=========================================================
CONFIRMAR AGENDAMENTO
=========================================================
*/

function confirmarAgendamento() {

    const nome =
        document.getElementById(
            "nome"
        )?.value.trim() || "";


    const sobrenome =
        document.getElementById(
            "sobrenome"
        )?.value.trim() || "";


    const telefone =
        document.getElementById(
            "telefone"
        )?.value.trim() || "";


    const data =
        document.getElementById(
            "data"
        )?.value || "";


    /*
    SERVIÇO
    */

    if (!servicoSelecionado) {

        alert(
            "Escolha um serviço primeiro."
        );

        return;

    }


    /*
    NOME
    */

    if (!nome || !sobrenome) {

        alert(
            "Digite seu nome e sobrenome."
        );

        return;

    }


    /*
    TELEFONE
    */

    if (!telefone) {

        alert(
            "Digite seu número de telefone."
        );

        return;

    }


    /*
    DATA
    */

    if (!data) {

        alert(
            "Escolha uma data."
        );

        return;

    }


    /*
    HORÁRIO
    */

    if (!horarioSelecionado) {

        alert(
            "Escolha um horário disponível."
        );

        return;

    }


    /*
    VERIFICA NOVAMENTE
    */

    if (
        horarioOcupado(
            data,
            horarioSelecionado
        )
    ) {

        alert(
            "Esse horário acabou de ser ocupado. Escolha outro."
        );


        carregarHorarios();


        horarioSelecionado =
            null;


        return;

    }


    /*
    CRIA AGENDAMENTO
    */

    const novoAgendamento = {

        id:
            Date.now(),

        nome:
            nome,

        sobrenome:
            sobrenome,

        telefone:
            telefone,

        servico:
            servicoSelecionado,

        valor:
            precoSelecionado,

        data:
            data,

        horario:
            horarioSelecionado,

        criadoEm:
            new Date().toISOString()

    };


    /*
    PEGA AGENDAMENTOS
    */

    const agendamentos =
        pegarAgendamentos();


    /*
    SALVA NOVO
    */

    agendamentos.push(
        novoAgendamento
    );


    salvarAgendamentos(
        agendamentos
    );


    /*
    DATA FORMATADA
    */

    const dataFormatada =
        new Date(
            data + "T00:00:00"
        )
        .toLocaleDateString(
            "pt-BR"
        );


    /*
    MENSAGEM
    */

    const mensagem =
        document.getElementById(
            "mensagemModal"
        );


    if (mensagem) {

        mensagem.innerHTML = `

            Olá,
            <strong>${nome}</strong>!

            <br><br>

            Seu horário foi reservado
            com sucesso.

            <br><br>

            <strong>
                ${servicoSelecionado}
            </strong>

            <br>

            ${dataFormatada}

            <br>

            às

            <strong>
                ${horarioSelecionado}
            </strong>

            <br><br>

            Valor:

            <strong>
                ${formatarValor(
                    precoSelecionado
                )}
            </strong>

        `;

    }


    /*
    ABRE MODAL
    */

    const modal =
        document.getElementById(
            "modal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }


    /*
    LIMPA HORÁRIO
    */

    horarioSelecionado =
        null;


    const resumoHorario =
        document.getElementById(
            "resumoHorario"
        );


    if (resumoHorario) {

        resumoHorario.textContent =
            "Não selecionado";

    }


    /*
    ATUALIZA HORÁRIOS
    */

    carregarHorarios();

}


/*
=========================================================
FECHAR MODAL
=========================================================
*/

function fecharModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


/*
=========================================================
MENU MOBILE
=========================================================
*/

function abrirMenu() {

    const menu =
        document.getElementById(
            "menu"
        );


    const botao =
        document.getElementById(
            "menuMobile"
        );


    if (!menu || !botao) {

        return;

    }


    menu.classList.toggle(
        "ativo"
    );


    if (
        menu.classList.contains(
            "ativo"
        )
    ) {

        botao.textContent =
            "✕";

    }

    else {

        botao.textContent =
            "☰";

    }

}


/*
=========================================================
IR PARA AGENDAMENTO
=========================================================
*/

function irParaAgendamento() {

    const agendamento =
        document.getElementById(
            "agendamento"
        );


    if (agendamento) {

        agendamento.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}


/*
=========================================================
GOOGLE MAPS
=========================================================
*/

function abrirMapa() {

    window.open(

        "https://maps.app.goo.gl/XUdfsSjfFifv14T58",

        "_blank"

    );

}


/*
=========================================================
INICIALIZAÇÃO
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function() {


        /*
        SERVIÇOS
        */

        document
            .querySelectorAll(
                ".servico"
            )
            .forEach(
                elemento => {

                    elemento.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            selecionarServico(
                                elemento
                            );

                        },
                        {
                            passive: false
                        }
                    );

                }
            );


        /*
        DATA
        */

        const campoData =
            document.getElementById(
                "data"
            );


        if (campoData) {

            const hoje =
                new Date();


            const ano =
                hoje.getFullYear();


            const mes =
                String(
                    hoje.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const dia =
                String(
                    hoje.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const dataHoje =
                `${ano}-${mes}-${dia}`;


            campoData.setAttribute(
                "min",
                dataHoje
            );


            campoData.addEventListener(
                "change",
                atualizarData
            );


            /*
            iOS pode disparar input
            */

            campoData.addEventListener(
                "input",
                atualizarData
            );

        }


        /*
        CAMPOS DO CLIENTE
        */

        [
            "nome",
            "sobrenome",
            "telefone"
        ]
        .forEach(
            id => {

                const campo =
                    document.getElementById(
                        id
                    );


                if (campo) {

                    campo.addEventListener(
                        "input",
                        atualizarCliente
                    );

                }

            }
        );


        /*
        BOTÃO CONFIRMAR
        */

        const btnConfirmar =
            document.getElementById(
                "btnConfirmar"
            );


        if (btnConfirmar) {

            btnConfirmar.addEventListener(
                "click",
                confirmarAgendamento
            );

        }


        /*
        BOTÃO HORÁRIO
        */

        const btnHorario =
            document.getElementById(
                "botaoSelecionarHorario"
            );


        if (btnHorario) {

            btnHorario.addEventListener(
                "click",
                function() {

                    const data =
                        document.getElementById(
                            "data"
                        )?.value;


                    if (!data) {

                        alert(
                            "Primeiro escolha uma data."
                        );

                        return;

                    }


                    carregarHorarios();

                }
            );

        }


        /*
        MENU
        */

        const btnMenu =
            document.getElementById(
                "menuMobile"
            );


        if (btnMenu) {

            btnMenu.addEventListener(
                "click",
                abrirMenu
            );

        }


        /*
        FECHAR MENU
        */

        document
            .querySelectorAll(
                ".menu a"
            )
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        function() {

                            const menu =
                                document.getElementById(
                                    "menu"
                                );


                            const botao =
                                document.getElementById(
                                    "menuMobile"
                                );


                            if (menu) {

                                menu.classList.remove(
                                    "ativo"
                                );

                            }


                            if (botao) {

                                botao.textContent =
                                    "☰";

                            }

                        }
                    );

                }
            );


        /*
        HERO
        */

        const btnHero =
            document.getElementById(
                "btnHero"
            );


        if (btnHero) {

            btnHero.addEventListener(
                "click",
                irParaAgendamento
            );

        }


        /*
        MODAL
        */

        const btnFechar =
            document.getElementById(
                "btnFecharModal"
            );


        if (btnFechar) {

            btnFechar.addEventListener(
                "click",
                fecharModal
            );

        }


        /*
        MAPA
        */

        const btnMapa =
            document.getElementById(
                "btnMapa"
            );


        const btnMapa2 =
            document.getElementById(
                "btnMapa2"
            );


        if (btnMapa) {

            btnMapa.addEventListener(
                "click",
                abrirMapa
            );

        }


        if (btnMapa2) {

            btnMapa2.addEventListener(
                "click",
                abrirMapa
            );

        }


        /*
        MOSTRA HORÁRIOS
        */

        carregarHorarios();

    }
);
