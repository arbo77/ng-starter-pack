const fs = require('fs');
const path = require('path');
const parentArrays = ['/', '/../', '/../../', '/../../../', '/../../../../', '/../../../../../', '/../../../../../../', '/../../../../../../../', '/../../../../../../../../', '/../../../../../../../../../../', '/../../../../../../../../../../'];

if (process.platform === "win32") {
	module.exports = {

		findFile: (fileName, z = 0, exclude = ['Dockerfile', 'Jenkinsfile', 'LICENSE', 'node_modules']) => {
			let initPath = path.resolve(process.cwd() + parentArrays[z]);
			let fileArray = [];
			const check = a => {
				let pathArray = a.split('\\');
				(a.indexOf('.') == -1 && exclude.indexOf(pathArray[pathArray.length - 1]) == -1) ? fs.readdirSync(a).forEach(b => { check(`${a}\\${b}`) }) : ((a.indexOf(fileName) > 0 ? fileArray.push(a) : false))
			};
			fs.readdirSync(initPath).forEach(a => check(`${initPath}\\${a}`));
			return (fileArray.length > 1 ? new Error(`You have duplicate file names in your folder structure. Rename your duplicate file. \n ${fileArray}`) : ((fileArray[0] != null) ? fileArray[0] : 'File Not Found'))
		},
		globalFindFile: (startPath, z = 0) => {
			let initPath = path.resolve(startPath + parentArrays[z]);
			return global.__find = (fileName, exclude = ['Dockerfile', 'Jenkinsfile', 'LICENSE', 'node_modules']) => {
				let fileArray = [];
				const check = a => {
					let pathArray = a.split('\\');
					(a.indexOf('.') == -1 && exclude.indexOf(pathArray[pathArray.length - 1]) == -1) ? fs.readdirSync(a).forEach(b => { check(`${a}\\${b}`) }) : ((a.indexOf(fileName) > 0 ? fileArray.push(a) : false))
				};
				fs.readdirSync(initPath).forEach(a => check(`${initPath}\\${a}`));
				return (fileArray.length > 1 ? new Error(`You have duplicate file names in your folder structure. Rename your duplicate file. \n ${fileArray}`) : ((fileArray[0] != null) ? fileArray[0] : 'File Not Found'))
			};
		},
		getFilesAsJson: (z = 0, specificFolder = '', exclude = ['Dockerfile', 'Jenkinsfile', 'LICENSE', 'node_modules']) => {
			let startPath = path.resolve(process.cwd() + parentArrays[z] + specificFolder);
			let formattedPath = startPath.split('\\').join('/') + '/';
			let fileArray = [];
			let buildObj = {};
			const check = a => {
				let pathArray = a.split('\\');
				if (a.indexOf('.') == -1 && exclude.indexOf(pathArray[pathArray.length - 1]) == -1) {
					fs.readdirSync(a).forEach(b => {
						check(`${a}\\${b}`)
					})
				} else {
					buildObj[pathArray[pathArray.length - 1].split('.')[0]] = [a.split('\\').join('/').replace(new RegExp(formattedPath + specificFolder, 'g'), '')];
				}
			};
			fs.readdirSync(startPath).forEach(a => check(`${startPath}\\${a}`));
			return buildObj;
		}
	};
} else {
	module.exports = {

		findFile: (fileName, z = 0, exclude = ['Dockerfile', 'Jenkinsfile', 'LICENSE', 'node_modules']) => {
			let initPath = path.resolve(process.cwd() + parentArrays[z]);
			let fileArray = [];
			const check = a => {
				let pathArray = a.split('/');
				(a.indexOf('.') == -1 && exclude.indexOf(pathArray[pathArray.length - 1]) == -1) ? fs.readdirSync(a).forEach(b => { check(`${a}/${b}`) }) : ((a.indexOf(fileName) > 0 ? fileArray.push(a) : false))
			};
			fs.readdirSync(initPath).forEach(a => check(`${initPath}/${a}`));
			return (fileArray.length > 1 ? new Error(`You have duplicate file names in your folder structure. Rename your duplicate file. \n ${fileArray}`) : ((fileArray[0] != null) ? fileArray[0] : 'File Not Found'))
		},
		globalFindFile: (startPath, z = 0) => {
			let initPath = path.resolve(startPath + parentArrays[z]);
			return global.__find = (fileName, exclude = ['Dockerfile', 'Jenkinsfile', 'LICENSE', 'node_modules']) => {
				let fileArray = [];
				const check = a => {
					let pathArray = a.split('/');
					(a.indexOf('.') == -1 && exclude.indexOf(pathArray[pathArray.length - 1]) == -1) ? fs.readdirSync(a).forEach(b => { check(`${a}/${b}`) }) : ((a.indexOf(fileName) > 0 ? fileArray.push(a) : false))
				};
				fs.readdirSync(initPath).forEach(a => check(`${initPath}/${a}`));
				return (fileArray.length > 1 ? new Error(`You have duplicate file names in your folder structure. Rename your duplicate file. \n ${fileArray}`) : ((fileArray[0] != null) ? fileArray[0] : 'File Not Found'))
			};
		},
		getFilesAsJson: (z = 0, specificFolder = '', exclude = ['Dockerfile', 'Jenkinsfile', 'LICENSE', 'node_modules']) => {
			let startPath = path.resolve(process.cwd() + parentArrays[z] + specificFolder);
			console.log(startPath);
			let formattedPath = startPath.split('/').join('/') + '/';
			let fileArray = [];
			let buildObj = {};
			const check = a => {
				let pathArray = a.split('/');
				if (a.indexOf('.') == -1 && exclude.indexOf(pathArray[pathArray.length - 1]) == -1) {
					fs.readdirSync(a).forEach(b => {
						check(`${a}/${b}`)
					})
				} else {
					buildObj[pathArray[pathArray.length - 1].split('.')[0]] = [a.split('/').join('/').replace(new RegExp(formattedPath + specificFolder, 'g'), '')];
				}
			};
			fs.readdirSync(startPath).forEach(a => check(`${startPath}/${a}`));
			return buildObj;
		}
	};
}
