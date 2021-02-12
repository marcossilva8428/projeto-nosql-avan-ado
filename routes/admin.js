const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")


router.get('/',(req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de posts")
})

router.get("/categorias", (req,res) => {
    Categoria.find().sort({date:'desc'}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as as intituições")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res) => {
    
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null ){
        erros.push({texto: "Endereço inválido"})
    }

    if(req.body.nome.length < 2) {
        erros.push({texto: "Nome da da instituição muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
         const novaCategoria = {
            nome: req.body.nome,
            endereco: req.body.endereco
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Instituição criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a intituição, tente novamente!")
            res.redirect("/admin")
        })
    }
})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta intituição não existe")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", (req,res) => {
    
    Categoria.findOne({_id: req.body.id}).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.endereco = req.body.endereco
        
        categoria.save().then(() => {
            req.flash("success_msg", "Instituição editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a edição da instituição")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a instituição")
        res.redirect("/admin/categorias")
    })
})

router.post('/categorias/deletar/:id', (req,res) => {
    Categoria.findOneAndDelete({_id: req.params.id}).then(()=> {
        req.flash('success_msg','Instituição deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg','Houve um erro ao deletar a instituição')
        res.redirect('/admin/categorias')
    })
})

module.exports = router