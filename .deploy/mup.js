/*

IMPORTANT: Set the following environment variables

export MUP_SERVER_HOST='192.168.1.2'
export MUP_SERVER_USERNAME='root'
export MUP_SERVER_PASSWORD='password'
export MUP_ROOT_URL='http://192.168.1.2'
export MUP_MONGO_URL='mongodb://192.168.1.2/meteor'

Then run

mup setup
mup deploy

*/

module.exports = {
  servers: {
    one: {
      host: process.env.MUP_SERVER_HOST || '127.0.0.1',
      username: process.env.MUP_SERVER_USERNAME || 'root',
      // pem: '/home/user/.ssh/id_rsa', // mup doesn't support '~' alias for home directory
      // password: 'password',
      // or leave blank to authenticate using ssh-agent
      opts: {
          port: 22,
      },
    }
  },

  meteor: {
    name: 'neurone',
    path: '..', // mup doesn't support '~' alias for home directory
    // port: 000, // useful when deploying multiple instances (optional)
    volumes: { // lets you add docker volumes (optional)
      "/home/neurone/assets": "/assets" // passed as '-v /host/path:/container/path' to the docker run command
    },
    docker: {
      //image: 'kadirahq/meteord', // (optional)
      image: 'abernix/meteord:base', // use this image if using Meteor 1.4+
      args:[ // lets you add/overwrite any parameter on the docker run command (optional)
      //  "--link=myCustomMongoDB:myCustomMongoDB", // linking example
      //  "--memory-reservation 200M" // memory reservation example
      ]
    },
    servers: {
      one: {}, two: {}, three: {} // list of servers to deploy, from the 'servers' list
    },
    buildOptions: {
      serverOnly: true,
      debug: true,
      cleanAfterBuild: true // default
      //buildLocation: '/my/build/folder', // defaults to /tmp/<uuid>
      //mobileSettings: {
      //  yourMobileSetting: "setting value"
      //}
    },
    env: {
      ROOT_URL: process.env.MUP_ROOT_URL || 'http://localhost',
      MONGO_URL: process.env.MUP_MONGO_URL || 'mongodb://localhost/meteor'
    },
    //log: { // (optional)
    //  driver: 'syslog',
    //  opts: {
    //    "syslog-address":'udp://syslogserverurl.com:1234'
    //  }
    //},
    //ssl: {
    //  port: 443,
    //  crt: 'bundle.crt',
    //  key: 'private.key',
    //},
    deployCheckWaitTime: 60 // default 10
  },

  mongo: { // (optional)
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};