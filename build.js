// Idea taken from https://medium.com/douglas-matoso-english/build-static-site-generator-nodejs-8969ebe34b22
const fse = require('fs-extra');
const path = require('path');
const {promisify} = require('util');
const ejs = require('ejs');
const ejsRenderFile = promisify(ejs.renderFile);
const globP = promisify(require('glob'));
const frontMatter = require('front-matter');
const marked = require('marked');
const config = require('./site.config');

const srcPath = './src';
const distPath = './public';

// clear destination folder
fse.emptyDirSync(distPath);

// copy assets folder
fse.copy(`${srcPath}/assets`, `${distPath}/assets`);

// read page templates
globP('**/*.@(md|ejs|html)', {cwd: `${srcPath}/content`})
    .then((files) => {
        files.forEach((file) => {
            const fileData = path.parse(file);
            const destPath = path.join(distPath, fileData.dir);

            // create destination directory
            fse.mkdirs(destPath)
                .then(() => {
                    // read page file
                    return fse.readFile(`${srcPath}/content/${file}`, 'utf-8')
                })
                .then((data) => {
                    // extract front matter
                    const pageData = frontMatter(data);
                    const templateConfig = Object.assign({}, config, {page: pageData.attributes});

                    let pageContent;
                    switch (fileData.ext) {
                        case '.md':
                            pageContent = marked(pageData.body);
                            break;
                        case '.ejs':
                            pageContent = ejs.render(pageData.body, templateConfig);
                            break;
                        default:
                            pageContent = pageData.body
                    }

                    // render layout with page contents
                    return ejsRenderFile(`${srcPath}/layout.ejs`, Object.assign({}, templateConfig, {body: pageContent}))
                })
                .then((layoutContent) => {
                    // save the html file
                    fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
                })
                .catch((err) => {
                    console.error(err)
                })
        })
    })
    .catch((err) => {
        console.error(err)
    });