# Simple GraphQL Relay Endpoint

It's a simple GraphQL server example compatible RelayQL.

## Install

```sh
npm install
npm run init-db   # need to run at the first time
npm start
```

You can execute GraphQL query with `http://localhost:4200/graphql`. For example:

```graphql
query {
  viewer {
    users(first: 3) {
      edges {
        node {
          id, name, profileUrl,
        }
      },
      pageInfo {
        hasNextPage
      }
    }
  }
}
```

## Model
This server provides 2 models, `User` and `Article`.
If you want detail, check out the schema document (you can check the document via the `Doc` link at the GraphiQL view).

## Generate schema.json

Execute the following:

```sh
npm run gen
```

An introspection query will be generated at `dist/schema.json`.

## License
MIT
