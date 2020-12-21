FROM python:alpine

RUN pip install --quiet --upgrade pip flask requests
WORKDIR /usr/src/app
COPY app.py .
CMD ["python", "-u", "app.py"]
