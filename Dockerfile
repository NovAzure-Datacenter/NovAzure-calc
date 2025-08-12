FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

ARG MONGODB_URI=mongodb://localhost:27017/temp
ARG NEXTAUTH_SECRET=secret
ENV MONGODB_URI=$MONGODB_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm ci --only=production --silent && \
    npm cache clean --force && \
    rm -rf /tmp/*

EXPOSE 3000

CMD ["npm", "start"]
