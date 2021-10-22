const roteador = require('express').Router({mergeParams:true})
const Tabela = require('./TabelaReclamacao')

roteador.get('/', async (requisicao, resposta)=>{
    const reclamacoes = await Tabela.listar(
        requisicao.params.idFornecedor, requisicao.params.reclamacoes)
    resposta.send(JSON.stringify([]))
})

module.exports =roteador