const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

const urldb = `mongodb+srv://nic0libatista:123senac@projetoestudo.bwtlj.mongodb.net/projetoestudo?retryWrites=true&w=majority&appName=projetoestudo`;
mongoose.connect(urldb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));

const schema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    cpf: { type: String, unique: true, required: true },
    telefone: { type: String },
    idade: { type: Number, min: 16, max: 120 },
    usuario: { type: String, unique: true },
    senha: { type: String },
    datacadastro: { type: Date, default: Date.now } // Corrigido "dafault" para "default"
});

const Cliente = mongoose.model('Cliente', schema); // Nome do modelo corrigido

app.get("/", (req, res) => {
    Cliente.find().then((result) => {
        res.status(200).send({output:"ok", payload: result});
    }).catch((erro) => {
        res.status(500).send({output: `Erro ao processar dados -> ${erro}`});
    });
});



app.post("/cadastro", (req, res) => {
    const dados = new Cliente(req.body); // Corrigido "req,body" para "req.body"
    dados.save()
        .then((result) => {
            res.status(201).send({ output: "Cadastro realizado", payload: result }); // Corrigido "statusMessage" para "status"
        })
        .catch((erro) => {
            res.status(500).send({ output: `Erro ao cadastrar -> ${erro}` });
        });
});


app.put("/update/:id", (req, res) => {
    Cliente.findByIdAndUpdate(req.params.id, req.body, {new:true}).then((result) => {
        if(!result){
            return res.status(400).send({output: "Não foi possível atualizar"});
        }
        res.status(202).send({output: "Atualizado", payload: result});
    })
    .catch((erro) => {
        res.status(500).send({output: `Erro ao processar a solicitação -> ${erro}`});
    });
});


app.delete("/delete/:id", (req, res) => {
    Cliente.findByIdAndDelete(req.params.id).then((result) => {
        res.status(204).send({payload:result});
    }).catch((erro)=>console.log(`erro ao tentar apagar -> ${erro}`));
});

app.use((req, res) => {
    res.type("application/json");
    res.status(404).send("404 - Not Found");
});

app.listen(3000, () =>
    console.log(`Servidor on-line em http://localhost:3000`)
);
