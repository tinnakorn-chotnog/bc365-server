#!/usr/bin/env node
import * as amqp from 'amqplib/callback_api';
import * as axios from 'axios';

// Make a request for a user with a given ID
const http = axios.default;

http.get('http://localhost:15672/api/queues',{
    // RabbitMQ user and password
    auth: {
      username: 'guest',
      password: 'guest'
    }
  })
  .then(function (response) {
    // handle success
    const queues: any[] = response.data;
    amqp.connect('amqp://guest:guest@localhost:5672', function(error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
    
        queues.forEach( q => {
          console.log(q.name + ' queue was deleted.')
          channel.deleteQueue(q.name);
        })
    
      });
    });
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });


