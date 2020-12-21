// Example using the Doppler API directly to configure an app with multiline secrets in both sync and async styles

// Usage sync (default): node app.js
// Usage async: node app.js load-config-async

const setConfig = config => {
    for (let [key, value] of Object.entries(config)) {
        process.env[key] = value
    }
}

const runServer = () => {
    const options = {
        cert: process.env['CERT'],
        key: process.env['KEY'],
    }

    require('https')
        .createServer(options, function (req, res) {
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(200)
            res.end(
                JSON.stringify(
                    {
                        DOPPLER_PROJECT: process.env['DOPPLER_PROJECT'],
                        DOPPLER_ENVIRONMENT: process.env['DOPPLER_ENVIRONMENT'],
                        DOPPLER_CONFIG: process.env['DOPPLER_CONFIG'],
                    },
                    {},
                    2
                )
            )
        })
        .listen(process.env['PORT'], process.env['HOST'], () => {
            console.log(`HTTPS server at https://${process.env.HOST}:${process.env.PORT}/ (Press CTRL+C to quit)`)
        })
}

if (process.argv[2] === 'load-config-async') {
    ;(async () => {
        console.log('[info] Loading config via Doppler API asynchronously')
        const config = await require('./config').load_config()
        setConfig(config)
        runServer()
    })()
} else {
    console.log('[info] Loading config via Doppler API synchronously')
    const config = JSON.parse(require('child_process').execSync('node config.js'))
    setConfig(config)
    runServer()
}
