import express from 'express';
import graphqlHttp from 'express-graphql';
import { schema } from './schema/schema';

const GRAPHQL_PORT = 4200;

const graphQLServer = express();
graphQLServer.use((req, res, next) => {
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

graphQLServer.use('/graphql', graphqlHttp({ schema, pretty: true }));
graphQLServer.listen(GRAPHQL_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`);
});
