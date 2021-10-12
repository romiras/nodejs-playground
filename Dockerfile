# ---------------------------------------------------------------------------
# Image Build
# ---------------------------------------------------------------------------
FROM node:16.10 as dist

WORKDIR /tmp/

COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
RUN npm install

COPY src src/
RUN npm run build

# ---------------------------------------------------------------------------
# Image Creation
# ---------------------------------------------------------------------------
FROM node:16-alpine3.11

WORKDIR /app/
COPY --from=dist /tmp ./

CMD ["npm", "run", "start:dev"]
