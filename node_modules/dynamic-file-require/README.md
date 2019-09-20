# dynamic-file-require

This package is useful for quickly adding required custom node modules anywhere in your project without having to use the relative path.

## PreReqs: Node 6.4+

## Usage 1: 

From the main file or root of your project, include the function from the package. Call the function to instantiate a global function called `__find()` as shown below. The first param to globalFindFile is the absolute system path to the desired starting search position. `__dirname` will give you the folder you current working file is in. The second parameter is an optional parent folder index in case your main app file is nested a bit and you will require files in a higher directory. 1 for example would be the direct parent folder , 2 would be the next folder up the chain and so on, currently 10 is the limit. In subsequent required files you don't need to set up you globalFindFile as it was already created and saved as a function globally from you main app source. The third optional param to globalFindFile() which you don’t see below is an optional array of files or folders you DONT want to search in. By default currently this is :

`['Dockerfile', 'Jenkinsfile', 'LICENSE', 'node_modules']`

#### Setup in your main app file:

`const {globalFindFile} = require('dynamic-file-require');`

``globalFindFile(__dirname, 0); 
// zero is the default so you don't need to pass it in, just here as example``

#### Use in main file and child/sibling modules: 

`const foo = require(__find('foo.js'));`


## Usage 2:

Similar to the method above but keeps the scope local. You need to require the package each time you want to use the function. The main diff here is that it will search from your current working directory/folder. The second optional parameter is the parent folder index as described above. And the third parameter the is optional exclusion array as mentioned above. 

#### Setup and Use on any module:

`const {findFile} = require('dynamic-file-require');`

`const foo = require(findFile('foo.js'));` 

or

`const foo = require(findFile('foo.js',1));`  // search starting from immediate parent folder with default exclusion list

`const foo = require(findFile('foo.js', 2 , ['Dockerfile', 'Jenkinsfile', 'LICENSE', 'node_modules']));`


## Extra:

Included is a function `const {getFilesAsJson} = require('dynamic-file-require');` that will return a JSON object with the filenames as keys and the paths as values. 

Params: parent index to move up file structure^ , once up the file structure you can go back down into a subfolder with the second param , and the third param is files and folders to exclude. One example of its use would be to dynamically construct a list of specs for webdriver tests upon runtime so you are free to organize folders and files on the fly without rewriting your list of suites.

`getFilesAsJson(1, 'test/test1', ['again array of files and folders to exclude']);`
