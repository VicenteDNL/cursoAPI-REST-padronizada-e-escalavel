const Modelo = require('./ModeloTabelaReclamacao')

module.exports = {
    listar(idProduto){
        return Modelo.findAll({
            raw:true, 
            where: {
                produto:idProduto
            }
        })
     },
}