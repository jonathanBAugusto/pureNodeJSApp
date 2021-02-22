import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Ut from './utils.js';

const __filename = fileURLToPath(import.meta.url);

const Data = {};

const dirname = path.dirname(__filename);

Data.baseDir = path.join(dirname, '/../.data/');

Data.create = (dir, file, data, callback) => {

  Ut.createIfNotExistsDir(path.join(Data.baseDir, dir));

  const filePath = path.join(Data.baseDir, dir, file + '.json');

  fs.open(filePath, 'wx', (err, fileDescriptor) => {
    if (err || !fileDescriptor) {
      callback('Could not create new file, it may already exits', err);
      return;
    }

    const stringData = JSON.stringify(data);

    fs.writeFile(fileDescriptor, stringData, (err) => {
      if (err) {
        callback('Erro writing to new file');
        return;
      }

      fs.close(fileDescriptor, (errClose) => {
        if (errClose) {
          callback('Error closing new file');
          return;
        }

        callback(false);
        return;
      });
    });

  });
};

Data.read = (dir, file, callback) => {
  const filePath = path.join(Data.baseDir, dir, file + '.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (!err && data) {
      var parseData = Ut.parseJsonToObject(data);
      callback(false, parseData);
    } else {
      callback(err, data);
    }
  });
}

Data.update = (dir, file, data, callback) => {
  const filePath = path.join(Data.baseDir, dir, file + '.json');
  fs.open(filePath, 'r+', (err, fileDescriptor) => {
    if (err || !fileDescriptor) {
      callback('Could not update the file, it may not exits', err);
      return;
    }

    const stringData = JSON.stringify(data);

    fs.ftruncate(fileDescriptor, (err) => {
      if (err) {
        callback('Error truncating file');
      }

      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (err) {
          callback('Erro writing to new file');
        }
        fs.close(fileDescriptor, (errClose) => {
          if (errClose) {
            callback('Error closing new file');
          }
          callback(false);
        });
      });
    });
  });
};

Data.delete = (dir, file, callback) => {
  const filePath = path.join(Data.baseDir, dir, file + '.json');
  fs.unlink(filePath, (err) => {
    if (err) {
      callback('Error deleting file');
    }

    callback(false);
  });
};

export default Data;
