FROM node:20-bookworm AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

FROM node:20-bookworm

WORKDIR /api-docs

COPY --from=builder /app/docs/build/api-docs-output.yaml api-docs-output.yaml
COPY --from=builder /app/docs/template.hbs template.hbs
COPY --from=builder /app/docs/spec spec/

EXPOSE 9090
CMD npx redoc-cli serve api-docs-output.yaml --host 0.0.0.0 --port 9090 --title 'Devopness API Docs - Local' -t template.hbs
