# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


fs   = require 'fs'
path = require 'path'

# See docs at http://brunch.readthedocs.org/en/latest/config.html.

exports.config =
  paths:
    public: 'src/main/webapp/'

  files:

    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
        'test/javascripts/test.js': /^test(\/|\\)(?!vendor)/
        'test/javascripts/test-vendor.js': /^test(\/|\\)(?=vendor)/
      order:
        before: [
          'vendor/scripts/console-helper.js',
          'vendor/scripts/jquery-1.8.3.min.js',
          'vendor/scripts/handlebars-1.1.2.js',
          'vendor/scripts/ember-latest.js',
          'vendor/scripts/ember-data-latest.js',

          'vendor/scripts/bootstrap.min.js',
          'vendor/scripts/bootstrap-combobox.js',
          'vendor/scripts/bootstrap-editable.js',
          'vendor/scripts/select2.js',
          'vendor/scripts/bootstrap-confirmation.js',

          'vendor/scripts/jquery-ui-1.10.4.custom.min',
          ]

    stylesheets:
      defaultExtension: 'css'
      joinTo: 'stylesheets/app.css'
      order:
        before: [
          'vendor/styles/bootstrap-combined.min.css',
          'vendor/styles/bootstrap-theme.min.css',
          'vendor/styles/jquery-ui-bootstrap/jquery-ui-1.10.4.custom.css',
          'vendor/styles/font-awesome.css',
          'vendor/styles/font-awesome-ie7.css',
          'vendor/styles/cubism.css',
          'vendor/styles/rickshaw.css',
          'vendor/styles/bootstrap-combobox.css',
          'vendor/styles/bootstrap-editable.css',
          'vendor/styles/select2.css',
          'vendor/styles/select2-bootstrap.css'
        ]

    templates:
      precompile: true
      root: 'templates'
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js' : /^app/

  server:
    port: 3333
    base: '/'
    run: no


