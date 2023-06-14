# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
FROM node:latest as build
# Set the working directory

WORKDIR /usr/local/app
# Add the source code to app
COPY ./ /usr/local/app/
# Install all the dependencies
RUN npm install
# Install firebase dependency
RUN npm install firebase@9.9.2
# Generate the build of the application
RUN npm run build --prod

EXPOSE 80/tcp
# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM nginx:latest
# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/auto-pwa /usr/share/nginx/html
#Copy default nginx configuration
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf



