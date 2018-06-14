//声明FB函数对象集合
var FB = window.Global = window.Global || {};
//声明FB集合属性
FB.verifyExp = {
    telephone: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
    telCode: /^[0-9]{6}$/,
    strengthA: {
        number: /^[0-9]+$/,
        letterCaps: /^[A-Z]+$/,
        letterLows: /^[a-z]+$/,
        symbol: /^\W+$/
    },
    strengthB: {
        numLetterA: /^(([0-9]+[a-z]+)|([a-z]+[0-9]+))[0-9a-z]*$/,
        numLetterB: /^(([0-9]+[A-Z]+)|([A-Z]+[0-9]+))[0-9A-Z]*$/,
        numSymbol: /^((\W+[0-9]+)|([0-9]+\W+))[\W0-9]*$/,
        LetterALetterB: /^(([A-Z]+[a-z]+)|([a-z]+[A-Z]+))[A-Za-z]*$/,
        LetterASymbol: /^((\W+[a-z]+)|([a-z]+\W+))[\Wa-z]*$/,
        LetterBSymbol: /^((\W+[A-Z]+)|([A-Z]+\W+))[\WA-Z]*$/
    }
};
FB.win = window;
FB.$win = $(window);
/**
 * 验证form表单
 * @param val   输入验证的值
 */
FB.testForm = {
    /**
     * 验证手机号
     * @param val
     * @returns {number}0-空，1-大于11位，2-验证通过，3-格式不对
     */
    phone: function (val) {
        var _val = val;
        var _length = _val.length;
        if (_length == 0) return 0;
        if (_length > 11) return 1;
        if (eval(FB.verifyExp.telephone).test(_val)) {
            return 2;
        } else {
            return 3;
        }
    },
    /**
     * 验证密码
     * @param val
     * @param options 设置错误文本
     * @returns {object}
     */
    password: function (val, options) {
        var defaults = {
            isSimple: true,    //开启简单密码检验
            isCaps: true,  //开启键盘大写验证
            isShift: false,   //开启Shift按键验证
            showTag: true, //开启小tag提示
            minLength: 6,
            simpleLength: 6,
            strongLength: 12,
            nullText: "密码不能为空！",
            lengthLess: "密码不能小于6位！",
            successText: "设置密码成功！",
            capsText: "注意：键盘大写锁定已打开，请注意大小写！",
            shiftText: "注意：您按住了Shift键",
            psdSimple: "密码太简单，有被盗风险，请换复杂的密码组合！"
        };
        var opt = $.extend({}, defaults, options);
        var l = val.toString().length;
        var resultOPT = {};
        if (l == 0) {
            resultOPT.type = 0;
            resultOPT.text = opt.nullText;
        } else if (l < opt.minLength) {
            resultOPT.type = 0;
            resultOPT.text = opt.lengthLess;
        } else {
            if (eval(FB.verifyExp.strengthA.number).test(val) || eval(FB.verifyExp.strengthA.letterCaps).test(val) || eval(FB.verifyExp.strengthA.letterLows).test(val) || eval(FB.verifyExp.strengthA.symbol).test(val)) {
                //弱
                if (!opt.isSimple) {
                    resultOPT.type = 1;
                    resultOPT.text = opt.successText;
                } else {
                    //等于简单长度
                    if (l == opt.simpleLength) {
                        resultOPT.type = 0;
                        resultOPT.text = opt.psdSimple;
                    } else {
                        resultOPT.type = 1;
                        resultOPT.text = opt.successText;
                    }
                }
            } else if (eval(FB.verifyExp.strengthB.numLetterA).test(val) || eval(FB.verifyExp.strengthB.numLetterB).test(val) || eval(FB.verifyExp.strengthB.numSymbol).test(val) || eval(FB.verifyExp.strengthB.LetterALetterB).test(val) || eval(FB.verifyExp.strengthB.LetterASymbol).test(val) || eval(FB.verifyExp.strengthB.LetterBSymbol).test(val)) {
                if (l == opt.strongLength) {
                    //强
                    resultOPT.type = 3;
                    resultOPT.text = opt.successText;
                } else {
                    //中
                    resultOPT.type = 2;
                    resultOPT.text = opt.successText;
                }
            } else {
                //强
                resultOPT.type = 3;
                resultOPT.text = opt.successText;
            }
        }
        //回调
        resultOPT.options = opt;
        return resultOPT;
    }
};
//阻止默认事件
FB.preventFun = function (e) {
    var evt = e || window.event;
    evt.preventDefault();
};
//组织冒泡
FB.propagationFun = function (e) {
    var evt = e || window.event;
    evt.stopPropagation();
};
//改变窗口
FB.resizeFun = function (callback) {
    $(FB.win).resize(function () {
        var width = $(this).width();
        var height = $(this).height();
        if (callback) callback.call(this, width, height);
    }).trigger("resize");
};
//修复PlaceHolder
FB.JPlaceHolder = {
    //检测
    _check: function () {
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init: function () {
        if (!this._check()) {
            this.fix();
        }
    },
    //修复
    fix: function () {
        $('[placeholder]').each(function () {
            var self = $(this), txt = self.attr('placeholder');
            var parent = self.parent();
            if (!self.hasClass("isPlaceholder")) {
                self.addClass("isPlaceholder").parent().css("position", "relative");
                var self_nodeName = self[0].nodeName.toString().toLowerCase();
                var top = self_nodeName == "textarea" ? "23px" : "50%";
                var paddingLeft = parseInt(self.css('padding-left')) > 0 ? self.css('padding-left') : parent.css('padding-left');
                var fontSize = !self.css('font-size') ? parent.css('font-size') : self.css('font-size');
                var holder = $('<span class="placeholder-span"></span>').text(txt).css({
                    position: 'absolute',
                    left: 0,
                    top: top,
                    zIndex: 1001,
                    width: 'auto',
                    height: '30px',
                    lineHeight: '30px',
                    marginTop: '-15px',
                    paddingLeft: paddingLeft,
                    color: '#999999',
                    fontSize: fontSize
                }).appendTo(parent);

                self.focus(function () {
                    holder.hide();
                }).blur(function () {
                    if (!self.val()) {
                        holder.show();
                    }
                });
                holder.click(function () {
                    holder.hide();
                    self.focus();
                });
            }
        });
    }
};
/**
 * 添加函数名称
 * @param name 函数名称
 * @param callback  函数方法
 * @returns {FB.addFun} 当前对象
 * @constructor
 */
FB.addFun = function (name, callback) {
    window[name] = callback;
    return this;
};
/**
 * 克隆元素
 * @param parent 添加元素
 * @param ele 克隆元素
 * @param num  克隆数量
 * @param type  向后（append）/向前（prepend）
 * @returns {*}
 */
FB.cloneFun = function (parent, ele, num, type) {
    if (num) {
        for (var i = 0; i < num; i++) {
            if (type == "append") {
                parent.append(ele.eq(i).clone().addClass("clone"));
            } else if (type == "prepend") {
                parent.prepend(ele.eq(ele.length - 1 - i).clone().addClass("clone"));
            }
        }
    } else return ele.clone();
};
/**
 * 显示滑动动画
 * @param dom   触发元素
 * @param tag   显示元素
 */
FB.animateTransform = {
    show: function (dom, tag, callback) {
        $(document).on("click", dom, function () {
            $(tag).addClass("active");
            if (callback) callback.call(tag);
        });
    },
    hide: function (dom, tag, callback) {
        $(document).on("click", dom, function () {
            $(tag).removeClass("active");
            if (callback) callback.call(tag);
        });
    }
};
/**
 * 滑动切换显示
 * @param ele   出发元素
 * @param tag   响应元素
 * @param animate   切换动画（可以是函数）
 */
FB.hoverShowFun = function (ele, tag, animate) {
    var _ele = !ele ? ".fn-hover-bar" : ele;
    var _tag = !tag ? ".fn-hover-menu" : tag;
    $(_ele).hover(function (e) {
        var $tag = $(this).addClass("active").find(_tag);
        FB.propagationFun(e);
        if (!animate) $tag.show();
        else {
            if (animate.show) animate.show.call($tag[0]);
            else $tag.show();
        }

        $(this).parents(".fn-hover-box").css({
            "position": "relative",
            "z-index": "9999"
        });

        var left = $tag.length != 0 && $tag.offset().left;
        var width = $tag.length != 0 && $tag.outerWidth(true);

        if (left <= 0) {
            if ($(this).offset().left !== 0) {
                $tag.css({
                    left: "0",
                    marginLeft: -$(this).offset().left,
                    right: "auto"
                });
            } else {
                $tag.css({
                    left: "0",
                    marginLeft: "0",
                    right: "auto"
                });
            }
            return false;
        }
        if (left + width >= FB.$win.width()) {
            $tag.css({
                left: "auto",
                right: "0",
                marginRight: "0"
            });
            return false;
        }
    }, function (e) {
        var $tag = $(this).removeClass("active").find(_tag);
        FB.propagationFun(e);
        if (!animate) $tag.hide();
        else {
            if (animate.hide) animate.hide.call($tag[0]);
            else $tag.hide();
        }
        $tag.removeAttr("style");
        $(this).parents(".fn-hover-box").removeAttr("style");
    });
};
/**
 * 给元素加样式
 * @param ele   动画元素
 * @param cls   样式名称
 */
FB.elementAddCls = function (ele, cls) {
    cls = cls || "active";
    return {
        show: function () {
            $(ele).addClass(cls);
        },
        hide: function () {
            $(ele).removeClass(cls);
        },
        toggle: function () {
            $(ele).toggleClass(cls);
        }
    }
};
/**
 * 调用Swiper
 * @param ele   元素
 * @param type  类型，1：轮播，2：横向滑动，3：竖直滑动
 * @param option 自定义参数
 */
FB.newSwiper = function (ele, type, option) {
    var opt = "";
    if (type == 1) {
        opt = {
            autoplay: 4000,
            pagination: ".swiper-pagination",
            loop: true,
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else if (type == 2) {
        opt = {
            slidesPerView: 4,
            //loopedSlides: 5,
            centeredSlides: false,
            lazyLoading: true,
            watchSlidesVisibility: true,
            loop: true
        }
    } else if (type == 3) {
        opt = {
            direction: 'vertical',
            freeMode: true,
            slidesPerView: "auto",
            lazyLoading: true,
            watchSlidesVisibility: true
        }
    } else if (type == 4) {
        opt = {
            pagination: ".swiper-pagination",
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else if (type == 5) {
        opt = {
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else {
        opt = {};
    }
    var newOpt = $.extend({preventClicks: false}, opt, option);
    return new Swiper(ele, newOpt);
};

/**
 * 实例化sliderBox
 * @param ele
 * @param type
 * @param opt
 */
function newSliderBox(ele, type, opt) {
    var opts = $.extend({}, opt);
    $(ele).sliderBox(type, opts);
}

/**
 * 滚动到元素
 * @param ele   可以省略-默认"html,body"
 * @param top
 * @param callback
 */
FB.scrollToElement = function (ele, top, callback) {
    if ((typeof ele).toString().toLocaleLowerCase() !== "string") {
        callback = arguments[1];
        top = arguments[0];
        ele = "html,body";
    }
    $(ele).animate({"scrollTop": top + "px"}, 300, function () {
        if (callback) callback.call(this);
    });
};
/**
 * 数字加减法
 * @param tag
 * @param maxNum
 * @param minNum
 * @param type   add加法   cut减法
 * @param callback
 */
FB.numberCalculate = function (tag, maxNum, minNum, type, callback) {
    var _num = parseInt(tag.find("input").val());
    var _max = maxNum;
    if (type == "add") {
        if (tag.find("input").val() == "") {
            tag.find("input").val(minNum);
        } else {
            _num++;
            if (_num == (_max + 1)) {
                tag.find("input").val(_max);
            } else {
                tag.find("input").val(_num);
                if (callback) callback.call(tag[0], _num, _max);
            }
        }
    } else if (type == "cut") {
        if (tag.find("input").val() == "") {
            tag.find("input").val(minNum);
        } else {
            _num--;
            if (_num == 0) {
                tag.find("input").val(minNum);
            } else {
                tag.find("input").val(_num);
                if (callback) callback.call(tag[0], _num);
            }
        }
    }
};
/**
 * 计算图片大小
 * @param w 获取图片宽度
 * @param h 获取图片的高度
 * @param referW    参考宽度
 * @param referH    参考高度
 * @returns {{w,h}} 返回计算后大小
 */
FB.countImgSize = function (w, h, referW, referH) {
    var _w = referW || $(window).width();
    var _h = referH || $(window).height();
    var __w, __h;
    if (w >= h) {
        __w = _w;
        __h = _w / (w / h);
        if (__h > _h) {
            __h = _h;
            __w = __h * (w / h);
        }
    } else if (w < h) {
        __h = _h;
        __w = _h * (w / h);
        if (__w > _w) {
            __w = _w;
            __h = _w / (w / h);
        }
    }
    return {w: __w, h: __h};
};
/**
 * 设置图片元素的大小
 * @param imgEle
 * @param referW
 * @param referH
 * @param imgW
 * @param imgH
 * @param type
 */
FB.setImageLayout = function (imgEle, referW, referH, imgW, imgH, type) {
    var $img = $(imgEle);
    var ceil_w = Math.ceil(referW);
    var ceil_h = Math.ceil(referH);
    var w = imgW || $img.width();
    var h = imgH || $img.height();
    var width, height, top, left;
    var _type = type || "all";
    if (_type == "width") {
        width = ceil_w;
        height = Math.ceil(ceil_w / w * h);
        top = -Math.floor((height - ceil_h) / 2);
        left = 0;
    } else if (_type == "height") {
        height = ceil_h;
        width = Math.ceil(ceil_h * w / h);
        top = 0;
        left = -Math.floor((width - ceil_w) / 2);
    } else if (_type == "all") {
        var size = FB.countImgSize(w, h, ceil_w, ceil_h);
        width = size.w;
        height = size.h;
        top = -Math.floor((height - ceil_h) / 2);
        left = -Math.floor((width - ceil_w) / 2);
    }
    if (imgEle) {
        $img.css({
            "width": width + "px",
            "height": height + "px",
            "margin-top": top + "px",
            "margin-left": left + "px"
        });
    } else {
        return {
            "width": width + "px",
            "height": height + "px",
            "margin-top": top + "px",
            "margin-left": left + "px"
        }
    }
};
/**
 * 补零
 * @param num 补零的数字
 * @param n 补零的位数
 * @returns {string}   补零之后的字符
 */
FB.padZero = function (num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
};
/**
 * 提取字符串中的小数
 * @param str
 * @returns {Number}
 */
FB.numberStr = function (str) {
    var leftStr = str.split(".")[0];
    var rightStr = str.split(".").slice(1).join(".");
    var integer = leftStr.replace(/[^0-9]/ig, "");
    var float = rightStr.replace(/[^0-9]/ig, "");
    var newNum = integer + "." + float;
    return parseFloat(newNum);
};
/**
 * 获取当前时间
 * @param type
 * @returns {string}
 */
FB.getNowTime = function (type) {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    var h = myDate.getHours();
    var m = myDate.getMinutes();
    var s = myDate.getSeconds();

    switch (type) {
        case "timeAll":
            return FB.padZero(h, 2) + ':' + FB.padZero(m, 2) + ":" + FB.padZero(s, 2);
            break;
        case "date":
            return year + '-' + FB.padZero(month, 2) + "-" + FB.padZero(date, 2);
            break;
        case "timeSimple":
            return FB.padZero(h, 2) + ':' + FB.padZero(m, 2);
            break;
        default:
            return year + '-' + FB.padZero(month, 2) + "-" + FB.padZero(date, 2) + " " + FB.padZero(h, 2) + ':' + FB.padZero(m, 2) + ":" + FB.padZero(s, 2);
            break;
    }
};
/**
 *  显示倒计时
 * @param dom   显示文字的元素
 * @param time   倒计时时间
 * @param finishFun   结束回调
 * @param countFun   倒计时回调
 */
var _countDown_timer_ = 0;
FB.countDown = function (dom, time, format, finishFun, countFun) {
    clearInterval(_countDown_timer_);
    var that = this;
    var _times = !time ? 120 : time;
    var $this = $(dom);
    $this.text(FB.padZero(_times, 2) + format[1]).addClass("active");
    _countDown_timer_ = setInterval(function () {
        countFun && countFun.call(dom, _times);
        _times--;
        if (_times == 0) {
            $this.text(format[0]).removeClass("active");
            clearInterval(_countDown_timer_);
            finishFun && finishFun.call($this);
        } else {
            $this.text(FB.padZero(_times, 2) + format[1]).addClass("active");
        }
    }, 1000);

    that.stopTimeFun = function () {
        clearInterval(_countDown_timer_);
        $this.text(format[0]).removeClass("active");
        finishFun && finishFun.call($this);
    }
};
/**
 * 倒计时(包含天)
 * @param tags   目标
 * @param time
 * @param Fun
 */
FB.dayTimeDown = function (tags, time, Fun) {
    var boxEle, dayEle, hourEle, minEle, secEle, loadEle;
    if ((typeof tags) == "string" || $(tags).data("time")) {
        boxEle = $(tags);
        dayEle = ".time-day";
        hourEle = ".time-hour";
        minEle = ".time-minute";
        secEle = ".time-second";
        loadEle = ".time-loading";
    } else {
        boxEle = $(tags.boxEle);
        dayEle = tags.dayEle;
        hourEle = tags.hourEle;
        minEle = tags.minEle;
        secEle = tags.secEle;
        loadEle = tags.loadEle;
    }

    var dayFormat = (dayEle ? (boxEle.find(dayEle).data("format") ? boxEle.find(dayEle).data("format") : "") : "");
    var hourFormat = (hourEle ? (boxEle.find(hourEle).data("format") ? boxEle.find(hourEle).data("format") : "") : "");
    var minFormat = (minEle ? (boxEle.find(minEle).data("format") ? boxEle.find(minEle).data("format") : "") : "");
    var secFormat = (secEle ? (boxEle.find(secEle).data("format") ? boxEle.find(secEle).data("format") : "") : "");

    var countTime = 0;
    if (time) {
        if ((typeof time) == "number") {
            countTime = time / 1000;
        } else {
            countTime = parseInt((new Date("" + time + "") - new Date()) / 1000);
        }
    } else {
        countTime = parseInt((new Date("" + boxEle.data("time") + "") - new Date()) / 1000);
    }
    var int_day, int_hour, int_minute, int_second;
    var _time;

    if (loadEle) {
        boxEle.find(loadEle).show();
    } else {
        //初始值
        int_day = timeCount(countTime).int_day;
        int_hour = timeCount(countTime).int_hour;
        int_minute = timeCount(countTime).int_minute;
        int_second = timeCount(countTime).int_second;
        showTime(FB.padZero(int_day, 2) + "<em>" + dayFormat + "</em>", FB.padZero(int_hour % 24, 2) + "<em>" + hourFormat + "</em>", FB.padZero(int_minute, 2) + "<em>" + minFormat + "</em>", FB.padZero(int_second, 2) + "<em>" + secFormat + "</em>");
    }

    _time = setInterval(function () {
        if (loadEle) {
            if (boxEle.find(loadEle).css("display") != "none") {
                boxEle.find(loadEle).hide();
            }
        }
        countTime--;
        if (countTime > 0) {
            int_day = timeCount(countTime).int_day;
            int_hour = timeCount(countTime).int_hour;
            int_minute = timeCount(countTime).int_minute;
            int_second = timeCount(countTime).int_second;
        } else {
            int_day = 0;
            int_hour = 0;
            int_minute = 0;
            int_second = 0;
            if (Fun) Fun.call(boxEle[0]);
            clearInterval(_time);
        }
        showTime(FB.padZero(int_day, 2) + "<em>" + dayFormat + "</em>", FB.padZero(int_hour % 24, 2) + "<em>" + hourFormat + "</em>", FB.padZero(int_minute, 2) + "<em>" + minFormat + "</em>", FB.padZero(int_second, 2) + "<em>" + secFormat + "</em>");
    }, 1000);

    function showTime(day, hour, min, sec) {
        if (dayEle) boxEle.find(dayEle).html(day);
        if (hourEle) boxEle.find(hourEle).html(hour);
        if (minEle) boxEle.find(minEle).html(min);
        if (secEle) boxEle.find(secEle).html(sec);
    }

    function timeCount(time) {
        var timeObj = {};
        timeObj.int_day = Math.floor(time / 60 / 60 / 24);
        timeObj.int_hour = Math.floor(time / (60 * 60));
        timeObj.int_minute = Math.floor(time / 60) - (int_hour * 60);
        timeObj.int_second = Math.floor(time) - (int_hour * 60 * 60) - (int_minute * 60);
        return timeObj;
    }

    return _time;
};
/**
 * 图片加载
 * @param imgElement    图片元素
 * @param checkForComplete  是否需要加载
 * @param src   路径
 * @param callback
 */
FB.loadImages = function (imgElement, checkForComplete, src, callback) {
    var image;

    //回调函数
    function onReady() {
        if (callback) callback();
    }

    //图片加载没完成
    if (!imgElement.complete || !checkForComplete) {
        if (src) {
            image = new window.Image();
            image.onload = function () {
                console.log("图片加载成功！");
                var realWidth = image.width;
                var realHeight = image.height;
                if (callback) callback.call(image, realWidth, realHeight);
            };
            image.onerror = function () {
                console.log("图片加载失败，路径：" + image.src);
                if (callback) callback();
            };
            if (src) {
                image.src = src;
            }
        } else {
            onReady();
        }
    } else {
        onReady();
    }
};
/**
 * 获取页面URL中的参数
 * @param name
 * @returns {null}
 */
FB.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
};
/**
 * 设置进度掉
 * @param options
 */
FB.progressBox = function (options) {
    var defOpt = {
        element: {
            container: ".fb-progress",
            text: ".meter",
            runner: ".runner"
        },
        textMove: false,    //文字是否跟随移动
        number: "0",
        time: 1000
    };
    var option = $.extend({}, defOpt, options);
    var ele = option.element;
    var $progress = $(ele.container);
    var $text = !$progress.find(ele.text).length ? $(ele.text) : $progress.find(ele.text);
    var $run = $progress.find(ele.runner);
    var _clear_timer_ = 0, num = 0;
    var time = option.time ? option.time : 0;
    var interval = time / 60;
    var that = this;
    clearInterval(_clear_timer_);
    $progress.addClass("running");
    var timeFun = function () {
        if (num <= parseInt(option.number)) {
            $text.html(num.toString() + (option.format ? option.format : "%"));
            $run.css("width", num / 100 * 100 + "%");
            if (option.textMove) $text.css("right", (100 - num) / 100 * 100 + "%");
            num++;
            if (option.startFun) option.startFun.call(that, option);
        } else {
            clearInterval(_clear_timer_);
            $progress.addClass("end").removeClass("running");
            if (option.endFun) option.endFun.call(that, option);
        }
    };
    _clear_timer_ = setInterval(timeFun, interval);
};
/**
 * 模拟下拉列表
 * @param ele
 * @param options
 */
FB.selectBar = function (ele, options) {
    var that = this;
    var opt = $.extend({}, options);
    var cls = opt.cls ? opt.cls : "fb-select-bar";
    var $ele = $(ele);
    var $select = $ele.find("select");
    var str = "", l = $select.find("option").length;
    for (var i = 0; i < l; i++) {
        str += '<li><a data-val="' + $select.find("option").eq(i).val() + '">' + $select.find("option").eq(i).text() + '</a></li>';
    }

    if (!opt.body) {
        $ele.addClass(cls).append("\
        <label class=\"text def\">" + $select.find("option:selected").text() + "</label>\
        <b class=\"fb-arrow-dir down\"></b>\
        <div class=\"list\"><ul></ul></div>\
         ");
        $ele.find("label.text").data("val", $select.find("option:selected").val());
        $ele.find(".list").width($ele.outerWidth(true) + 30).find("ul").append(str).hide();
        $select.hide();
    } else {
        $ele.addClass(cls).append("\
        <label class=\"text def\">" + $select.find("option:selected").text() + "</label>\
        <b class=\"fb-arrow-dir down\"></b>\
         ");
        $ele.find("label.text").data("val", $select.find("option:selected").val());
        $(document.body).append("<div class=\"list fb-select-list " + $ele.data("list") + "\"><ul></ul></div>");
        var $list = $("." + $ele.data("list"));
        $list.width($select.outerWidth(true) + 30).find("ul").append(str).hide();
        $select.hide();
        $list.css({"top": $ele.offset().top + $ele.outerHeight(true) + 5, "left": $ele.offset().left});
    }


    $ele.click(function (e) {
        var evt = e || window.event;
        evt.stopPropagation();
        $(".fb-select-bar .list ul").not($(this).find(".list ul")[0]).removeClass("active").hide();
        if (!opt.body) {
            $ele.find(".list ul").toggleClass("active").toggle();
        } else {
            $("." + $ele.data("list")).find("ul").toggleClass("active").toggle();
        }
    });

    $select.click(function (e) {
        var evt = e || window.event;
        evt.stopPropagation();
    });

    $(document).on("click", function (e) {
        var evt = e || window.event;
        evt.stopPropagation();
        var $target = $(evt.target);

        if (!$target.hasClass(cls) && !$target.parents("." + cls).hasClass(cls)) {
            if (!opt.body) {
                $ele.find(".list ul").removeClass("active").hide();
            } else {
                $("." + $ele.data("list")).find("ul").removeClass("active").hide();
            }
        }
    });

    that.refreshFun = function (ele, list) {
        var $ele = $(ele);
        $(list).css({
            "top": $ele.offset().top + $ele.outerHeight(true) + 5,
            "left": $ele.offset().left,
            "width": $ele.find("select").outerWidth(true) + 30
        });
    };

    that.refreshListFun = function (select, ul) {
        select.parent().find(".text").text(select.find("option:selected").length === 0 ? select.find("option").eq(0).text() : select.find("option:selected").text());
        select.parent().find(".text").data("val", select.find("option:selected").length === 0 ? select.find("option").eq(0).val() : select.find("option:selected").val());
        var str = "";
        for (var i = 0; i < select.find("option").length; i++) {
            str += '<li><a data-val="' + select.find("option").eq(i).val() + '">' + select.find("option").eq(i).text() + '</a></li>';
        }
        ul.empty().append(str);
        selectItem(select.parent());
    };

    function selectItem($ele) {
        if (!opt.body) {
            $ele.find(".list li").click(function (e) {
                var evt = e || window.event;
                evt.stopPropagation();
                $(this).index() == 0 ? $ele.find(".text").addClass("def") : $ele.find(".text").removeClass("def");
                $ele.find(".text").text($(this).text()).data("val", $(this).find("a").data("val"));
                $ele.find(".list ul").removeClass("active").hide();
                if (opt.selectCallback) opt.selectCallback.call(this, $(this).text(), $(this).find("a").data("val"));
            });
        } else {
            $("." + $ele.data("list")).find("ul li").click(function (e) {
                var evt = e || window.event;
                evt.stopPropagation();
                $(this).index() == 0 ? $ele.find(".text").addClass("def") : $ele.find(".text").removeClass("def");
                $ele.find(".text").text($(this).text()).data("val", $(this).find("a").data("val"));
                $(this).parents("ul").removeClass("active").hide();
                that.refresh($ele, $("." + $ele.data("list")));
                if (opt.selectCallback) opt.selectCallback.call(this, $(this).text(), $(this).find("a").data("val"));
            });
        }
    }

    selectItem($ele);

    return {
        refresh: function (ele, list) {
            that.refreshFun(ele, list);
        },
        refreshList: function (select, ul) {
            that.refreshListFun(select, ul);
        },
        destroy: function () {
            $ele.off("click");
            $ele.find("label.text").remove();
            $ele.find(".list").remove();
            $ele.find("b.fb-arrow-dir").remove();
        },
        close: function (list) {
            $(list).removeClass("active").hide();
        }
    }
};

/**
 *清楚输入框文字
 * @param tag   点击目标
 * @param clearBox  清楚对象
 * @param type  阻止默认
 */
FB.clearText = function (tag, clearBox, type) {
    $(tag).click(function () {
        if (clearBox[0].nodeName.toLowerCase() == "input" || clearBox[0].nodeName.toLowerCase() == "textarea") {
            clearBox.val("");
        } else {
            clearBox.html("");
        }
        if (!type) {
            clearBox.keyup();
            clearBox.blur();
            $(this).hide();
        }
    });
    if (!type) {
        $(tag)[0].onmousedown = function (e) {
            var event = e || window.event;
            if (document.all) {
                event.returnValue = false;
            } else {
                event.preventDefault();
            }
        };
    }
};

/**
 * 表单按钮组
 * @param ele 元素对象  单选-".fb-radio-box"  复选-”.fb-check-box“
 * @param callback
 */
FB.formChecked = function (ele, callback) {
    var _ele = ele || ".fb-radio-box";
    $(document).on("click", _ele, function (e) {
        e.stopPropagation();
        var type = $(this).find("input").prop("type");
        switch (type) {
            case "radio":
                if ($(this).hasClass(_ele.split(".")[1])) {
                    var name = $(this).find("input").attr("name");
                    $("input[name='" + name + "']").prop("checked", false).parents(_ele).removeClass("active");
                    $(this).addClass("active").find("input").prop("checked", true);
                } else {
                    var $input = $(this).find("input");
                    var $name = $input.attr("name");
                    $("input[name='" + $name + "']").prop("checked", false).parents(_ele).removeClass("active");
                    $input.prop("checked", true).parents(".fb-radio").addClass("active");
                }
                break;
            case "checkbox":
                var that = this;
                $(that).toggleClass("active");
                if ($(that).hasClass("active")) {
                    $(that).find("input").prop("checked", true);
                } else {
                    $(that).find("input").prop("checked", false);
                }
                break;
        }
        if (callback) callback.call($(_ele)[0], $(_ele).find("input").prop("checked"), $(_ele).hasClass("active"));
    });

    $(document).on("click", _ele + " span", function (e) {
        e.stopPropagation();
    });
};

/**
 * 实时获取文本内容
 * @param ele   输入文本
 * @param callback
 */
FB.getInputVal = function (ele, callback) {
    var flag = true;
    var $input = !ele ? $(".input-search-box input") : $(ele);
    $input.on('compositionstart', function () {
        flag = false;
    });
    $input.on('compositionend', function () {
        flag = true;
    });
    $input.on('input', function () {
        var _this = this;
        var _val = $(_this).val();
        setTimeout(function () {
            if (flag) {
                callback && callback.call(_this, _val);
            }
        }, 0)
    });
};

