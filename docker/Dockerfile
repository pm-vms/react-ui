FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# ✅ Copy everything else (source code, config files, etc.)
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
