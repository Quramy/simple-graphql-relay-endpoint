import { graphql } from 'graphql';
import { printSchema, introspectionQuery } from 'graphql/utilities';
import { writeFileSync } from 'fs';
import { schema } from './src/schema';

async function main() {
  const result = await graphql(schema, introspectionQuery);
  writeFileSync('./dist/schema.json', JSON.stringify(result, null, 2));
}

main();
