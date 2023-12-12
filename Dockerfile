FROM mcr.microsoft.com/playwright:v1.39.0-jammy

ARG BASE_URL
ARG API_URL
ARG HTTP_CREDENTIALS_USERNAME
ARG HTTP_CREDENTIALS_PASSWORD

ENV BASE_URL=${BASE_URL}
ENV API_URL=${API_URL}
ENV HTTP_CREDENTIALS_USERNAME=${HTTP_CREDENTIALS_USERNAME}
ENV HTTP_CREDENTIALS_PASSWORD=${HTTP_CREDENTIALS_PASSWORD}

COPY . /aqa-playwright
WORKDIR /aqa-playwright

RUN npm ci

CMD ["npm", "test"]