const roteador = require('express').Router({mergeParams:true})
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializador =require('../../../Serializador').SerializadorProduto


roteador.options('/',(requisicao, resposta, proximo)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET,POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()

})

roteador.get('/', async (requisicao, resposta)=>{
    const produtos = await Tabela.listar(requisicao.fornecedor.id)
    const serializador = new Serializador(resposta.getHeader('Content-Type'))
    resposta.send(serializador.serializar(produtos))
})

roteador.post('/', async (requisicao, resposta, proximo)=>{
    try{
        const corpo = requisicao.body
        const idFornecedor = requisicao.fornecedor.id
        const dados = Object.assign({},corpo,{fornecedor:idFornecedor})
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new Serializador(
            resposta.getHeader('Content-Type'),
            )
        resposta.set('ETag',produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified',timestamp)
        resposta.set('Location',`/api/forncedores/${produto.fornecedor}/produto/${produto.id}`)
        resposta.status(201).send(serializador.serializar(produto))
    }
    catch(erro){
        proximo(erro)
    }

})

roteador.options('/:id',(requisicao, resposta, proximo)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET,PUT,DELETE,HEAD')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()

})

roteador.delete('/:id', async (requisicao, resposta)=>{
    const dados = {
        id:requisicao.params.id,
        fornecedor:requisicao.fornecedor.id
    }

    const produto = new Produto(dados)
    await produto.apagar()
    resposta.status(204).end()
})

roteador.get('/:id', async (requisicao, resposta,proximo)=>{
    try{
        const dados = {
            id:requisicao.params.id,
            fornecedor:requisicao.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new Serializador(
            resposta.getHeader('Content-Type'),
            ['preco','estoque', 'dataCriacao', 'dataAtualizacao','versao', 'fornecedor'])
        
        resposta.set('ETag',produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified',timestamp)        
        resposta.status(200).send(serializador.serializar(produto))
    }
    catch(erro){
        proximo(erro)
    }

})

roteador.head('/:id', async (requisicao, resposta,proximo)=>{
    try{
        const dados = {
            id:requisicao.params.id,
            fornecedor:requisicao.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()        
        resposta.set('ETag',produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified',timestamp)        
        resposta.status(200).end()
    }
    catch(erro){
        proximo(erro)
    } 
})

roteador.put('/:id', async (requisicao, resposta,proximo)=>{
    try{
        const info = {
            id:requisicao.params.id,
            fornecedor:requisicao.fornecedor.id
        }
        const corpo = requisicao.body

        const dados = Object.assign({},info,corpo)
    
        const produto = new Produto(dados)
        await produto.atualiza()
        await produto.carregar()
        resposta.set('ETag',produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified',timestamp)
        
        resposta.status(204).end()
    }
    catch(erro){
        proximo(erro)
    }

})
roteador.options('/:id/diminuir-estoque',(requisicao, resposta, proximo)=>{
    resposta.set('Access-Control-Allow-Methods', 'POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()

})

roteador.post('/:id/diminuir-estoque', async (requisicao, resposta,proximo)=>{
    try{
        const info = {
            id:requisicao.params.id,
            fornecedor:requisicao.fornecedor.id
        }
    
        const produto = new Produto(info)
        await produto.carregar()
        produto.estoque =  produto.estoque- requisicao.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar()
        resposta.set('ETag',produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified',timestamp)
        
        resposta.status(204).end()
    }
    catch(erro){
        proximo(erro)
    }

})



const roteadorReclamacoes =require('./reclamacoes')
roteador.use('/:idProduto/reclamacoes',roteadorReclamacoes)

module.exports =roteador