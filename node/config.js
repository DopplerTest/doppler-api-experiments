
const axios = require('axios');

module.exports.load_config = async () => {
    const response = await axios.get('https://api.doppler.com/v3/configs/config/secrets/download?format=json', {
        headers: {
            'Content-Type': 'application/json',
            'api-key': process.env['DOPPLER_TOKEN'],
        },
    })
    return response.data
}

if(require.main === module) {
    ;(async () => {
        const data = await this.load_config()
        process.stdout.write(JSON.stringify(data))
    })()    
}
