const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const porta = 3000;

app.use(express.json());
app.use(cors());

// LEITURA (GET)
app.get('/jogos', (req, res) => {
    try {
        const dados = fs.readFileSync('banco-de-dados.json', 'utf-8');
        res.json(JSON.parse(dados));
    } catch (erro) {
        res.json([]);
    }
});

// CRIAÇÃO (POST)
app.post('/jogos', (req, res) => {
    const novoJogo = req.body;
    novoJogo.id = Date.now(); // Gera ID único

    let lista = lerBanco();
    lista.push(novoJogo);
    salvarBanco(lista);

    res.json({ mensagem: "Criado com sucesso!" });
});

// EDIÇÃO (PUT) - A NOVIDADE!
app.put('/jogos/:id', (req, res) => {
    const id = Number(req.params.id);
    const dadosNovos = req.body;

    let lista = lerBanco();
    
    // Procura o índice do jogo que tem esse ID
    const indice = lista.findIndex(jogo => jogo.id === id);

    if (indice !== -1) {
        // Mantém o ID original, mas atualiza o resto
        lista[indice] = { 
            id: id, 
            titulo: dadosNovos.titulo, 
            ano: dadosNovos.ano, 
            preco: dadosNovos.preco 
        };
        
        salvarBanco(lista);
        res.json({ mensagem: "Atualizado com sucesso!" });
    } else {
        res.status(404).json({ mensagem: "Jogo não encontrado" });
    }
});

// DELEÇÃO (DELETE)
app.delete('/jogos/:id', (req, res) => {
    const id = Number(req.params.id);
    let lista = lerBanco();
    // Filtra: mantém apenas quem NÃO é o ID deletado
    lista = lista.filter(jogo => jogo.id !== id);
    salvarBanco(lista);
    res.json({ mensagem: "Deletado!" });
});

// FUNÇÕES AJUDANTES (Para não repetir código)
function lerBanco() {
    try {
        const dados = fs.readFileSync('banco-de-dados.json', 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        return [];
    }
}

function salvarBanco(lista) {
    fs.writeFileSync('banco-de-dados.json', JSON.stringify(lista, null, 2));
}

app.listen(porta, () => {
    console.log("Servidor rodando na porta 3000");
});