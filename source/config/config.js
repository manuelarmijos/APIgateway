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
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
        // secure: false,
        pathRewrite: {
            [`^/solicitudes`]: "/solicitude",
        },
    },
    "/autenticar": {
        protected: true,
        target: "http://127.0.0.1:3002",
        changeOrigin: true,
        // secure: false,
        pathRewrite: {
            [`^/autenticar`]: "/autenticar",
        },
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