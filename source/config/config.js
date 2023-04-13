require("dotenv").config();

exports.serverPort = 3010;
exports.sessionSecret = process.env.SESSION_SECRET;
exports.rate = {
    windowMs: 5 * 60 * 1000,
    max: 100,
};


exports.proxies = {
    "/solicitud": {
        protected: true,
        target: "127.0.0.1:3001",
        changeOrigin: false,
        // secure: false,
        pathRewrite: {
            [`^/solicitudes`]: "/solicitude",
        },
    },
    "/autenticacion": {
        protected: false,
        target: "http://127.0.0.1:3002/",
        changeOrigin: true,
        pathRewrite: {
            [`^/autenticacion`]: "/autenticar",
        },
        logLevel: 'debug',
        //logProvider:
        onError(err, req, res) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end('Something went wrong. And we are reporting a custom error message.' + err);
        },
        onProxyRes(proxyRes, req, res) {
            //proxyRes.headers['x-added'] = 'foobar';     // add new header to response
            //delete proxyRes.headers['x-removed'];       // remove header from response
        },
        onProxyReq(proxyReq, req, res) {
            console.log('si')
            if (req.body) {
                let bodyData = JSON.stringify(req.body);
                // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                // stream the content
                proxyReq.write(bodyData);
            }
        }
    },
    "/finalizar": {
        protected: true,
        target: "http://127.0.0.1:3003",
        changeOrigin: true,
        // secure: false,
        pathRewrite: {
            [`^/finalizar`]: "/finalizar",
        },
    },
};