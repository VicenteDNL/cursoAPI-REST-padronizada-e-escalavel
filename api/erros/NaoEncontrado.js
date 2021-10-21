class NaoEncontrado extends Error{
    constructor(){
        super('Fornecedor não Encontrado')
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}
module.exports = NaoEncontrado