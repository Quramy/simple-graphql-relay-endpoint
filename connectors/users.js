import NeDB from 'nedb';
import {converter} from './util';
import * as _ from 'lodash';

const userDocuments = new NeDB({filename: 'db/users', autoload: true});

export const users = {
  findById(id) {
    return new Promise((res, rej) => {
      userDocuments.findOne({_id: id}, (err, docs) => {
        if(err) {
          rej(err);
          return;
        }
        res(converter(docs));
      });
    });
  },
  find({name, limit}) {
    return new Promise((res, rej) => {
      const q = {};
      if(name) q.name = new RegExp(name);
      userDocuments.find(q, (err, docs) => {
        if(err) {
          rej(err);
          return;
        }
        res(limit ? docs.slice(0, limit).map(converter) : docs.map(converter));
      });
    }).then(users => _.sortBy(users, ['createdAt']));
  },
  add({name, profileUrl}) {
    return new Promise((res, rej) => {
      const newUser = {
        name,
        profileUrl,
        createdAt: new Date().toISOString(),
      };
      userDocuments.insert(newUser, (err, doc) => {
        if(err) {
          rej(err);
          return;
        }
        res(converter(doc));
      });
    });
  },
  delete(id) {
    return new Promise((res, rej) => {
      userDocuments.remove({_id: id}, {}, (err, numRemoved) => {
        if(err) {
          rej(err);
          return
        }
        res(numRemoved);
      });
    });
  }
};
