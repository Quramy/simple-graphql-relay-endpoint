import {
  GraphQLID,
  GraphQLString,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} from 'graphql/type';

import {
  connectionFromArray,
  connectionArgs,
  connectionDefinitions,
  cursorForObjectInConnection,
  mutationWithClientMutationId,
  offsetToCursor,
} from 'graphql-relay';

import { users } from '../connectors/users';
import { articles } from '../connectors/articles';

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLString },
  }
});
const { connectionType: ArticleConnection, edgeType: ArticleEdge } = connectionDefinitions({ nodeType: ArticleType });

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    profileUrl: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  },
});
const { connectionType: UserConnection, edgeType: UserEdge } = connectionDefinitions({ nodeType: UserType });

UserType._typeConfig.fields.articles = {
  type: ArticleConnection,
  args: connectionArgs,
  resolve(user, args) {
    return articles.findByAuthor(user.id).then(articleList => {
      return connectionFromArray(articleList, args);
    });
  },
};

ArticleType._typeConfig.fields.author = {
  type: UserType,
  resolve(article) {
    return users.findById(article.authorId);
  },
};

const Viewer = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    greeting: {
      type: GraphQLString,
      resolve() {
        return 'Hello ng2 + Relay';
      }
    },
    me: {
      type: UserType,
      resolve(viewer) {
        return users.find({ name: 'quramy' }).then(userList => {
          return userList[0];
        });
      },
    },
    users: {
      type: UserConnection,
      args: connectionArgs,
      resolve(viewer, args) {
        return users.find({ name: "", limit: 100 }).then(usersList => {
          return connectionFromArray(usersList, args);
        });
      },
    },
    articles: {
      type: ArticleConnection,
      args: connectionArgs,
      resolve(viewer, args) {
        return articles.findAll().then(articleList => {
          return connectionFromArray(articleList, args);
        });
      },
    },
  },
});

function getViewer() {
  return {
    id: 'quramy',
  }
}

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: Viewer,
      resolve: getViewer,
    },
  },
});


const AddUserMutation = mutationWithClientMutationId({
  name: 'AddUser',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) }, 
    profileUrl: { type: GraphQLString },
  },
  outputFields: {
    newUserEdge: {
      type: UserEdge,
      resolve(payload) {
        const {newUser} = payload;
        return {
          cursor: offsetToCursor(0),
          node: newUser,
        };
      },
    },
    viewer: {
      type: Viewer,
      resolve: getViewer,
    }
  },
  mutateAndGetPayload({ name, profileUrl }) {
    return users.add({ name, profileUrl }).then(newUser => {
      return {
        newUser,
      };
    });
  },
});

const RemoveUserMutation = mutationWithClientMutationId({
  name: 'RemoveUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    removedUserId: {type: GraphQLID},
    viewer: {
      type: Viewer,
      resolve: getViewer,
    },
  },
  mutateAndGetPayload({ id }) {
    return users.delete(id).then(num => {
      if(num) {
        return {
          removedUserId: id,
        };
      }else{
        return {};
      }
    });
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: AddUserMutation,
    removeUser: RemoveUserMutation,
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
