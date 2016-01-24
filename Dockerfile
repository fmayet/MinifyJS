FROM centos:centos6

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN yum install -y epel-release
# Install Node.js and npm
RUN yum install -y nodejs npm cairo libcairo gcc

# Install app dependencies
COPY package.json /package.json
RUN cd /; npm install

# Bundle app source
COPY . /
RUN cd /; npm run build; npm run bundle

EXPOSE  11337
CMD ["node", "/lib/server.js"]