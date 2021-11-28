# ---------------------------------------------------------------------------
# Image Build
# ---------------------------------------------------------------------------
# 1st Stage for installing dependencies (fail as fast as possible when having issues)
FROM node:16.10 AS build-deps
COPY package*.json tsconfig*.json /build/
WORKDIR /build
RUN npm ci

# 2nd Stage for compiling typescript
FROM node:16.10 AS compile-env
RUN mkdir /compile
COPY --from=build-deps /build /compile
WORKDIR /compile
# Copy a rest of stuff needed for building
COPY src src/
# put your npm script to compile typescript
RUN npm run build

# 3rd Stage for installing runtime dependencies
FROM node:16.10 AS runtime-deps
COPY package*.json tsconfig*.json /build/
WORKDIR /build
RUN npm ci --production

# ---------------------------------------------------------------------------
# Image Creation
# ---------------------------------------------------------------------------

FROM node:16.10-alpine AS runtime-env
WORKDIR /app
# copy compiled artifacts from compile-env
COPY --from=compile-env --chown=node:node /compile/dist /app
# copy production dependencies
COPY --from=runtime-deps --chown=node:node /build /app
# copy config/ folder if you are using node-config
# COPY --chown=node:node config /app/config

USER node
# EXPOSE 8000
CMD ["npm", "run", "start"]
