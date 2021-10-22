const roteador = require('express').Router()
const TabelaFornecerdor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/',(requisicao, resposta, proximo)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET,POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()

})

roteador.get('/', async (requisicao, resposta)=>{
    const resultados = await TabelaFornecerdor.listar()
    resposta.status(200)
    const serializador =new SerializadorFornecedor(
        resposta.getHeader('Content-Type'),['empresa']
        )
    resposta.send(serializador.serializar(resultados))

})

roteador.post('/', async (requisicao, resposta, proximo)=>{
    try{
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar(fornecedor)
        resposta.status(201)
        const serializador =new SerializadorFornecedor(
            resposta.getHeader('Content-Type'), ['empresa']
            )
        resposta.send(serializador.serializar(fornecedor))
    }
    catch(erro){
        proximo(erro)
    }
})

roteador.options('/:idFornecedo',(requisicao, resposta, proximo)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET,PUT,DELETE')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()

})

roteador.get('/:idFornecedor', async (requisicao, resposta,proximo)=>{
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar(fornecedor)
        resposta.status(200)
        const serializador =new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            ['email', 'dataCriacao', 'dataAtualizacao', 'versao', 'empresa']
            )
        resposta.send(serializador.serializar(fornecedor))
    }
    catch(erro){
        proximo(erro)
    }
})

roteador.put('/:idFornecedor', async (requisicao, resposta, proximo)=>{
    try {
        const id = requisicao.params.idFornecedor
        const dadosRecebidos = requisicao.body
        const dados = Object.assign({}, dadosRecebidos, { id: id })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:idFornecedor', async (requisicao, resposta, proximo)=>{
    try {
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar()
        await fornecedor.remover()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

const roteadorProdutos =require('./produtos')

const verificarFornecedor = async (requisicao,resposta,proximo)=>{
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id})
        requisicao.fornecedor=fornecedor
        await fornecedor.carregar(fornecedor)
        proximo()
    }
    catch(erro){
        proximo(erro)
    }
}

roteador.use('/:idFornecedor/produtos',verificarFornecedor, roteadorProdutos)

module.exports = roteador