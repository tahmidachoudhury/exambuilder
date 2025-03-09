FROM ubuntu:latest
RUN apt update && apt install -y texlive texlive-latex-extra texlive-xetex lmodern nodejs npm
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]