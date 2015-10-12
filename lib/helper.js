/**
 * @file 辅助工具方法定义
 * @author sparklewhy@gmail.com
 */

/**
 * 将给定的文件大小（字节单位）转成待单位的大小
 *
 * @param {number} size 原始字节大小
 * @return {string}
 */
exports.prettyBytes = function (size) {
    var base = 1024;
    var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    var result = size;
    var unitBase = base;
    for (var i = 0, len = units.length; i < len; i++) {
        if (result < base) {
            return result + ' ' + units[i];
        }

        result = (size / unitBase).toFixed(2);
        unitBase *= base;
    }
};
