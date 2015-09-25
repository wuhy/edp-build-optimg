
/**
 * @file 图片优化 处理器
 * @author sparklewhy@gmail.com
 */

/* global AbstractProcessor:false */

var util = require('util');
var _ = require('lodash');
var prettyBytes = require('pretty-bytes');
var Imagemin = require('imagemin');

/**
 * 图片优化处理器
 *
 * @constructor
 * @param {Object} options 初始化参数
 */
function ImageOptimizeProcessor(options) {
    AbstractProcessor.call(this, options);

    _.extend(this, _.merge({}, ImageOptimizeProcessor.DEFAULT_OPTIONS, options));

    var processors = [];
    var imgOptions = this.imgOptions;
    var log = this.log;
    Object.keys(imgOptions).forEach(function (type, index) {
        var opt = imgOptions[type];
        var use = opt.use;
        var processor = use;

        try {
            if (_.isString(use)) {
                processor = Imagemin[use];
                !processor && (processor = require('imagemin-' + use));
            }
            else if (!_.isFunction(use)) {
                throw new Error('the use option value must be a function or plugin name');
            }
        }
        catch (ex) {
            log.error('load image processor %s fail: %s', use, ex);
            processor = null;
        }

        processors[index] = {
            type: type,
            processor: processor,
            option: opt.option,
            match: opt.match
        };
    });
    this.imgProcessors = processors;
}

util.inherits(ImageOptimizeProcessor, AbstractProcessor);

ImageOptimizeProcessor.DEFAULT_OPTIONS = {

    /**
     * 处理器名称
     *
     * @const
     * @type {string}
     */
    name: 'ImageOptimizeProcessor',

    /**
     * 要处理的文件
     *
     * @type {Array}
     */
    files: ['*.{gif,jpg,jpeg,png,svg}'],

    /**
     * 图片选项配置，key 对应的图片类型，若未提供 `match` 选项，则默认以后缀名匹配
     *
     * @type {Object}
     */
    imgOptions: {

        /**
         * svg 图片文件的处理选项定义
         *
         * @type {Object}
         */
        svg: {
            /**
             * @property {Object} option 使用的图片处理插件的选项
             */

            /**
             * @property {string|Function} use 使用的图片处理插件，如果传入字符串，优先从
             *           内置的处理插件查找，查找不到使用 `imagemin-`<use> 名称加载插件，可用
             *           插件{@see https://www.npmjs.com/browse/keyword/imageminplugin}
             *           默认使用 `imagemin` 自带的 `svgo` 插件
             */
            use: 'svgo',

            /**
             * @property {RegExp} match 判断给定的文件扩展名是否匹配
             */
            match: /svg/i
        },

        /**
         * png 图片文件的处理选项定义
         *
         * @type {Object}
         */
        png: {
            use: 'optipng',
            match: /png/i
        },

        /**
         * jpg 图片文件的处理选项定义
         *
         * @type {Object}
         */
        jpg: {
            use: 'jpegtran',
            match: /(jpg|jpeg)/i
        },

        /**
         * gif 图片文件的处理选项定义
         *
         * @type {Object}
         */
        gif: {
            use: 'gifsicle',
            match: /gif/i
        }
    }
};

/**
 * 获取给定的文件的图片处理器
 *
 * @param {Object} file 要处理的图片文件
 * @return {Object}
 */
ImageOptimizeProcessor.prototype.getImageProcessor = function (file) {
    var found;
    this.imgProcessors.some(function (item) {
        var match = item.match;
        var extname = file.extname;
        if ((_.isRegExp(match) && match.test(extname)) || extname === item.type) {
            item.processor && (found = item);
            return true;
        }
        return false;
    });
    return found;
};

/**
 * 构建处理
 *
 * @param {FileInfo} file 文件信息对象
 * @param {ProcessContext} processContext 构建环境对象
 * @param {Function} callback 处理完成回调函数
 */
ImageOptimizeProcessor.prototype.process = function (file, processContext, callback) {
    var imgProcessor = this.getImageProcessor(file);
    var log = this.log;

    if (imgProcessor) {
        log.info('process image file %s...', file.path);
        var originSize = file.data.length;
        var filePath = file.path;

        new Imagemin()
            .src(new Buffer(file.data))
            .use(imgProcessor.processor(imgProcessor.option))
            .run(function (err, files) {
                if (err) {
                    log.error('process image file %s error happen: %s', filePath, err);
                }
                else if (!files.length) {
                    log.warn('optimize image file %s fail.', filePath);
                }
                else {
                    var optimizedData = files[0].contents;
                    var size = optimizedData.length;
                    var saveSize = originSize - size;
                    var saverPercent = originSize > 0 ? saveSize / originSize * 100 : 0;

                    file.data = optimizedData;

                    log.info(
                        'optimize file: %s result: %s -> %s, save %s (%s)',
                        filePath, prettyBytes(originSize), prettyBytes(size),
                        prettyBytes(saveSize), saverPercent.toFixed(2) + '%'
                    );
                }

                callback();
            });
    }
    else {
        this.log.error('find the image processor for file: %s fail', file.path);
        callback();
    }
};

module.exports = exports = ImageOptimizeProcessor;

