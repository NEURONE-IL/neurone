/*

IMPORTANT: Set the following environment variables

export MUP_SERVER_HOST='1.2.3.4'
export MUP_SERVER_USERNAME='root'
export MUP_ROOT_URL='http://1.2.3.4'
export MUP_MONGO_URL='mongodb://localhost/meteor'

Then run

mup setup
mup deploy

*/

module.exports = {
  servers: {
    one: {
      host: process.env.MUP_SERVER_HOST || '127.0.0.1',
      username: process.env.MUP_SERVER_USERNAME || 'root'
      // pem: '~/.ssh/id_rsa'
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'prototype2',
    path: '..',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
      cleanAfterBuild: true
    },
    env: {
      ROOT_URL: process.env.MUP_ROOT_URL || 'http://localhost'
      // MONGO_URL: process.env.MUP_MONGO_URL || 'mongodb://localhost/meteor'
    },

    //dockerImage: 'kadirahq/meteord'
    dockerImage: 'abernix/meteord:base',
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
