const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const { formatosAceitos, SerializadorErro } = require('./Serializador')
const app = express()


app.use(bodyParser.json())
app.use((requisicao, resposta, proximo)=>{
    let formatoRequisitado = requisicao.header('Accept')

    if(formatoRequisitado==='*/*'){
        formatoRequisitado='application/json'
    }

    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        resposta.status(406)
        resposta.end()
        return
    }

    resposta.setHeader('Content-Type', formatoRequisitado)
    proximo()
})
app.use('/api/fornecedores', roteador)
app.use((erro,requisicao, resposta, proximo)=>{
    resposta.status(500)
    if(erro instanceof NaoEncontrado){
        resposta.status(404)
    }
    if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos){
        resposta.status(400)
    }
    if(erro instanceof ValorNaoSuportado){
        resposta.status(406)
    }
    const serializador = new SerializadorErro(
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})
app.listen(config.get('api.porta'), ()=>console.log('API RODANDO!'))