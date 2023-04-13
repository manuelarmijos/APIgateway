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
            if (req.method == "POST" && req.body) {
                proxyReq.write(encodeURIComponent(JSON.stringify(req.body)));
                proxyReq.end();
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