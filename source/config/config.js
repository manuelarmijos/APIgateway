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