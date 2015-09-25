/**
 * @file config edp-build
 * @author EFE
 */

/* globals LessCompiler, CssCompressor, JsCompressor, PathMapper, AddCopyright, ModuleCompiler, TplMerge */

exports.input = __dirname;

var path = require('path');
exports.output = path.resolve(__dirname, 'output');

// var moduleEntries = 'html,htm,phtml,tpl,vm,js';
// var pageEntries = 'html,htm,phtml,tpl,vm';

exports.getProcessors = function () {
    var lessProcessor = new LessCompiler();
    var cssProcessor = new CssCompressor();
    var moduleProcessor = new ModuleCompiler();
    var jsProcessor = new JsCompressor();
    var pathMapperProcessor = new PathMapper();
    var addCopyright = new AddCopyright();
    var ImgOptimziedProcessor = require('edp-build-optimg');
    var imgOptProcessor = new ImgOptimziedProcessor(
        {
            files: ['*.svg'],
            imgOptions: {
                webp: {
                    option: {quality: 50},
                    use: require('imagemin-webp')
                },
                jpg: {
                    use: 'jpeg-recompress'
                },
                png: {
                    //use: 'pngquant',
                    //option: {quality: '65-80', speed: 4}
                },
                svg: {
                    option: {
                        plugins: [
                            {
                                removeViewBox: false
                            },
                            {
                                removeUselessStrokeAndFill: false
                            }
                        ]
                    }
                }
            }
        }
    );

    return {
        'default': [
            lessProcessor, moduleProcessor, imgOptProcessor, pathMapperProcessor
        ],

        'release': [
            lessProcessor, cssProcessor, moduleProcessor,
            jsProcessor, pathMapperProcessor, addCopyright
        ]
    };
};

exports.exclude = [
    'tool',
    'doc',
    'test',
    'module.conf',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp'
];

/* eslint-disable guard-for-in */
exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[key] = processors[key];
    }
};
