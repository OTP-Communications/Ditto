#!/usr/bin/env node

/*
Copyright 2017 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const fs = require('fs');

if (process.argv.length < 4)
  throw new Error('Missing source and target file arguments');

const sourceFile = fs.readFileSync(process.argv[2], 'utf8');
const targetFile = fs.readFileSync(process.argv[3], 'utf8');

if (sourceFile !== targetFile) {
  throw new Error('Files do not match');
}
