FROM node:22-alpine AS build
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN env OPENID_DISCOVERY_URL=. OPENID_SECRET=. OPENID_APPID=. OPENID_REDIRECT_URL=. OPENID_JWKS=. GITLAB_BASE_URL=. COOKIE_SECRET=.  npm run build

FROM node:22-alpine AS pre_run
WORKDIR /srv
COPY package*.json /srv/
RUN npm ci --omit dev --no-fund --no-audit
COPY --from=build /build/build/ /srv/

FROM node:22-alpine
WORKDIR /srv
COPY --from=pre_run /srv /srv
CMD ["node", "."]
