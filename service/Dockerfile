FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

ENV MONGODB_URI=mongodb+srv://imalka:imalka@e-grocery.lpdsalu.mongodb.net/?retryWrites=true&w=majority&appName=bank

ENV JWT_SECRET=dwaghdwgh
ENV PORT=3000

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
