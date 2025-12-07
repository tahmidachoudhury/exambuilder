# Use Node as the base image (Debian-based so apt works)
FROM node:20-bullseye

# Install LaTeX and required packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      texlive \
      texlive-latex-extra \
      texlive-xetex \
      lmodern && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies for production
RUN npm install --omit=dev

# Now copy the rest of the application code
COPY . .

# Expose the port your app listens on
EXPOSE 3002

# Optional: explicit production env
ENV NODE_ENV=production

# Start the app (whatever "npm start" does in your package.json)
CMD ["npm", "start"]
