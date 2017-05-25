import NeDB from 'nedb';
import { converter } from './util';

const articleDocuments = new NeDB({ filename: 'db/articles', autoload: true });

export const articles = {
  findById(id) {
    return new Promise((res, rej) => {
      articleDocuments.findOne({ _id: id }, (err, docs) => {
        if(err) {
          return rej(err);
        }
        res(converter(docs));
      });
    });
  },

  findByAuthor(authorId) {
    return new Promise((res, rej) => {
      articleDocuments.find({ authorId }, (err, docs) => {
        if(err) {
          return rej(err);
        }
        res(docs.map(converter));
      });
    });
  },

  findAll() {
    return new Promise((res, rej) => {
      articleDocuments.find({}, (err, docs) => {
        if(err) {
          return rej(err);
        }
        res(docs.map(converter));
      });
    });
  },

  add({ title, content, authorId }){
    return new Promise((res, rej) => {
      const newArticle = {
        title,
        content,
        authorId,
      };
      articleDocuments.insert(newArticle, (err, doc) => {
        if(err) {
          return rej(err);
        }
        res(converter(doc));
      });
    });
  }
};

