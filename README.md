# MinifyJS
MinifyJS - Compress your JavaScript code online


## Installation
To use, download the .zip and extract the contents or clone the repository by typing

```bash
git clone https://github.com/fmayet/MinifyJS.git
```

## Usage
Make sure you have node.js installed.

Change to the download directory and execute the following commands:

```bash
npm install
```

```bash
npm start server
```

Then browse to localhost:port and start using MinifyJS.

##Dockerize (optional)
This project includes a <i>Dockerfile</i>.

In order to create a docker image run (replace <i>imagename</i> with whatever name you want):

```bash
 docker build -t imagename .
```

Run the image with:

```bash
docker run -p 8080:11337 -d imagename
```

##Legal
Released under the MIT License

Copyright (c) 2016 Ferdinand Mayet
