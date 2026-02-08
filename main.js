function rolarDado(lados) {
    return Math.floor(Math.random() * lados) + 1;
}

function rolarVarios(qtd, lados, log) {
    let total = 0;
    for (let i = 1; i <= qtd; i++) {
        let valor = rolarDado(lados);
        log.push(`Dado ${i} (d${lados}) = ${valor}`);
        total += valor;
    }
    return total;
}

function rolarAcerto(vantagem, bonusAcerto, log) {
    let d1 = rolarDado(20);
    let dFinal = d1;

    if (vantagem) {
        let d2 = rolarDado(20);
        dFinal = Math.max(d1, d2);
        log.push(`Rolagens (vantagem): ${d1} e ${d2}`);
    } else {
        log.push(`Rolagem de acerto: ${d1}`);
    }

    let total = dFinal + bonusAcerto;
    log.push(`Total de acerto: ${dFinal} + ${bonusAcerto} = ${total}`);

    return { dado: dFinal, total: total };
}

function calcularDano(qtdDados, lados, bonus, critico, log) {
    let multiplicador = critico ? 2 : 1;
    let danoDados = rolarVarios(qtdDados * multiplicador, lados, log);
    let danoTotal = danoDados + bonus;

    log.push(`Dano dos dados: ${danoDados} + ${bonus} = ${danoTotal}`);
    return danoTotal;
}

/* =========================
   DEFINIÇÃO DAS BESTAS
========================= */

const BESTAS = {
    lobo: {
        nome: "Lobo",
        ataques: {
            mordida: {
                nome: "Mordida",
                dados: 2,
                lados: 4,
                bonusDano: 2,
                bonusAcerto: 4
            }
        }
    },
    pantera: {
        nome: "Pantera",
        ataques: {
            garras: {
                nome: "Garras",
                dados: 1,
                lados: 4,
                bonusDano: 2,
                bonusAcerto: 4
            },
            mordida: {
                nome: "Mordida",
                dados: 1,
                lados: 6,
                bonusDano: 2,
                bonusAcerto: 4
            }
        }
    },
    cobraVoadora: {
        nome: "Cobra Voadora",
        ataques: {
            mordida: {
                nome: "Mordida",
                dados: 3,        // 3d4 de veneno
                lados: 4,
                bonusDano: 1,    // 1 de dano perfurante fixo
                bonusAcerto: 6
            }
        }
    }
};

/* ========================= */

function atacar() {
    const tipoBesta = document.getElementById("besta").value;
    const ataqueEscolhido = document.getElementById("ataquePantera")?.value || "mordida";
    const qtd = parseInt(document.getElementById("quantidade").value) || 1;
    const vantagem = document.getElementById("vantagem").checked;
    const alvoCaido = document.getElementById("alvoCaido").checked;
    const resultadoEl = document.getElementById("resultado");

    let log = [];
    let besta = BESTAS[tipoBesta];

    for (let i = 1; i <= qtd; i++) {
        let ataque;

        if (tipoBesta === "lobo") {
            ataque = besta.ataques.mordida;
        } else if (tipoBesta === "pantera") {
            ataque = besta.ataques[ataqueEscolhido];
        } else if (tipoBesta === "cobraVoadora") {
            ataque = besta.ataques.mordida;
        }

        log.push(`\n${besta.nome} (${i}) usa ${ataque.nome}! (+${ataque.bonusAcerto} para acertar)`);

        let acerto = rolarAcerto(vantagem, ataque.bonusAcerto, log);
        let critico = acerto.dado === 20;

        if (critico) log.push("💥 ACERTO CRÍTICO!");

        calcularDano(ataque.dados, ataque.lados, ataque.bonusDano, critico, log);

        // Regra especial: pantera ganha mordida extra se alvo caído
        if (tipoBesta === "pantera" && alvoCaido) {
            let mordidaExtra = besta.ataques.mordida;
            log.push("🩸 Alvo caído! Mordida extra!");

            let acertoExtra = rolarAcerto(vantagem, mordidaExtra.bonusAcerto, log);
            let criticoExtra = acertoExtra.dado === 20;

            if (criticoExtra) log.push("💥 CRÍTICO na mordida extra!");

            calcularDano(mordidaExtra.dados, mordidaExtra.lados, mordidaExtra.bonusDano, criticoExtra, log);
        }
    }

    resultadoEl.textContent = log.join("\n");
}

/* Mostrar opções da pantera */
window.onload = function () {
    document.getElementById("besta").addEventListener("change", function () {
        document.getElementById("ataquesPantera").style.display =
            this.value === "pantera" ? "block" : "none";
    });
};
