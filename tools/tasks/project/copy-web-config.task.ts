import * as gulp from 'gulp';
import { join } from 'path';
import Config from '../../config';

const WEB_CONFIG_LOCATION = './Web.config';

/**
 * This sample task copies all TypeScript files over to the appropriate `dist/dev|prod|test` directory, depending on the
 * current application environment.
 * Copies the Web.config
 */
export = () => {
    return gulp.src(WEB_CONFIG_LOCATION)
        .pipe(gulp.dest(Config.APP_DEST));
};
