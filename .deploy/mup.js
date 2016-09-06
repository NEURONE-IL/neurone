module.exports = {
  servers: {
    one: {
      host: '162.243.206.218',
      username: 'root'
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
      ROOT_URL: 'http://162.243.206.218'
    },

    //dockerImage: 'kadirahq/meteord'
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
