require("dotenv").config();

exports.serverPort = 3010;
exports.sessionSecret = process.env.SESSION_SECRET;
exports.rate = {
    windowMs: 5 * 60 * 1000,
    max: 100,
};


exports.proxies = {
    "/solicitud": {
        protected: false,
        target: "http://169.62.217.189:3003/",
        changeOrigin: false,
        pathRewrite: {
            [`^/solicitud`]: "/solicitud",
        },
        logLevel: 'debug',
        onError(err, req, res) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end('Ocurrio un error en el API de solicitud, por favor inténtelo más tarde.' + err);
        },
        onProxyReq(proxyReq, req, res) {
            console.log('Enviado cabeceras al microservicio de solicitudes')
            if (req.body) {
                let bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        }
    },
    "/autenticacion": {
        protected: false,
        target: "http://127.0.0.1:3002/",
        changeOrigin: true,
        pathRewrite: {
            [`^/autenticacion`]: "/autenticar",
        },
        logLevel: 'debug',
        onError(err, req, res) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end('Ocurrio un error en el API de autenticación, por favor inténtelo más tarde.' + err);
        },
        onProxyReq(proxyReq, req, res) {
            console.log('Enviado cabeceras al microservicio de autenticar')
            if (req.body) {
                let bodyData = JSON.stringify(req.body);
                +                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        }
    },
    "/finalizar": {
        protected: false,
        target: "http://64.226.112.105:3003/",
        changeOrigin: true,
        pathRewrite: {
            [`^/finalizar`]: "/finalizar",
        },
        logLevel: 'debug',
        onError(err, req, res) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end('Ocurrio un error en el API de finalizar, por favor inténtelo más tarde.' + err);
        },
        onProxyReq(proxyReq, req, res) {
            console.log('Enviado cabeceras al microservicio de finalizar')
            if (req.body) {
                let bodyData = JSON.stringify(req.body);
                +                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        }
    },
};