ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.20

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM ${BUILD_FROM}

RUN apk add --no-cache bash nginx

COPY addons/navet/run.sh /run.sh
COPY addons/navet/rootfs/ /
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod a+x /run.sh

EXPOSE 8099

CMD [ "/run.sh" ]
