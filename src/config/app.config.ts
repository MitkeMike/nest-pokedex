
export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB || 'mongodb://localhost:27017/nest',
    port: process.env.PORT || 3002,
    defalult_limit: +process.env.DEFAULT_LIMIT || 10,
})