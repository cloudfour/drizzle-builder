import path from 'path';
import Promise from 'bluebird';
import {writeFile as writeFileCB} from 'fs';
import {mkdirp as mkdirpCB} from 'mkdirp';
var writeFile = Promise.promisify(writeFileCB);
var mkdirp    = Promise.promisify(mkdirpCB);

function write (filepath, contents) {
  return mkdirp(path.dirname(filepath)).then(() => {
    return writeFile(filepath, contents);
  });
}

export { write };
