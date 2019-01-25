import * as gulp from 'gulp';
import { join } from 'path';
import Config from '../../config';
let merge = require('gulp-merge-json');


/**
 * This sample task copies all TypeScript files over to the appropriate `dist/dev|prod|test` directory, depending on the
 * current application environment.
 */
export = () => {

  let options = {
    fileName: 'es.json'
  };
  return gulp.src(join(Config.APP_SRC, '**/i18n/es.json'))
    .pipe(merge(options))
    .pipe(gulp.dest(Config.APP_DEST+'/assets'));
};
