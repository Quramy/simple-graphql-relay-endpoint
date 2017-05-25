import { graphql } from 'graphql';
import { printSchema, introspectionQuery } from 'graphql/utilities';
import { writeFileSync } from 'fs';
import { schema } from './src/schema';

function main() {
  // const schemaString = printSchema(schema);
  // writeFileSync('./dist/schema.graphql', schemaString);
  graphql(schema, introspectionQuery).then(result => writeFileSync('./dist/schema.json', JSON.stringify(result, null, 2)));
}

main();
