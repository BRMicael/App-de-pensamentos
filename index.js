const express = require('express')
const exphbs = require('express-handlebars');
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')


//Models
const Tought = require('./models/Tought')
const User = require('./models/User')

//routes
const toughtsRoutes = require('./routes/toughtsRoutes')

//controller
const ToughtController = require('./controllers/ToughtsController')


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


// Ler body
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

// session middleware
app.use(
    session({
        name: 'session',
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () {},
            path: require('path').join(require('os').tmpdir(), 'session')
        })
    })
)

// flash messages
app.use(flash())

// public path
app.use(express.static('public'))

// set session to res
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

//Routes
app.use('/toughts', toughtsRoutes)
app.get('/', ToughtController.showToughts)

conn
.sync()
//.sync({force: true})
.then(() => {
    app.listen(3000)
})
.catch(err => console.log(err))
