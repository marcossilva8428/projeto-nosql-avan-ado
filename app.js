// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require("body-parser")
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const { Mongoose } = require('mongoose')
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")

    // Configurações
        // Sessão
            app.use(session({
                secret:"instituicoes",
                resave: true,
                saveUninitialized: true
            }))
            app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    // Mongoose
    mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
        console.log("Conectado com sucesso!")
    }).catch((err) =>{
        mongoose.Promise = global.Promise;
        console.log("Erro ao conectar: " + err)
    })
    // Public
        app.use(express.static(path.join(__dirname,"public")))
    //
// Rotas
    app.get('/', (req,res) => {
        res.send('Rota principal')
    })
    app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT,() =>{
    console.log("Servidor rodando!")
})