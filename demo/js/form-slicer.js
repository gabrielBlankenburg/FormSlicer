'use strict';

/** not:
 * 
 * Esconde todos os fieldsets que não sejam o primeiro,
 * Eventlistener para o next e previous.
 */

const main = () => {
    //1.

    (function mostrar() {
        const fslicer = document.querySelectorAll('#fslicer');
        if (fslicer.length > 0) {
            const fieldsets = document.querySelectorAll('#fslicer fieldset:not(:first-of-type)');
            const fieldsetsArr = Array.prototype.slice.call(fieldsets);
            fieldsetsArr
                .forEach(x => {
                    x.style.display = 'none';
                });
            criarBotoes();
        }
    })();

    //2.
    document.getElementsByTagName('form')[0].addEventListener('click', function (e) {
        const form = document.getElementsByTagName('form')[0];
        if (e.target && e.target.matches('.atualNext')) {
            // Confere se o usuario pediu validação
            if (form.classList.contains('fs-validate')) {
                prox('x');
            } else {
                prox();
            }
        } else if (e.target && e.target.matches('.atualPrev')) {
            prev();
        }
    });
}

/**not:
 * Vi que o plugin jqueryvalidate usava de regras de regex para 
 * validar, então tive a ideia de usar essas 
 * regras dentro de objetos para o mesmo.
 * 
 * Cria uma array com todos os inputs atuais. Para cada ele 
 * realiza um teste de regex com o value, aumentando o contador
 * a cada erro. 
 * 
 * Retorna true caso não tenha nenhum erro
 * 
 */


const validar = () => {
    // Regras tiradas da página do mozilla sobre regex
    const regrasREGEX = {
        email: /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        num: /[0-9]/,
        texto: /[a-zA-Z]/,
        nome: /[a-zA-Z]{5,15}/,
    };
    let contador = 0;
    const botaoAtual = document.querySelector('.atualNext');
    const inputs = botaoAtual.parentNode.getElementsByTagName('input');
    const inputsArr = Array.from(inputs);
    limparErros();
    inputsArr.forEach(x => {
        if (x.type === 'text') {
            if (!regrasREGEX.texto.test(x.value)) {
                x.placeholder = 'Campo inválido';
                let msg = ' Campo inválido';
                addErro(x, msg); // Chama função que cria span e passa a msg
                contador++;
            }
        } else if (x.type === 'number') {
            if (!regrasREGEX.num.test(x.value)) {
                x.placeholder = 'Campo inválido';
                let msg = ' Deve conter apenas números ou está vazio.';
                addErro(x, msg);
                contador++;
            }
        } else if (x.type === 'email') {
            if (!regrasREGEX.email.test(x.value)) {
                x.placeholder = 'Email inválido';
                let msg = ' Email não atende aos padrões.';
                addErro(x, msg); // Chama função que cria span e passa a msg
                contador++;
            } else {

            }
        } else if (x.type === 'password') {
            if (!regrasREGEX.nome.test(x.value)) {
                x.placeholder = 'Erro na senha(?)'; //Pensar sobre isso tbm
                const msg = 'Campo inválido';
                addErro(x, msg);
                contador++;
            } else {

            }
        } else {}

    });

    // contador === 0 significa que não foi encontrado erros (return true)
    return contador === 0;
}

// Fernando
// Função que criar um span com mensagem de erro depois do input
// Ele pede o input que está com o erro e criar um span com a msg que vc passa no if lá em cima
const addErro = (x, msg) => {
    // Cria erro
    const erro = document.createElement('span');
    const textErro = document.createTextNode(msg);
    erro.appendChild(textErro);
    erro.classList.add('fsErro');
    insertAfter(x, erro);
    x.style.border = '1px solid red';
}

const limparErros = () => {
    // Pega todos os erros e deleta
    const ps = Array.from(document.querySelectorAll('.fsErro'));
    ps.forEach(x => {
        if (ps.length > 0) {
            x.parentNode.removeChild(x);
        }
    });
}

// Função para inserir elemento ápos o anterior
const insertAfter = (onde, add) => {
    onde.parentNode.insertBefore(add, onde.nextSibling);
}

// Função que verifica os tipos dos inputs no form
// Estou colocando ela no código principal, assim que terminar, tiro o comentário
/* 
    document.querySelector('#ativa').addEventListener('click', function(e){ // Seleciona e adiciona Evento
        var a = document.getElementsByTagName('form')[0]; // Seleciona Form
        var inputArr = Array.from(a); // Array do obj 
            inputArr.forEach(function (x) { 
                alert(x.type); // Exibe o tipo dele no alerta
            });
    });
*/

/** not: 
 * Reconhece o primeiro botão next, coloca o fieldset (parente) como none 
 * pega o proximo fieldset irmão do parente e coloca block.
 * 
 * Se o ultimo elemento do proximo fieldset for também um botão que possui a classe next 
 * (para então não dar erro com o botão de previous) ele coloca .atualNext nele.
 * Se ele possuir um botão antes (prev) ele coloca atualPrev. 
 * Se não existir mais um next (else) ele coloca esse botao como atualPrev
 * 
 */

const prox = (validate) => {
    // NEXT
    let botaoAtual = document.getElementsByClassName('atualNext')[0];
    
    // Usa a função validar para conferir os inputs e liberar o botão
    if (validate !== undefined) {
        if (!validar()) {
            return;
        }
    }
    botaoAtual.parentElement.style.display = 'none';
    botaoAtual.parentElement.nextElementSibling.style.display = 'block';
    if (ultimoFilhoProximoPai(botaoAtual).classList.contains('next')) {
        ultimoFilhoProximoPai(botaoAtual).previousElementSibling.classList.add('atualPrev');
        ultimoFilhoProximoPai(botaoAtual).classList.add('atualNext');
    } else {
        ultimoFilhoProximoPai(botaoAtual).classList.add('atualPrev');
    }
    botaoAtual.parentNode.lastChild.previousElementSibling.classList.remove('atualPrev');
    botaoAtual.classList.remove('atualNext');
}

/** not: 
 * Reconhece o primeiro botão atualPrev, coloca o fieldset (parente) como display:none 
 * pega o proximo fieldset irmão do parente e coloca block.
 * 
 * No if ele pega o pai, depois pega o ultimo elemento igual ao pai antes dele, 
 * procura o ultimo filho, pega o ultimo irmão e ve se é next ou previous
 * a confusão maior é pra manter o atualNext e na hora que acaba os previous, 
 * mas isso é resolvido no else (que ve se ele possui um irmao pro ultimo filho).
 * 
 */

const prev = () => {
    // Previous
    let botaoAtual = document.getElementsByClassName('atualPrev')[0];
    botaoAtual.parentElement.style.display = 'none';
    botaoAtual.parentElement.previousElementSibling.style.display = 'block';
    if (ultimoFilhoPreviousPai(botaoAtual).previousElementSibling.classList.contains('prev')) {
        ultimoFilhoPreviousPai(botaoAtual).previousElementSibling.classList.add('atualPrev');
        ultimoFilhoPreviousPai(botaoAtual).classList.add('atualNext');
    } else {
        ultimoFilhoPreviousPai(botaoAtual).classList.add('atualNext');
    }
    botaoAtual.parentNode.lastChild.previousElementSibling.classList.remove('atualPrev');
    botaoAtual.classList.remove('atualNext');
}



/** not:
 * Criei pra melhorar a visualização do código, as classes estavam gigantescas então achei
 * melhor criar essas funções para facilitar a visualização
 * @param elementoDesejado
 * @returns o ultimo filho do irmão do pai
 */

const ultimoFilhoProximoPai = (botaoAtual) => {
    return botaoAtual.parentNode.nextElementSibling.lastChild;
}

/** not:
 * @param elementoDesejado
 * @returns o ultimo filho do irmão anterior do pai
 */


const ultimoFilhoPreviousPai = (botaoAtual) => {
    return botaoAtual.parentNode.previousElementSibling.lastChild;
}


/** not:
 * Pega as arrays e transforma em uma Array, depois realiza
 * a criação dos botões next e previous com as devidas classes
 * o primeiro botão next vem com a classe atualNext para
 * depois possibilitar a navegação
 * 
 */

const criarBotoes = () => {
    const fieldsets = document.querySelectorAll('#fslicer fieldset');
    const fieldsetArr = Array.prototype.slice.call(fieldsets)
        .forEach(function (x) {
            let prev = document.createElement('button');
            prev.classList.add('prev', 'bgt');
            prev.textContent = 'voltar';
            prev.type = 'button';

            let next = document.createElement('button');
            next.classList.add('next', 'bgt')
            next.textContent = 'avançar';
            next.type = 'button';

            if (x.previousElementSibling && x.nextElementSibling) {
                x.appendChild(prev);
                x.appendChild(next);
            } else if (x.nextElementSibling) {
                next.classList.add('atualNext');
                x.appendChild(next);
            } else if (x.previousElementSibling) {
                x.appendChild(prev);
            }
        });
}

/** Prepara função ao ativar tela */
window.onload = main;