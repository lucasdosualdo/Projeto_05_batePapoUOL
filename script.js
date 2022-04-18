let nome = prompt("Qual o seu nome?");
let sucesso = 0;


entery();

function entery(){
    let dados = {name: nome};
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);
    promise.then(success);
    promise.catch(error);
}

function success(resposta){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(carregarChat);
    promise.catch(reload);
    sucesso++;
    intervalos();
}

function error(erro){
    if(erro.response.status === 400){
        nome = prompt("Esse nome já está em uso. Por favor, escolha outro nome:");
        entery();
    }
}

function intervalos(){
    if(sucesso == 1){
        setInterval(success, 3000);
        setInterval(atualizarOnline, 5000);
    }
}


function atualizarOnline(){
    const dados = {name: nome};
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', dados);
    promise.catch(reload);
} 


function carregarChat(resposta){
    const chat = document.querySelector(".chat");
    const mensagens = resposta.data;
    const qntMensagens = mensagens.length;
    chat.innerHTML = "";
    for(let i = 0; i < qntMensagens; i++){
        if(mensagens[i].type === "status"){
            chat.innerHTML += `<div class="mensagem status">
                                <span class="time">(${mensagens[i].time})</span>
                                <span class="user">${mensagens[i].from}</span>
                                <span class="text">${mensagens[i].text}</span>
                            </div>`
        }
        if(mensagens[i].type === "message"){
            if(mensagens[i].to === "Geral"){
                chat.innerHTML += `<div class="mensagem msgGeral">
                                <span class="time">(${mensagens[i].time})</span>
                                <span class="user">${mensagens[i].from}</span>
                                <span class="text">para</span>
                                <span class="user">${mensagens[i].to}<span class="text">:</span></span>
                                <span class="text">${mensagens[i].text}</span>
                            </div>`
            }
        }
        if(mensagens[i].type === "private_message"){
            if(mensagens[i].to === nome){
                chat.innerHTML += `<div class="mensagem msgReservada">
                                <span class="time">(${mensagens[i].time})</span>
                                <span class="user">${mensagens[i].from}</span>
                                <span class="text">reservadamente para</span>
                                <span class="user">${mensagens[i].to}<span class="text">:</span></span>
                                <span class="text">${mensagens[i].text}</span>
                            </div>`
            }
        }
    }

    const allMessages = document.querySelectorAll('.mensagem');
    const elementAppear = allMessages[allMessages.length-1];
    elementAppear.scrollIntoView();
}

function enviarMensagem(click){
    const input = click.parentNode.querySelector("input");
    const mensagem = input.value;
    const dados = {
        from: nome,
	    to: "Geral",
	    text: mensagem,
	    type: "message"
    };
    input.value = "";
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dados);
    promise.then(success);
    promise.catch(reload);
}

function reload(){
    alert("Ocorreu um erro");
    window.location.reload();
}