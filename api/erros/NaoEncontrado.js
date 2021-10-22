class NaoEncontrado extends Error{
    constructor(nome){
        super(`'${nome} não Encontrado'`)
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}
module.exports = NaoEncontrado