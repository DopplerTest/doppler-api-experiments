# Example using the Doppler API directly to configure an app with multiline secrets

from os import environ as env
from flask import Flask, jsonify
import requests


def load_config():
    env_vars = requests.get(
        'https://api.doppler.com/v3/configs/config/secrets/download?format=json',
        headers={
            'Content-Type': 'application/json',
            'api-key': env['DOPPLER_TOKEN']
        }
    ).json()
    for key, value in env_vars.items():
        env[key] = value

    open('cert.pem', 'w').write(env['CERT'])
    open('key.pem', 'w').write(env['KEY'])


app = Flask(__name__)
load_config()


@app.route('/')
def index():
    return jsonify(
        {
            'DOPPLER_PROJECT': env['DOPPLER_PROJECT'],
            'DOPPLER_ENVIRONMENT': env['DOPPLER_ENVIRONMENT'],
            'DOPPLER_CONFIG': env['DOPPLER_CONFIG'],
        }
    )


app.run(host='0.0.0.0', port=env['PORT'], ssl_context=('cert.pem', 'key.pem'))
