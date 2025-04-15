FROM ubuntu:latest
RUN apt update && apt install -y texlive texlive-latex-extra texlive-xetex lmodern nodejs npm
WORKDIR /app
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "run", "dev"]