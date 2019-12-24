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

app.post('/login', async(request,response)=>{
   const {email,password} = request.body
   const db = await dbConnection
   const result = await db.get(`select * from users where email ='${email}' and password='${password}';`)   


   //console.log(result.email)
  // console.log(email)
  
   if(result){
    console.log("encontrado")
   }else{
    console.log("Não encontrado")
   }

   //response.render(request.body)
}) 

app.get('/user/dashboard', (request,response)=>{
    response.render('user/dashboard')
})


app.get('/user/chamados/new', async(request,response)=>{
    response.render('user/novo')
})

app.post('/user/chamados/new', async(request,response)=>{
    const {email,description,status} = request.body
    const db = await dbConnection
    await db.run(`insert into called (email, description, status) values('${email}','${description}','${status}');`)
    response.render('user/novo')
})

app.post('/user/chamados/edit/:id', async(request,response)=>{
    const {email,description,status} = request.body
    const {id} = request.params 
    const db = await dbConnection
    await db.run(`update called set email ='${email}', description ='${description}' , status='${status}' where id = ${id};`)
    response.render('user/novo')
}) 

app.get('/user/chamados/edit/:id', async(request,response)=>{
    const db = await dbConnection
    const calledsDB = await db.get('select * from called where id ='+request.params.id)
    response.render('user/edit_chamados')
})

app.get('/user/chamados/delete/:id', async(request,response)=>{
    const db = await dbConnection
    await db.run('delete from called where id ='+request.params.id)
    //response.render('/delete') Apagado
})

app.get('/user/chamados', async(request,response)=>{   
    const db = await dbConnection
    const calleds = await db.all('select * from called;')
    response.render('user/chamados',{
        calleds
    })
})

app.get('/user/consulta', async(request,response)=>{

    response.render('user/consulta')
})

app.post('/user/consulta', async(request,response)=>{
    const {number} = request.body
    const db = await dbConnection
    const calleds = await db.get(`select * from called where id ='${number}';`)
    response.render('user/result_consulta',{
         calleds 
    })
})

*/Criando Router Admin /*

app.get('/admin', (request,response)=>{
    response.render('login')
})

app.get('/admin/dashboard', (request,response)=>{
    response.render('admin/dashboard')
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

 
app.get('/admin/userlist', async(request,response)=>{
    const db = await dbConnection
    const users = await db.all('select * from users;')
    response.render('admin/user_list',{
        users
    }) 
}) 

app.post('/admin/userlist/edit/:id', async(request,response)=>{
    const {name,email,password} = request.body
    const {id} = request.params 
    const db = await dbConnection
    await db.run(`update users set name ='${name}', email ='${email}' , password='${password}' where id = ${id};`)
   // response.render('user/novo')
}) 

app.get('/admin/userlist/edit/:id', async(request,response)=>{
    const db = await dbConnection
    const calledsDB = await db.get('select * from users where id ='+request.params.id)
    response.render('admin/user_edit')
})

app.get('/admin/userlist/delete/:id', async(request,response)=>{
    const db = await dbConnection
     await db.run('delete from users where id ='+request.params.id)
   // response.render('admin/delete')
})

app.get('/admin/consulta', async(request,response)=>{
    response.render('admin/consulta_usuario')
})

app.post('/admin/consulta', async(request,response)=>{
    const {name} = request.body
    const db = await dbConnection
    const users = await db.get(`select * from users where name ='${name}';`)
    response.render('admin/result_consulta',{
         users 
    })
})

app.get('/admin/chamados', async(request,response)=>{
    const db = await dbConnection
    const calleds = await db.all('select * from called;')
    response.render('admin/chamados',{
        calleds
    }) 
})

app.get('/admin/consulta/chamados', (request,response)=>{   
    response.render('admin/consulta_usuario')
})

app.post('/admin/consulta/chamados', async(request,response)=>{   
    const {number} = request.body
    const db = await dbConnection
    const calleds = await db.get(`select * from called where id ='${number}';`)
    response.render('admin/resul_consulta_chamados',{
        calleds
    })
})

app.get('/admin/chamados/new', async(request,response)=>{
    response.render('admin/novo')
})

app.post('/admin/chamados/new', async(request,response)=>{
    const {email,description,status} = request.body
    const db = await dbConnection
    await db.run(`insert into called (email, description, status) values('${email}','${description}','${status}');`)
    response.render('admin/novo')
})


const init = async() =>{
const db = await dbConnection
await db.run('create table if not exists users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT);')
await db.run('create table if not exists called (id INTEGER PRIMARY KEY, email TEXT, description TEXT, status text);')

//await db.run('drop table called;')
//await db.run('drop table users;')


}

init()

app.listen(3000,(err) =>{
    if(err){
        console.log('Servidor com erro ao iniciar',err)

    }else{
        console.log('Servidor rodando')
    }
})
