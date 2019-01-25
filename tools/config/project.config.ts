import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    this.APP_TITLE = 'Módulo de pedidos';
    this.GOOGLE_ANALYTICS_ID = 'UA-XXXXXXX-X';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      { src: 'ng2-toastr/bundles/ng2-toastr.min.css', inject: true },
      { src: '@angular/material/prebuilt-themes/indigo-pink.css', inject: true },
      { src: 'primeng/resources/themes/omega/theme.css', inject: true },
      { src: 'primeng/resources/primeng.min.css', inject: true },
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      { src: 'lodash/lodash.min.js', inject: 'libs' },
      // Bootstrap
      { src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs' },
      { src: 'bootstrap/dist/css/bootstrap.min.css', inject: true }, // inject into css section
      { src: 'bootstrap/dist/css/bootstrap-theme.min.css', inject: true }, // inject into css section
      { src: 'bootstrap/dist/css/bootstrap-theme.min.css.map', inject: true }, // inject into css section
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    // Add packages (e.g. ng2-translate)
    let additionalPackages: ExtendPackages[] = [
      {
        name: 'ng2-toastr',
        // Path to the package's bundle
        path: 'node_modules/ng2-toastr/bundles/ng2-toastr.min.js'
      },
      {
        name: 'lodash',
        path: 'node_modules/lodash/lodash.js',
      },
      {
        name: '@angular/material',
        path: 'node_modules/@angular/material/bundles/material.umd.js',
        packageMeta: {
          format: 'cjs',
        }
      },
      {
        name: '@ngx-translate/core',
        packageMeta: {
          main: 'bundles/core.umd.js',
          defaultExtension: 'js',
          configured: true
        }
      },
      {
        name: '@ngx-translate/http-loader',
        packageMeta: {
          main: 'bundles/http-loader.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'moment',
        packageMeta: {
          main: 'moment.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@covalent/core',
        packageMeta: {
          main: 'core.umd.js',
          defaultExtension: 'js'
        }
      },
      // Required for dev build
      {
        name: 'ngx-bootstrap',
        path: 'node_modules/ngx-bootstrap/bundles/ngx-bootstrap.umd.min.js'
      },
      // required for prod build
      {
        name: 'ngx-bootstrap/*',
        path: 'node_modules/ngx-bootstrap/bundles/ngx-bootstrap.umd.min.js'

      },
      {
        name: '@ngx-translate/core',
        packageMeta: {
          main: 'bundles/core.umd.js',
          defaultExtension: 'js',
          configured: true
        }
      },
      {
        name: '@ngx-translate/http-loader',
        packageMeta: {
          main: 'bundles/http-loader.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'moment',
        packageMeta: {
          main: 'moment.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@covalent/core',
        packageMeta: {
          main: 'core.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'ngx-restangular',
        packageMeta: {
          main: './dist/esm/src/index',
          defaultExtension: 'js'
        }
      },
      {
        name: 'd3-array',
        path: 'node_modules/d3-array//build/d3-array.js'

      },
      {
        name: 'd3-brush',
        path: 'node_modules/d3-brush//build/d3-brush.js'

      },
      {
        name: 'd3-shape',
        path: 'node_modules/d3-shape//build/d3-shape.js'

      },
      {
        name: 'd3-selection',
        path: 'node_modules/d3-selection//build/d3-selection.js'

      },
      {
        name: 'd3-color',
        path: 'node_modules/d3-color//build/d3-color.js'

      },
      {
        name: 'd3-drag',
        path: 'node_modules/d3-drag//build/d3-drag.js'

      },
      {
        name: 'd3-transition',
        path: 'node_modules/d3-transition//build/d3-transition.js'

      },
      {
        name: 'd3-format',
        path: 'node_modules/d3-format//build/d3-format.js'

      },
      {
        name: 'd3-force',
        path: 'node_modules/d3-force//build/d3-force.js'

      },
      {
        name: 'd3-dispatch',
        path: 'node_modules/d3-dispatch//build/d3-dispatch.js'

      },
      {
        name: 'd3-path',
        path: 'node_modules/d3-path//build/d3-path.js'

      },
      {
        name: 'd3-ease',
        path: 'node_modules/d3-ease//build/d3-ease.js'

      },
      {
        name: 'd3-timer',
        path: 'node_modules/d3-timer//build/d3-timer.js'

      },
      {
        name: 'd3-quadtree',
        path: 'node_modules/d3-quadtree//build/d3-quadtree.js'

      },
      {
        name: 'd3-interpolate',
        path: 'node_modules/d3-interpolate//build/d3-interpolate.js'

      },
      {
        name: 'd3-time',
        path: 'node_modules/d3-time//build/d3-time.js'

      },
      {
        name: 'd3-scale',
        path: 'node_modules/d3-scale//build/d3-scale.js'

      },
      {
        name: 'd3-collection',
        path: 'node_modules/d3-collection//build/d3-collection.js'

      },
      {
        name: 'd3-time-format',
        path: 'node_modules/d3-time-format//build/d3-time-format.js'

      },
      {
        name: 'd3-hierarchy',
        path: 'node_modules/d3-hierarchy//build/d3-hierarchy.js'

      }
      // NGX-CHARTS END
    ];

    //
    this.addPackagesBundles(additionalPackages);

    // Enable SCSS usage
    this.ENABLE_SCSS = 1;

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')({ ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
