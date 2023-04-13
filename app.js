const express = require('express')
const app = express()
const config = require("./source/config/config.js");
const port = config.serverPort;
const bodyParser = require('body-parser');
// require("dotenv").config();
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const winston = require("winston");
const expressWinston = require("express-winston");
const responseTime = require("response-time");
const secret = config.sessionSecret;
const store = new session.MemoryStore();
const cors = require("cors");
const helmet = require("helmet");
const { createProxyMiddleware } = require("http-proxy-middleware");

app.set("trust proxy", 1);
app.use(
  session({
    name: 'test', // Personaliza el nombre para 'test' 
    secret,
    saveUninitialized: true,
    resave: false,
    cookie: { // cookies manage
      path: '/',
      maxAge: 6000000,
      httpOnly: false,
      secure: false,
      sameSite: false
    },
  })
);

//app.use(cors());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))

app.use(helmet());

app.use(responseTime());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
    statusLevels: true,
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
      return false;
    },
  })
);

const alwaysAllow = (_1, _2, next) => {
  console.log('permitir acceso a todos')
  next();
};

const protect = (req, res, next) => {
  console.log('Dentro de protect')
  console.log(req.session)
  const { authenticated } = req.session;
  if (!authenticated) {
    res.sendStatus(401);
  } else {
    next();
  }
};

app.use(
  rateLimit(config.rate)
);

//Cofiguraciones de servidor
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: false, parameterLimit: 50 }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// catch 404 and forward to error handler


//Rutas
// let solicitud = require('./source/router/solicitud/solicitud.js');
//var gamificacion = require('./source/gamificacion/gamificacion.js');

app.get('/', (req, res) => {
  res.send('Hola bienvenido al API gateway de solicitar taxi !') //
})

// app.use('/s/solicitud/', solicitud);


app.get("/login", (req, res, next) => {

  if (!req.session.authenticated) {
    req.session.authenticated = 1;
    console.log(req.session)
    req.session.save(() => {
      console.log(req.session);

      res.send({
        en: 1,
        m: 'Autenticado con éxito'
      });
    });
    //res.cookie('cookieName', 'cookieValue', { sameSite: 'none', secure: false })


  } else {
    res.send({
      en: 2,
      m: 'Usuario ya autenticado con éxito'
    });
  }
});

app.get("/logout", protect, (req, res) => {
  req.session.destroy(() => {
    res.send("Successfully logged out");
  });
});

app.get("/protected", protect, (req, res) => {
  const { name = "user" } = req.query;
  res.send(`Hello ${name}!`);
})

Object.keys(config.proxies).forEach((path) => {
  const { protected, ...options } = config.proxies[path];
  const check = protected ? protect : alwaysAllow;
  console.log('ruta')
  console.log(path)
  console.log('check')
  console.log(check)
  app.use(path, check, createProxyMiddleware(options));
});

const server = app.listen(port, (err) => {
  if (err) throw new Error(err);
  console.log(`SERVIDOR CORRIENDO PUERTO: ${port}`);
});


// app.use(
//     "/search",
//     createProxyMiddleware({
//         target: "http://api.duckduckgo.com/",
//         changeOrigin: true,
//         pathRewrite: {
//             [`^/search`]: "",
//         },
//     })
// );

module.exports = { app, server };
