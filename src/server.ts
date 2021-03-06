import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import * as express from 'express';
import * as http from 'http';
import { schema } from './schema';
export const startApolloServer = async () => {
  const app = express();
  app.use(express.json());
  app.get('/', (req, res, next) => {
    res.redirect('/graphql');
  });

  app.use('/lighthouse', require('./routs/lighthouse'));

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });
  await new Promise<void>((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));

  console.log(`🚀 Server ready at ${server.graphqlPath}`);
};
