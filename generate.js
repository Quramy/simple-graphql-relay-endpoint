import { schema } from './schema/schema';
import { graphql } from 'graphql';
import { printSchema, introspectionQuery } from 'graphql/utilities';
import { writeFileSync } from 'fs';


function main() {
  const schemaString = printSchema(schema);
  writeFileSync('./schema/schema.graphql', schemaString);
  graphql(schema, introspectionQuery).then(result => {
    writeFileSync('./schema/schema.json', JSON.stringify(result, null, 2));
  });
}

main();
