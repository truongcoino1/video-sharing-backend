# Introduction

This is a backend boilder template.

Happy coding!

### Backend Setup
#### 1. Clone repository and install dependencies
- Clone repository from gitthub
```bash
git clone https://github.com/truongcoino1/video-sharing-backend
```
```bash
cd video-sharing-backend
```
#### 2. Setup and start application
Setup a development with Docker.
- copy .env, docker-compose.yml, dockerfile:
```bash
cp .env.example .env && cp docker-compose.dev docker-compose.yml && cp Dockerfile.dev Dockerfile
```
- build container:
```bash
docker-compose build
```

- install dependencies:
```bash
docker-compose run backend yarn install
```
#### 3. Running the Application
```bash
docker-compose up
```

Server is running at http://localhost:5001
#### 4. Start test
- Install dependencies
    ```bash
        npm run install
    ```
    or 
    ```bash
        yarn install
    ```
- Run tests
    ```bash
    yarn test
    ```
