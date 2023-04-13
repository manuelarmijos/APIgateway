require("dotenv").config();

exports.serverPort = 3000;
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
    "/autenticar": {
        protected: true,
        target: "http://169.62.217.189:3002",
        changeOrigin: true,
        headers: {
            accept: "application/json",
            method: "POST",
        },
        // secure: false,
        pathRewrite: {
            [`^/autenticar`]: "/autenticar",
        },
        on: {
            proxyReq: (proxyReq, req, res) => {
                console.log(proxyRes)
                console.log(req)
                console.log(res)
                /* handle proxyReq */
            },
            proxyRes: (proxyRes, req, res) => {
                console.log(proxyRes)
                console.log(req)
                console.log(res)
                /* handle proxyRes */
            },
            error: (err, req, res) => {
                console.log(err)
                console.log(req)
                console.log(res)
            },
        },
        xfwd: true,
        onProxyReq: proxyReq => {
            if (proxyReq.getHeader('origin')) proxyReq.setHeader('origin', '127.0.0.1:3000')
        },
        logLevel: "debug",
        //logProvider: function () { return require('debug')('api-gateway:proxyLog') }
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