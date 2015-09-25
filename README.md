edp-build-optimg
========

> EDP Build plugin for optimizing image size

edp-build-optimg 是 [edp-build](https://github.com/ecomfe/edp-build) 的一个插件，用于优化图片大小，支持png/jpg/gif/webp/svg，基于 [imagemin](https://github.com/imagemin/imagemin) 。若你对命令行感兴趣，可以参考 edp 的一个扩展 [edpx-optimg](https://github.com/ecomfe/edpx-optimg) 。

## 如何使用

```javascript
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
                use: 'pngquant',
                option: {quality: '65-80', speed: 4}
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
```

## Options

* files - `Array` 要处理的文件，默认处理所有的 png/jpg/gif/svg 文件

* imgOptions - `Object` 图片处理选项定义

    * png - `Object` png 文件处理选项定义
    
        - use - `string` | `function` 使用的处理插件名称或者插件处理器，无需加上 `imagemin-` 前缀，可用的插件模块见[这里](https://www.npmjs.com/browse/keyword/imageminplugin)，e.g., 使用 `imagemin-pngcrush`，首先安装该模块，传入的 `use` 参数值为 `pngcrush`，默认使用 [imagemin-optipng](github.com/imagemin/imagemin-optipng) 优化
      
        - option - `Object` 使用的插件选项，详见具体使用的插件的选项定义
        
    * jpg - `Object` jpg 文件处理选项定义，结构同 `png` ，默认使用 [imagemin-jpegtran](https://github.com/imagemin/imagemin-jpegtran) 优化  
    
    * gif - `Object` gif 文件处理选项定义，结构同 `png` ，默认使用 [imagemin-gifsicle](https://github.com/imagemin/imagemin-gifsicle) 优化 
    
    * svg - `Object` svg 文件处理选项定义，结构同 `png` ，默认使用 [imagemin-svgo](https://github.com/imagemin/imagemin-svgo) 优化
    
    * 其他自定义的文件类型，比如 `webp`
