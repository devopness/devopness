FROM node:18-buster as builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

FROM node:18-buster

WORKDIR /api-docs

COPY --from=builder /app/docs/build/api-docs-output.yaml api-docs-output.yaml
COPY --from=builder /app/docs/template.hbs template.hbs
COPY --from=builder /app/docs/spec spec/

EXPOSE 9090
CMD npx redoc-cli serve api-docs-output.yaml --host 0.0.0.0 --port 9090 --title 'Devopness API Docs - Local' -t template.hbs
