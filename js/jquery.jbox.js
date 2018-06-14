/**
 * PC版弹窗组件
 * 支持拖拽，支持动画样式，外部定义样式
 * 2016-10-24
 * by 小强
 */
;
(function ($) {
    var diskBox = function (option) {
        var defaults = {
            isMove: false,   //是否可移动
            isVertical: false,  //是否垂直剧中
            isFlow: true,   //是否跟随移动
            isLimit: true,   //移动是否开启限制范围
            time: 1500, //小时时间
            //width: 500,
            top: "20%",  //距离顶部的距离，支持“px”和“%”
            box: {clsName: "", animate: "j-alert-ani"},
            title: "",
            load: true,
            hasClose: true,
            path: "img/",
            icon: {location: "", src: "", width: 38, height: 38},
            boxCls: "",
            btn: {
                text: [],
                closeType: 1,
                jEnsure: null,
                jCancel: null
            },
            css: {} //整体样式
        };

        var defaultCSS = {
            iconCSS: {width: "50px", "height": "50px"},
            boxCSS: {},
            titleCSS: {},
            textCSS: {},
            btnCSS: {
                jEnsure: {},
                jCancel: {}
            }
        };

        var that = this;
        that.opt = $.extend({}, defaults, option);
        that.configFun = function (callback) {
            var opt = that.opt;
            if (callback) callback.call(that, opt);
            var location = opt.path === undefined ? (!opt.icon.location ? "" : opt.icon.location) : opt.path;
            if (opt.load) {
                _loadImage(location + "jBox/alert.png", "");
                _loadImage(location + "jBox/error.png", "");
                _loadImage(location + "jBox/success.png", "");
                _loadImage(location + "jBox/loading.gif", "");
            }
            return opt;
        };

        that.alert = function (text, opts, css) {
            var config = opts ? opts.configCallback ? opts.configCallback() : "" : "";
            tipsFun(text, opts, null, null, 0, css, opts ? opts.close === undefined ? 1 : opts.close : 1, config);
        };

        that.error = function (text, opts, css) {
            var config = opts ? opts.configCallback ? opts.configCallback() : "" : "";
            tipsFun(text, opts, {src: "jBox/error.png"}, null, 0, css, opts ? opts.close === undefined ? 1 : opts.close : 1, config);
        };

        that.success = function (text, opts, css) {
            var config = opts ? opts.configCallback ? opts.configCallback() : "" : "";
            tipsFun(text, opts, {src: "jBox/success.png"}, null, 0, css, opts ? opts.close === undefined ? 1 : opts.close : 1, config);
        };

        that.waring = function (text, opts, css) {
            var config = opts ? opts.configCallback ? opts.configCallback() : "" : "";
            tipsFun(text, opts, {src: "jBox/alert.png"}, null, 0, css, opts ? opts.close === undefined ? 1 : opts.close : 1, config);
        };

        that.loading = function (text, opts, callback, css) {
            var config = opts ? opts.configCallback ? opts.configCallback() : "" : "";
            tipsFun(text, opts, {src: "jBox/loading.gif"}, callback, 0, css, opts ? opts.close === undefined ? 0 : opts.close : 0, config);
        };

        that.confirm = function (text, opts, css) {
            var config = opts ? opts.configCallback ? opts.configCallback() : "" : "";
            var icon = !opts.icon ? false : opts.icon;
            var iconObj = $.extend({}, that.opt.icon, icon);
            tipsFun(text, opts, iconObj, null, 1, css, 0, config);
        };

        that.btnAlert = function (text, opts, css) {
            var config = opts ? opts.configCallback ? opts.configCallback() : "" : "";
            var icon = !opts.icon ? false : opts.icon;
            var iconObj = $.extend({}, that.opt.icon, icon);
            tipsFun(text, opts, iconObj, null, 1, css, 0, config);
        };

        that.prompt = function (text, opts, optCSS) {
            var opt = $.extend({}, that.opt, opts);
            var css = $.extend({}, defaultCSS, opt.css, optCSS);
            var location = opt.icon.location === undefined ? "" : opt.icon.location;
            var src = opt.icon.src ? location + opt.icon.src : "";
            if (opt.icon.src) {
                _loadImage(src, function () {
                    createHtml(opt, css, isHasTitle(opt), isPromptHtml(text, opt), null, 1, 0);
                });
            } else {
                createHtml(opt, css, isHasTitle(opt), isPromptHtml(text, opt), null, 1, 0);
            }
        };

        that.closeFun = function (callback, ele, type) {
            var $ele = ele || that.opt.diskBar;
            var _type = type || null;
            closeDisk($ele, _type, callback);
        };

        /**
         * 调用提示框
         * @param text 提示文本
         * @param opts  参数
         * @param icon  小图标
         * @param callback  回调
         * @param type  类型  0-tips.1-confirm
         * @param optCSS
         *  @param close
         *  *  @param config
         */
        var tipsFun = function (text, opts, icon, callback, type, optCSS, close, config) {
            var opt = $.extend({}, that.opt, opts, config);
            var css = $.extend({}, defaultCSS, opt.css, optCSS);

            var location = opt.path === undefined ? (!opt.icon.location ? "" : opt.icon.location) : opt.path;
            var src = icon ? (!!opt.icon.src ? location + opt.icon.src : location + icon.src) : "";
            var btnNum = opt.btn.text ? opt.btn.text.length : 0;
            if (icon && icon.src) {
                _loadImage(src, function () {
                    if (type) {
                        createHtml(opt, css, isHasTitle(opt), isHasIcon(text, this.src, !icon.width ? parseInt(css.iconCSS.width) : icon.width, !icon.height ? parseInt(css.iconCSS.height) : icon.height), isHasBtn(opt, btnNum), type, close);
                    } else {
                        createHtml(opt, css, null, isHasIcon(text, this.src, !icon.width ? parseInt(css.iconCSS.width) : icon.width, !icon.height ? parseInt(css.iconCSS.height) : icon.height), null, type, close);
                        if (callback) callback.call(that, opt);
                    }
                });
            } else {
                if (type) {
                    createHtml(opt, css, isHasTitle(opt), isHasIcon(text, null), isHasBtn(opt, btnNum), type, close);
                } else {
                    createHtml(opt, css, null, isHasIcon(text, null), null, type, close);
                    if (callback) callback.call(that, opt);
                }
            }
        };
    };

    var _clear_setTimeout_ = 0;

    /**
     * 添加HTML到页面
     * @param opt
     * @param css
     * @param t
     * @param c
     * @param b
     * @param type
     * @param close
     */
    function createHtml(opt, css, t, c, b, type, close) {
        t = t ? t : "";
        c = c ? c : "";
        b = b ? b : "";
        var cls = !type ? "j-disk-alert" : "j-disk-confirm";
        var html = '';
        //if (_clear_setTimeout_) clearTimeout(_clear_setTimeout_);
        opt.diskID = "jDisk" + new Date().getTime();

        html += '<div class="j-disk ' + cls + '" id=' + opt.diskID + '>';
        html += '   <div class="j-container animated ' + opt.box.animate + '">';
        html += t;
        html += '       <div class="j-content">' + c + b + '</div>';
        html += '   </div>';
        html += '</div>';
        $(document.body).append(html);

        opt.diskBar = $("#" + opt.diskID);
        opt.boxCont = opt.diskBar.find(".j-container");
        opt.boxContBar = opt.diskBar.find(".j-content");
        opt.boxTitle = opt.diskBar.find(".j-title");
        opt.boxTextBox = opt.diskBar.find(".j-disk-text");
        opt.boxText = opt.diskBar.find(".j-disk-t");
        opt.boxIcon = opt.diskBar.find(".j-disk-icon");
        opt.boxBtn = opt.diskBar.find(".j-btn");
        opt.jEnsure = opt.diskBar.find("#jEnsure");
        opt.jCancel = opt.diskBar.find("#jCancel");
        opt.jClose = opt.diskBar.find(".j-disk-close");
        opt.promptEnsure = opt.diskBar.find("#jPromptEnsure");


        if (opt.beforeClassFun) opt.beforeClassFun.call(opt.diskBar[0], opt);

        if (opt.isMove) {
            opt.boxTitle.on("mousedown", {"opt": opt}, startMove);
        }

        if (opt.boxCls) opt.diskBar.addClass(opt.boxCls);
        var cWidth = opt.boxCont.width();

        if (css) {
            setEleCss(opt, css, opt.boxCont, cWidth, type);

            opt.boxTitle.css(css.titleCSS ? css.titleCSS : "");
            opt.boxContBar.css(css.contCSS ? css.contCSS : "");
            opt.boxTextBox.css(css.textBoxCSS ? css.textBoxCSS : "");
            opt.boxText.css(css.textCSS ? css.textCSS : "");
            //opt.boxIcon.css(css.iconCSS ? css.iconCSS : "");
            opt.jEnsure.css(css.btnCSS.jEnsure ? css.btnCSS.jEnsure : "");
            opt.jCancel.css(css.btnCSS.jCancel ? css.btnCSS.jCancel : "");
            opt.promptEnsure.css(css.btnCSS.jEnsure ? css.btnCSS.jEnsure : "");
        }
        opt.jEnsure.on("click", {"opt": opt}, ensureFun);
        opt.jCancel.on("click", {"opt": opt}, cancelFun);
        opt.jClose.on("click", {"opt": opt}, cancelFun);
        opt.promptEnsure.on("click", {"opt": opt}, jPromptEnsure);

        if (opt.afterClassFun) opt.afterClassFun.call(opt.diskBar[0], opt);

        if (!!close) {
            _clear_setTimeout_ = setTimeout(function () {
                opt.diskBar.fadeOut(300, function () {
                    $(this).remove();
                    opt.closeCallback && opt.closeCallback.call();
                });
            }, opt.time);
        }
    }

    /**
     * 是否包含小图标
     * @param text
     * @param icon
     * @param w
     * @param h
     * @returns {string}
     */
    function isHasIcon(text, icon, w, h) {
        var html = '';
        if (icon) {
            html += '<div class="j-disk-text j-disk-img">';
            html += '<i class="j-disk-icon"  style="width:' + w + 'px; height:' + h + 'px"><img src="' + icon + '"></i>';
            html += '<div class="j-disk-t">' + text + '</div>';
            html += '</div>';
        } else {
            html += '<div class="j-disk-text">';
            html += '<div class="j-disk-t">' + text + '</div>';
            html += '</div>';
        }
        return html;
    }

    /**
     * 是否包含title
     * @param opt
     * @returns {string}
     */
    function isHasTitle(opt) {
        var close = opt.hasClose ? "<a class='j-disk-close' href='javascript:;'>&times;</a>" : "";
        if (opt.title) return '<h2 class="j-title"><span>' + opt.title + '</span>' + close + '</h2>';
        else return '';
    }

    /**
     * 是否包含按钮
     * @param opt
     * @param type
     * @returns {string}
     */
    function isHasBtn(opt, type) {
        var html = "";
        if (type == 1) {
            html += '<div class="j-btn j-btn-one clearfix">';
            html += '   <a class="j-ensure" id="jEnsure" href="javascript:;">' + opt.btn.text[0] + '</a>';
            html += '</div>';
        } else if (type == 2) {
            html += '<div class="j-btn j-btn-two clearfix">';
            html += '   <a class="j-ensure" id="jEnsure" href="javascript:;">' + opt.btn.text[0] + '</a>';
            html += '   <a class="j-cancel" id="jCancel" href="javascript:;">' + opt.btn.text[1] + '</a>';
            html += '</div>';
        }
        return html;
    }

    /**
     * prompt模式
     * @param text
     * @param opt
     * @returns {string}
     */
    function isPromptHtml(text, opt) {
        var html = "";
        html += '<div class="j-disk-prompt clearfix">';
        html += '   <label>' + text + '</label>';
        html += '   <span><input type="text" placeholder="请输入文本信息" value=""></span>';
        html += '   <a id="jPromptEnsure" href="javascript:;">' + opt.btn.text + '</a>';
        html += '</div>';
        return html;
    }

    /**
     * 设置标签样式
     * @param opt
     * @param css
     * @param ele
     * @param width
     * @param type
     */
    function setEleCss(opt, css, ele, width, type) {
        var w, h;
        if (!opt.width) {
            if (width >= 560) {
                w = "560px";
            } else {
                if (type) {
                    w = Math.ceil(width);
                } else {
                    w = Math.ceil(width + 1);
                }
            }
        } else {
            w = opt.width;
        }

        var marginLeft = parseInt(w) / 2;
        ele.css("width", w);
        if (opt) h = opt.height ? opt.height : ele.height();
        var pos = opt.isFlow ? "fixed" : "absolute";
        if (opt.isVertical) {
            ele.css({
                "position": pos,
                "width": w,
                "height": h,
                "margin": "-" + parseInt(h) / 2 + "px 0 0 -" + marginLeft + "px"
            });
        } else {
            ele.css({
                "position": pos,
                "width": w,
                //"height": h,
                "top": opt.top,
                "margin": "0 0 0 -" + marginLeft + "px"
            });
        }
    }

    /**
     * 加载图片
     * @param src
     * @param callback
     * @private
     */
    function _loadImage(src, callback) {
        var img = new Image();
        img.onload = function () {
            var real_width = img.width;
            var real_height = img.height;
            if (callback) callback.call(img, real_width, real_height);
        };
        img.onerror = function () {
            console.log("图片加载错误，错误图片：" + img.src);
            if (callback) callback.call(img);
        };
        img.src = src;
    }

    function ensureFun(e) {
        var evt = e || window.event;
        var opt = evt.data.opt;
        var self = this;
        closeDisk(opt.diskBar, opt.btn.closeType, function () {
            if (opt.btn.jEnsure) opt.btn.jEnsure.call(self, opt);
            /*setTimeout(function () {
                if (opt.closeCallback) opt.closeCallback.call(self, opt);
            }, 300);*/
        }, function () {
            if (opt.ensureBefore) opt.ensureBefore.call(self, opt);
        });
    }

    function cancelFun(e) {
        var evt = e || window.event;
        var opt = evt.data.opt;
        var self = this;
        closeDisk(opt.diskBar, 1, function () {
            if (opt.btn.jCancel) opt.btn.jCancel.call(self, opt);
        }, function () {
            if (opt.closeCallback) opt.closeCallback.call(self, opt);
        });
    }

    function jPromptEnsure(e) {
        var evt = e || window.event;
        var opt = evt.data.opt;
        var that = this;
        closeDisk(opt.diskBar, opt.btn.closeType, function () {
            if (opt.btn.jEnsure) opt.btn.jEnsure.call(that);
        }, function () {
            if (opt.ensureBefore) opt.ensureBefore.call(that, opt);
        });
    }

    function closeDisk(ele, type, callback, closeFun) {
        var $ele = ele || $("#jDisk");
        type = type || 1;
        if (type == 3) {
            if (closeFun) closeFun.call(ele[0]);
            if (callback) callback.call(ele[0]);
        } else if (type == 1) {
            $ele.fadeOut(300, function () {
                if (closeFun) closeFun.call(this);
                $(this).remove();
                if (callback) callback.call(this);
            });
        } else if (type == 2) {
            //clearTimeout(_clear_setTimeout_);
            _clear_setTimeout_ = setTimeout(function () {
                $ele.fadeOut(300, function () {
                    if (closeFun) closeFun.call(this);
                    $(this).remove();
                    if (callback) callback.call(ele[0]);
                });
            }, opt.time);
        }
    }

    var saveData = {}, _isMoved_ = false;

    function startMove(e) {
        e = e || window.event;
        e.stopPropagation();
        e.preventDefault();
        var opt = e.data.opt;
        saveData.startX = e.clientX || e.pageX;
        saveData.startY = e.clientY || e.pageY;
        saveData.top = parseFloat($(this).parents(".j-container").css("top"));
        saveData.left = parseFloat($(this).parents(".j-container").css("left"));
        if (!_isMoved_) {
            _isMoved_ = true;
            $(document).on("mousemove", {opt: opt}, moving);
            $(document).on("mouseup", {opt: opt}, endMove);
        }
    }

    function moving(e) {
        e = e || window.event;
        e.stopPropagation();
        e.preventDefault();
        var opt = e.data.opt;
        var x = e.clientX || e.pageX;
        var y = e.clientY || e.pageY;
        if (_isMoved_) {
            var mx = x - saveData.startX + saveData.left;
            var my = y - saveData.startY + saveData.top;
            if (opt.isLimit) {
                if (my < 0 || my > $(window).height() - 50) return false;
                if (mx < 0 || mx > $(window).width()) return false;
            }
            $(".j-container").css({
                "top": my + "px",
                "left": mx + "px"
            });
        }
    }

    function endMove() {
        _isMoved_ = false;
        $(document).off("mousemove", moving);
        $(document).off("mouseup", endMove);
    }

    $.extend({
        jBox: new diskBox()
    });
})
(jQuery);