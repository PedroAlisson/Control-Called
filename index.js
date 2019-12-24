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


app.get('/user/called/new', async(request,response)=>{
    response.render('user/called_new')
})

app.post('/user/called/new', async(request,response)=>{
    const {email,description,status} = request.body
    const db = await dbConnection
    await db.run(`insert into called (email, description, status) values('${email}','${description}','${status}');`)
    response.render('user/called_new')
})

app.post('/user/called/edit/:id', async(request,response)=>{
    const {email,description,status} = request.body
    const {id} = request.params 
    const db = await dbConnection
    await db.run(`update called set email ='${email}', description ='${description}' , status='${status}' where id = ${id};`)
    response.render('user/called_new')
}) 

app.get('/user/called/edit/:id', async(request,response)=>{
    const db = await dbConnection
    const calledsDB = await db.get('select * from called where id ='+request.params.id)
    response.render('user/edit_called')
})

app.get('/user/called/delete/:id', async(request,response)=>{
    const db = await dbConnection
    await db.run('delete from called where id ='+request.params.id)
    //response.render('/delete') Apagado
})

app.get('/user/called', async(request,response)=>{   
    const db = await dbConnection
    const calleds = await db.all('select * from called;')
    response.render('user/called',{
        calleds
    })
})

app.get('/user/query', async(request,response)=>{
    response.render('user/query')
})

app.post('/user/query', async(request,response)=>{
    const {number} = request.body
    const db = await dbConnection
    const calleds = await db.get(`select * from called where id ='${number}';`)
    response.render('user/result_query',{
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
    const {name,empresa,email,password,status,type} = request.body
    const db = await dbConnection
    await db.run(`insert into users (name, empresa , email, password, status, type) values('${name}', '${empresa}','${email}','${password}', '${status}', '${type}');`)
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
    const {name,empresa,email,password,status,type} = request.body
    const {id} = request.params 
    const db = await dbConnection
    await db.run(`update users set name ='${name}', empresa ='${empresa}', email ='${email}' , status ='${status}', password ='${password}', type ='${type}' where id = ${id};`)
   // response.render('user/registration_called')
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

app.get('/admin/query', async(request,response)=>{
    response.render('admin/query_usuario')
})

app.post('/admin/query', async(request,response)=>{
    const {name} = request.body
    const db = await dbConnection
    const users = await db.get(`select * from users where name ='${name}';`)
    response.render('admin/result_query_usuario',{
         users 
    })
})

app.get('/admin/called', async(request,response)=>{
    const db = await dbConnection
    const calleds = await db.all('select * from called;')
    response.render('admin/called',{
        calleds
    }) 
})

app.get('/admin/query/called', (request,response)=>{   
    response.render('admin/query_called')
})

app.post('/admin/query/called', async(request,response)=>{   
    const {number} = request.body
    const db = await dbConnection
    const calleds = await db.get(`select * from called where id ='${number}';`)
    response.render('admin/result_query_called',{
        calleds
    })
})

app.get('/admin/called/new', async(request,response)=>{
    response.render('admin/registration_called')
})

app.post('/admin/called/new', async(request,response)=>{
    const {email,description,status} = request.body
    const db = await dbConnection
    await db.run(`insert into called (email, description, status) values('${email}','${description}','${status}');`)
    response.render('admin/registration_called')
})


const init = async() =>{
const db = await dbConnection
await db.run('create table if not exists users (id INTEGER PRIMARY KEY, name text, email TEXT, password TEXT, status boolean, empresa text, type text);')
await db.run('create table if not exists called (id INTEGER PRIMARY KEY, users_id INTEGER, email text, description TEXT, status text);')

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
