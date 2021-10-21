const Sequelize = require('sequelize')
const instancia = require('../../banco-de-dados')

const colunas = {
    empresa:{
        type: Sequelize.STRING,
        allowNull:false
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false  
    },
    categoria:{
        type: Sequelize.ENUM('ração', 'brinquedos'),
        allowNull:false,
        timestamps:true,
        createdAt:'dataCriacao',
        updateAt: 'dataAtualizacao',
        version: 'versao'
    },
}

const opcoes = {
    freezeTableName:true,
    tableName:'fornecedores'
}

module.exports = instancia.define('fornecedor', colunas, opcoes)