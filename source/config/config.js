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
    "/autenticar": {
        protected: false,
        target: "http://127.0.0.1:3002/",
        changeOrigin: true,
        headers: {
            accept: "application/json",
            method: "POST",
        },
        // secure: false,
        pathRewrite: {
            [`^/autenticar`]: "",
        },
        on: {
            proxyReq: (proxyReq, req, res) => {
                console.log('proxy rest 1')
                console.log(proxyRes)
                console.log(req)
                console.log(res)
                /* handle proxyReq */
            },
            proxyRes: (proxyRes, req, res) => {
                console.log('proxy rest')
                console.log(proxyRes)
                console.log(req)
                console.log(res)
                /* handle proxyRes */
            },
            error: (err, req, res) => {
                console.log('error')
                console.log(err)
                console.log(req)
                console.log(res)
            },
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