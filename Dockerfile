FROM node:20 AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY prisma ./prisma

RUN pnpm prisma generate

COPY . .

RUN pnpm build

RUN pnpm install --prod 
RUN pnpm store prune 

FROM node:20-alpine3.21

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

RUN npm install -g pnpm

EXPOSE 3333

CMD ["sh", "-c", "pnpm install --prod && pnpm run db:deploy && node dist/src/main"]
