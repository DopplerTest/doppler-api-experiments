#  Experimenting with consuming the Doppler v3 API directly to populate app secrets

Uses Docker with examples for Python and Node that also test the use of multiline secrets. 

## Set up

Clone this directory locally and change into the directory on the terminal.

Create Doppler project:

```sh
doppler projects create doppler-api-test
```

Upload secrets:

```sh
doppler secrets upload --project doppler-api-test --config dev secrets.json
```

Now go to the Doppler Dashboard and create a Service Token for the `doppler-api-test` project and `dev` config.

Then expose the Service Token via the `DOPPLER_TOKEN` environment variable:

```sh
export DOPPLER_TOKEN=dp.st.dev.XXX
```

## Python

Take a look at the code in `app.py` which download the secrets in JSON format and populates the `os.environ` dictionary.

To test:

1. Change into the `python` directory
2. Build the Docker image:
```sh
docker build -t doppler-api-python -f Dockerfile .
````
3. Run the container:
```sh
docker run --rm --init \
    --name doppler-api-python \
    -p $(doppler secrets get PORT --plain):$(doppler secrets get PORT --plain) \
    -e DOPPLER_TOKEN="$DOPPLER_TOKEN" \
    doppler-api-python
```
4. Open a browser at https://localhost:8443 and you should see the `DOPPLER_` environment variables returned in the response.

## Node

The Node example is different to the Python example in order to show both async and sync methods of fetching secrets.

To test:

1. Change into the `node` directory
2. Build the Docker image:
```sh
docker build -t doppler-api-node -f Dockerfile .
```
3. Run the container using the default sync loading method:
```sh
docker run --rm --init \
    --name doppler-api-node \
    -p $(doppler secrets get PORT --plain):$(doppler secrets get PORT --plain) \
    -e DOPPLER_TOKEN="$DOPPLER_TOKEN" \
    doppler-api-node
```
4. Open a browser at https://localhost:8443 and you should see the `DOPPLER_` environment variables returned in the response.

To run the container using the async method, run:

```sh
docker run --rm --init \
    --name doppler-api-node \
    -p $(doppler secrets get PORT --plain):$(doppler secrets get PORT --plain) \
    -e DOPPLER_TOKEN="$DOPPLER_TOKEN" \
    doppler-api-node node app.js load-config-async
```

## Cleaning up

To remove all resources created:

```sh
unset DOPPLER_TOKEN
doppler projects delete -y doppler-api-test
docker image rm doppler-api-python
docker image rm doppler-api-node
```