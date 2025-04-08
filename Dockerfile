FROM python:3.10
ENV PYTHONUNBUFFERED 1
WORKDIR /app

COPY requirements.txt /app/

RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

COPY . /app