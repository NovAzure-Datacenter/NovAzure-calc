FROM node:22-slim

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

ARG MONGODB_URI=mongodb://localhost:27017/temp
ARG NEXTAUTH_SECRET=secret
ENV MONGODB_URI=$MONGODB_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]