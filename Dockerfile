FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY prisma ./prisma

RUN pnpm prisma generate

COPY . .

RUN pnpm build

RUN pnpm install --prod && pnpm store prune && pnpm install prisma

FROM node:20-alpine3.21

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

RUN npm install -g pnpm

EXPOSE 3333

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/src/main"]
