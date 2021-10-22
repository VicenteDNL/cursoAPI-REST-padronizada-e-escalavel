const Modelo = require('./ModeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

module.exports = {
    listar(){
       return Modelo.findAll({raw:true})
    },
    inserir(forncecedor){
        return Modelo.create(forncecedor)
    },
    async pegarPorId(id){
        const encontrado = await Modelo.findOne({
            where:{id:id}
        })

        if (!encontrado){
            throw new NaoEncontrado('Fornecedor')
        }

        return encontrado
    },
    atualizar(id,dadosParaAtualizar){
        return Modelo.update(dadosParaAtualizar,
            {
                where:{id:id}
            }) 
    },
    remover (id){
        return Modelo.destroy(
            {
                where:{id:id}
            })
    }
}