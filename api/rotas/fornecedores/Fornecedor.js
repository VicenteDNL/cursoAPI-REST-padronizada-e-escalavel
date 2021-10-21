
const CampoInvalido = require('../../erros/CampoInvalido')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')
const TabelaFornecerdor = require('./TabelaFornecedor')

class Fornecedor {

    constructor({id, empresa, email, categoria, 
        dataCriacao, dataAtualizacao, versao}){

            this.id = id 
            this.empresa = empresa 
            this.email = email 
            this.categoria = categoria 
            this.dataCriacao = dataCriacao 
            this.dataAtualizacao = dataAtualizacao 
            this.versao = versao
    }

    async criar(){
        this.validar()
        const resultado = await TabelaFornecerdor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })

        this.id = resultado.id 
        this.dataCriacao = resultado.createdAt 
        this.dataAtualizacao = resultado.updateAt 
        this.versao = resultado.versao

    }

    async carregar(){
        const resultado = await TabelaFornecerdor.pegarPorId(this.id)

        this.id = resultado.id 
        this.empresa = resultado.empresa 
        this.email = resultado.email 
        this.categoria = resultado.categoria 
        this.dataCriacao = resultado.createdAt 
        this.dataAtualizacao = resultado.updateAt  
        this.versao = resultado.versao

    }

    async atualizar(){
        await TabelaFornecerdor.pegarPorId(this.id)
        const campos = ['empresa','email', 'categoria']
        const dadosParaAtualizar = {}

        campos.forEach(campo=>{
            const valor = this[campo]

            if(typeof valor === 'string' && valor.length>0){
                dadosParaAtualizar[campo] = valor
            }
        })

        if(Object.keys(dadosParaAtualizar).length===0){
            throw new DadosNaoFornecidos()
        }

        await TabelaFornecerdor.atualizar(this.id, dadosParaAtualizar)

    }

    remover (){
        return TabelaFornecerdor.remover(this.id)
    }

    validar(){
        const campos = ['empresa','email','categoria']

        campos.forEach(campo=>{
            const valor = this[campo]

            if(typeof valor !=='string' || valor.length==0){
                throw new CampoInvalido(campo)
            }
        })
    }
}

module.exports = Fornecedor