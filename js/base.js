//修复PlaceHolder
FB.JPlaceHolder.init();
//滑动
FB.hoverShowFun();
//浮动菜单显示位置
FB.resizeFun(function (w) {
    var $fl_nav = $(".go-top-box");
    if (w < 1400) {
        $fl_nav.css("margin-right", -w / 2 + 20 + "px");
    }
});
//自动执行滚动到顶部
(function (ele) {
    $(ele).click(function () {
        FB.scrollToElement(0);
    });
})("#goTop");

//滚动到第三屏 显示按钮
$(window).scroll(function () {
    var top = $(this).scrollTop();
    if (top >= $(this).height() * 3) {
        $(".go-top-box").show();
    } else {
        $(".go-top-box").hide();
    }
});

//城市字母切换
$(".city-box .title a").click(function () {
    var index = $(this).index();
    $(this).addClass("active").siblings().removeClass("active");
    $(this).parents(".city-box").find(".cont .item").eq(index).addClass("active").siblings().removeClass("active");
});

$(".city-box .cont a").click(function () {
    //$("#cityName").text($(this).text());
    $(this).parents(".fn-hover-bar").removeClass("active");
});


//显示更多城市
$("#showMoreCity").click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    $.jBox.btnAlert($("#moreCityList").html(), {
        title: "选择城市",
        close: true,
        width: 740,
        boxCls: "j-box-more-city-list",
        beforeClassFun: function (opt) {
            var $cityContainer = $("#moreCityContainer");
            opt.boxTitle.css("padding-bottom", 0);
            var str = "", k = 0;
            for (var i = 0; i < 40; i++) {
                if (i % 10 === 0) {
                    str += "<div class='city-col clearfix'>";
                    for (var j = 0; j < 10; j++) {
                        str += "<a href='javascript:;'>北京" + k + j + "</a>";
                    }
                    str += "</div>";
                    k++;
                }
            }
            $cityContainer.append(str);
            $cityContainer.find("a").click(function () {
                var left = $(this).position().left;
                var width = $(this).outerWidth(true);
                var html = "";
                $(this).siblings().removeClass("active");
                $(this).addClass("active").parents("div.city-col").siblings().find("a").removeClass("active");
                $(".more-city-list").remove();
                html += "<div class='more-city-list'>";
                html += "<span class='arrow'><i class='fb-arrow-dir top'><em></em></i></span>";
                for (var i = 0; i < 32; i++) {
                    html += "<a href='javascript:;'>" + $(this).text() + i + "</a>";
                }
                html += "</div>";
                $(this).parents("div.city-col").append(html);
                $(this).parents("div.city-col").find(".arrow").css("left", (left + width) - 12);
            });
        }
    });
});


//清除文字
$(".clean > input").focus(function () {
    if (!$(this).attr("readonly")) {
        $(this).next().show();
        $(this).parent().removeClass("error");
    }
}).blur(function () {
    if (!$(this).val()) {
        $(this).next().hide();
    }
});
$(".clean-btn").each(function () {
    FB.clearText(this, $(this).prev());
});


/**
 * 头像上传
 * 静态模拟过程
 * @param option
 * @param type
 */
var $image, canvasData, cropBoxData;
var croppedCanvas, roundedCanvas;
var cropped = false;

function uploadCropperImage(option, type) {
    var html = option.html;
    option.isChange = true;
    $.jBox.confirm(html, {
        top: "10%",
        title: option.title || "上传头像",
        close: true,
        boxCls: "j-box-normal j-box-upload-box",
        btn: {
            closeType: option.verify ? 3 : 3,
            text: ["确定", "取消"],
            jEnsure: function () {
                if ($("#uploadImg").length === 0) {
                    $.jBox.error("请选择上传图片！");
                    return false;
                }
                var newImgURL = option.isChange ? roundedCanvas.toDataURL() : option.imgUrl;
                option.ensureFun && option.ensureFun.call(this, $image, newImgURL, option);
            }
        },
        ensureBefore: function () {
            if ($("#uploadImg").length === 0) return false;
            option.ensureBefore && option.ensureBefore.call(this, $image, option);
            //裁剪图片
            if (option.isChange) {
                croppedCanvas = $image.cropper("getCroppedCanvas");
                roundedCanvas = getRoundedCanvas(croppedCanvas, option.type || "radius");
            }
        },
        closeCallback: function () {
            //销毁之前设置剪切参数-保存销毁之前数据
            if (!$image || !cropped) return false;
            $image.cropper("destroy");
            $image = undefined;
            cropped = false;
        },
        beforeClassFun: function () {
            /*判断模式*/
            if (type === "post") {
                uploadImage(option.element, function (url) {
                    $(this).parents(".upload-tips").parent().append('<label class="upload-img"><img id="uploadImg" src="' + url + '"></label>');
                    initCropper();
                });
            } else if (type === "get") {
                $(option.element).parents(".upload-tips").parent().append('<label class="upload-img"><span class="fb-loading-bar"><i></i></span></label>');
                $(option.element).parents(".upload-tips").remove();
                /*$(option.element).parents(".upload-tips").parent().append('<label class="upload-img"><img id="uploadImg" src="' + option.imgUrl + '"></label>');
                initCropper();*/
                var img = new Image();
                img.onload = function () {
                    $(".fb-loading-bar").hide();
                    var new_img = getRoundedCanvas(img, "rect");
                    $(".upload-img").append('<img class="crossOrigin" id="uploadImg" src="' + new_img.toDataURL() + '">');
                    initCropper();
                };
                img.onerror = function () {
                    console.log("图片加载错误！");
                };
                img.crossOrigin = "anonymous";
                img.src = option.imgUrl;
            }
            option.initFun && option.initFun.call();
        }
    });

    function initCropper() {
        $(option.element).parents(".upload-tips").remove();
        $(".view-handle").removeClass("d-hide");
        //初始化cropper
        $image = $("#uploadImg");
        if (!$image) return false;
        cropperInit(".view-handle", option.type || "radius", option.cropper || {}, function () {
            option.cropper_width = $image.cropper("getCropBoxData").width;
        });
    }

    //格式转换
    function convertBase64UrlToBlob(urlData) {
        //去掉url的头，并转换为byte
        var bytes = window.atob(urlData.split(',')[1]);
        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], {type: 'image/png'});
    }
}

//头像上传剪切-cropper
function cropperInit(btn, type, opts, callback) {
    var defaults = {
        viewMode: 2,
        dragMode: "move",
        checkCrossOrigin: false,
        ready: function () {
            cropped = true;
            callback && callback.call();
        }
    };

    var options = {};
    if (type === "radius") {
        options = {
            aspectRatio: 1,
            preview: ".preview-box .img",
            autoCropArea: 0.8
        };
    } else if (type === "rect") {
        options = {
            aspectRatio: 1,
            autoCropArea: 1
        };
    }

    var opt = $.extend({}, defaults, options, opts);
    $image.cropper(opt);

    //按钮操作
    $(btn).on("click", "[data-method]", function () {
        var $this = $(this);
        var data = $this.data();
        var cropper = $image.data("cropper");
        if ($this.prop("disabled") || $this.hasClass("disabled")) {
            return;
        }
        if (cropper && data.method) {
            data = $.extend({}, data);
            $image.cropper(data.method, data.option);
        }
    });
    //重新选择图片绑定
    var $inputImage = $("#resetImage");
    uploadImage($inputImage[0], function (url) {
        $image.cropper('destroy').attr('src', url).cropper(opt);
    });
}

//canvas裁剪图片
function getRoundedCanvas(sourceCanvas, type) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.beginPath();
    if (type === "radius") {
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
    } else if (type === "rect") {
        context.rect(0, 0, width, height);
    }
    context.strokeStyle = 'rgba(0,0,0,0)';
    context.stroke();
    context.clip();
    context.drawImage(sourceCanvas, 0, 0, width, height);

    return canvas;
}

//上传image-window.URL
function uploadImage(input, callback) {
    var URL = window.URL || window.webkitURL;
    var $inputImage = $(input);
    var uploadedImageType = 'image/jpeg';
    var uploadedImageURL;
    if (URL) {
        $inputImage.change(function () {
            var files = this.files;
            var file;
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type) && !file.name.match(/.gif$/)) {
                    uploadedImageType = file.type;
                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    uploadedImageURL = URL.createObjectURL(file);
                    callback && callback.call($inputImage[0], uploadedImageURL);
                } else {
                    $.jBox.error("只支持JPG,PNG格式的图片！");
                }
            }
        });
    } else {
        $.jBox.error("该浏览器不支持window.URL");
    }
}

/**
 * 换一换
 * @param element   父辈元素
 * @param child     儿子元素
 * @param btn   点击按钮
 * @param num   显示数量
 * @returns {boolean}
 */
function changeSlide(element, child, btn, num) {
    var row_num = num;
    var change_num = row_num;
    var _is_moving = false;
    var $ele = $(element);
    var item = $ele.find(child);
    var item_length = item.length;
    var item_height = item.height();
    var item_width = item.width();
    var move_num = item_length % change_num;
    var i = 0, rows = Math.floor(item_length / change_num) - 1;
    if (item_length < 3) {
        return false;
    }
    //克隆
    FB.cloneFun($ele, item, change_num, "append");
    var $newItem = $ele.find(child);
    $newItem.width($ele.width() / row_num);

    $ele.css({
        "width": $ele.find(child).length * item_width + 5,
        //"height": item_height,
        "left": "0px",
        "overflow": "hidden"
    });

    $(btn).click(function (e) {
        e.stopPropagation();
        if (_is_moving) return false;
        _is_moving = true;
        var num = i < (rows + 1) ? (change_num) : (move_num + change_num);
        $ele.stop(true, true).animate({"left": -item_width * num}, 500, function () {
            _is_moving = false;
            if (num == item_length) {
                $(this).css("left", "0px");
                i = 0;
                change_num = 3;
            } else {
                if (i < (rows)) {
                    change_num = change_num + 3;
                }
                i++;
            }
        });
    });
}

/*播放视频*/
function playVideo(obj) {
    closeVideo();
    $(".play_video_dialog").css('display', 'block');
    var videoBaseURL = "http://19area-output-bucket.oss-cn-hangzhou.aliyuncs.com/Act-ss-mp4-hd/";
    var player = videojs('play-video');
    var videoURL = $(obj).attr("data-video-url");
    var src = videoBaseURL + videoURL + ".mp4";
    console.log(src);
    player.src(src);

    videojs("play-video").ready(function () {
        var player = this;
        player.play();
    });
}

function closeVideo() {
    $(".play_video_dialog").css('display', 'none');
    var player = videojs('play-video');
    var video = $("video");
    video[0].currentTime = 0;
    player.pause();
}
