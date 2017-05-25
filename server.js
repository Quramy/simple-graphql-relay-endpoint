import express from 'express';
import graphqlHTTP from 'express-graphql';
import { schema } from './schema/schema';

const GRAPHQL_PORT = 4200;

const server = express();
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

server.use('/graphql', graphqlHTTP({ schema, pretty: true }));
server.listen(GRAPHQL_PORT, () => console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`));
