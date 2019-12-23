const express = require('express')

const app = express()
const bodyParser = require('body-parser')

const sqlite = require('sqlite')
const dbConnection = sqlite.open('Banco.sqlite', {Promise})

app.set('view engine','ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

*/ Criando Router Princial/*

app.get('/', (request,response)=>{
    response.render('home')
})

app.get('/login', (request,response)=>{
    response.render('login')
})

app.post('/login', (request,response)=>{
    response.render('')
})

app.get('/user/chamados', (request,response)=>{
    response.render('user/chamados')
})

app.get('/user/consulta', (request,response)=>{
    response.render('user/consulta')
})

app.post('/user/consulta', (request,response)=>{
    response.render('')
})


app.get('/user/chamados/novo', (request,response)=>{
    response.render('user/novo')
})


*/Criando Router Admin /*

app.get('/admin', (request,response)=>{
    response.render('login')
})


app.get('/admin/userlist', async(request,response)=>{
    const db = await dbConnection
    const users = await db.all('select * from users;')
    response.render('admin/user_list',{
        users
    }) 
}) 


app.get('/admin/new', (request,response)=>{
    response.render('admin/user_registration')
})


app.post('/admin/new', async(request,response)=>{
   const {name,email,password} = request.body
   const db = await dbConnection
   await db.run(`insert into users (name, email, password) values('${name}','${email}','${password}');`)
   response.render('admin/user_registration')
})

const init = async() =>{
const db = await dbConnection
await db.run('create table if not exists users (id INTERGER PRIMARY KEY, name Text, email TEXT, password TEXT);')
await db.run('create table if not exists called (id INTEGER PRIMARY KEY, email TEXT, DESCRICAO TEXT, telephone TEXT); ')

}

init()

app.listen(3000,(err) =>{
    if(err){
        console.log('Servidor com erro ao iniciar',err)

    }else{
        console.log('Servidor rodando')
    }
})
