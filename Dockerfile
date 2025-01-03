FROM node:16.20.2 as dependencies
WORKDIR /app
COPY package*.json  ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3399
CMD ["npm", "start"]
