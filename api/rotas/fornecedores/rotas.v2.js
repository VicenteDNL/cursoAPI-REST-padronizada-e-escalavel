const roteador = require('express').Router()
const TabelaFornecerdor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/',(requisicao, resposta, proximo)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()

})

roteador.get('/', async (requisicao, resposta)=>{
    const resultados = await TabelaFornecerdor.listar()
    resposta.status(200)
    const serializador =new SerializadorFornecedor(
        resposta.getHeader('Content-Type')
        )
    resposta.send(serializador.serializar(resultados))

})

module.exports = roteador
