# Use the official Deno Docker image
FROM denoland/deno:alpine-2.4

# Set the working directory
WORKDIR /app

# Copy the project files
COPY . .

RUN deno task build

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD ["deno", "run", "-A", "main.ts"]