/* chatbot.js - E-GOV小幫手邏輯腳本 */

// 全域變數宣告 (為了讓動態生成的 HTML onclick 事件能存取)
var city = '';
var fontsize = '';
var role = '';
var privacy = '';
var privacy = '';
var temp = '';
var domain = window.chatbotDomain || '';
var triggerElement = null; // Store query trigger element for focus return

// 工具函式：設定 Cookie
window.setCookie = function (cookieName, cookieValue, exdays) {
    if (document.cookie.indexOf(cookieName) >= 0) {
        var expD = new Date();
        expD.setTime(expD.getTime() + (-1 * 24 * 60 * 60 * 1000));
        var uexpires = "expires=" + expD.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + "; " + uexpires + "; path=/; Secure; SameSite=None";
    }
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + "; " + expires + "; path=/; Secure; SameSite=None";
};

// 工具函式：取得 Cookie
window.getCookie = function (cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return decodeURIComponent(c.substring(name.length, c.length));
    }
    return "";
};

// 工具函式：取得 URL 參數
window.getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// 工具函式：取得當前時間字串
window.getDateString = function () {
    var date = new Date();
    var hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
    var minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var sec = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    return '<span class="time"><span style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;">傳送時間：</span>' + hour + ':' + minute + ':' + sec + '</span>';
};

// 工具函式：新增對話文字到畫面
window.append = function (text) {
    $(text).appendTo($('#words'));
    var objDiv = document.getElementById("words");
    objDiv.scrollTop = objDiv.scrollHeight;
};

// 工具函式：紀錄 Log
window.savelog = function (text) {
    $.ajax({
        type: "get",
        url: domain + '/chatbotlogapi.aspx?type=log&s=' + text,
        cache: true,
        async: false,
        success: function (obj) {
            // console.log('savelog:' + text)
        }
    });
};

// 工具函式：滿意度 Log (動態 HTML 會呼叫此函式)
window.satisfylog = function (a, s, lep, l, type, text) {
    if ($(a).parent().parent().find('.is-active').length == 0) {
        $(a).addClass("is-active");
        $.ajax({
            type: "get",
            url: domain + '/chatbotlogapi.aspx?type=satisfy&s=' + s + '&lep=' + lep + '&l=' + l + "&t=" + type + "&text=" + text,
            cache: true,
            async: false,
            success: function (obj) {
                // console.log success
            }
        });
    }
};

// 工具函式：設定 Radio Check (滿意度調查用)
window.SetCheck = function (val) {
    $("a[ID^='Satisfied']").each(function () {
        $(this).attr("IsChecked", "false");
    });
    $("#Satisfied_" + val).attr("IsChecked", "true");
};

// RequireJS 設定
requirejs.config({
    baseUrl: domain + '/js',
    urlArgs: "version=v2"
});

// 問卷相關邏輯 (如果頁面是 Questionnaire_Content.aspx)
if (document.location.pathname == "/Questionnaire_Content.aspx") {
    $(function () {
        $("#ContentPlaceHolder1_Button1").removeAttr("onclick");
        var targetId = $("#7f4481d4-6c9a-403f-7ff8-3c919bc8416f");
        var scTop = 32767;
        var targetscTop = targetId.offset().top;
        var targetQues = targetId.children(".Question");
        var requiredmessage = targetId.find(".required-message");

        targetId.find(".MultiCheckbox input").change(function () {
            targetQues.removeClass("required");
            requiredmessage.html("");
        });

        function checkOther() {
            var selectedotherLen = targetId.find(".MultiCheckbox .otherOptions input:checked").length;
            var selectothertxt = targetId.find(".MultiCheckbox .otherOptions input[type=text]")[0].value;

            if (selectedotherLen == 1) {
                if (selectothertxt == "其他" || selectothertxt == "其它" || selectothertxt == "") {
                    targetQues.addClass("required");
                    requiredmessage.html("必須填寫其他建議文字");
                    if (scTop > targetscTop) {
                        scTop = targetscTop - 160;
                    }
                    if (scTop < 32767) {
                        $("html, body").animate({ scrollTop: scTop }, 500);
                    }
                } else {
                    if (typeof checkAnswer === 'function') checkAnswer();
                }
            } else {
                if (typeof checkAnswer === 'function') checkAnswer();
            }
        }
        document.getElementById("ContentPlaceHolder1_Button1").addEventListener("click", checkOther);
    });
}

// RWD 裝置判斷與切換邏輯
var useragent = navigator.userAgent.toLowerCase();
if (useragent.indexOf('iphone') != -1) { /* iphone logic */ }
else if (useragent.indexOf('ipad') != -1 || useragent.indexOf('ipod') != -1) { /* ipad logic */ }
else if (useragent.indexOf('android') != -1) {
    function ConsiderLimits() {
        if (screen.width >= 1024 && screen.height >= 600) return 1;
        return 0;
    }
    if (ConsiderLimits()) { /* pad */ } else { /* mobile */ }
} else {
    var box = document.getElementById("box");
    if (box) box.style.display = "none";
}

$(function () {
    var user = $.cookie("IsNoRWD");
    var viewport = document.getElementById("viewport");

    // RWD 按鈕顯示邏輯
    if (user == 'true') {
        $("#gotoComputerBtnFT").hide();
        $("#gotoRWDBtnFT").show();
        if (viewport) viewport.content = "";
    } else if (user == 'false') {
        $("#gotoComputerBtnFT").show();
        $("#gotoRWDBtnFT").hide();
        if (viewport) viewport.content = "width=device-width, initial-scale=1";
    } else {
        $("#gotoRWDBtnFT").hide();
    }

    $("#gotoComputerBtn, #gotoComputerBtnFT").click(function () {
        $.cookie("IsNoRWD", 'true', { expires: 365, path: "/;SameSite=Strict", secure: true });
        if (viewport) viewport.content = "";
        $("#gotoComputerBtnFT").hide();
        $("#gotoRWDBtnFT").show();
        $("#box").show();
    });

    $("#gotoRWDBtnFT").click(function () {
        $.cookie("IsNoRWD", 'false', { expires: 365, path: "/;SameSite=Strict", secure: true });
        if (viewport) viewport.content = "width=device-width, initial-scale=1";
        $("#gotoComputerBtnFT").show();
        $("#gotoRWDBtnFT").hide();
        $("#box").show();
    });

    // 動態插入 E-GOV 小幫手按鈕
    let items = $('.group.base-extend > .in > .ct > .in > div');
    let targetIndex = items.length - 2;
    if (targetIndex >= 0) {
        let newElem = $('<div class="list-text share e-book"><div class="in"><div class="hd"><div class="in"><div> <span><a href="#" class="e-book-open" title="開啟小幫手懸浮圖示，點擊後將會自動聚焦到該圖示上">E-GOV小幫手</a></span></div></div></div></div></div>');
        newElem.insertBefore(items.eq(targetIndex));
    }
});

// Chatbot 主邏輯
$(document).ready(function () {
    // 讀取 Cookie 變數
    city = getCookie('city');
    fontsize = getCookie('fontsize');
    role = getCookie('role');
    privacy = getCookie('privacy');

    fontsize = getCookie('fontsize');
    role = getCookie('role');
    privacy = getCookie('privacy');

    // 無障礙設定：對話容器加入 Live Region
    $('#words').attr('aria-live', 'polite');

    // UI 事件綁定
    $("#talkhot, #talkhotclose").click(function () {
        $(".hot_list").slideToggle("fast");
        $(this).toggleClass('is-active');
    });

    // 無障礙設定：補上 dialog role 與 焦點循環提示
    $('.talk_con').attr({
        'role': 'dialog',
        'aria-modal': 'true',
        'aria-label': 'E-GOV小幫手'
    });
    // 在區塊末段補充 sr-only 文字，提示使用者接下來會循環
    var $loopHint = $('<span tabindex="0" style="position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;">已至小幫手底部，按下 Tab 鍵將回到小幫手頂端的關閉鈕。</span>');
    $('.talk_con').append($loopHint);

    // 拖曳與開關視窗
    try {
        $('.CustomerService').draggable({
            containment: "window",
            drag: function (event, ui) {
                var pos = ui.position;
                $(".e-book-close").css({
                    left: pos.left + 112,
                    top: pos.top - 11
                });
            }
        });
    } catch (e) { }

    $('.CustomerService').click(function (e) {
        e.preventDefault();
        $('.CustomerService').hide();
        $('.e-book-close').hide();
        $('.talk_con').show();
        $('.e-book-icon').show();
        // 開啟小幫手對話視窗後會跳轉至輸入框
        $('#talkwords')
            .attr('aria-describedby', 'words')
            .one('blur', function () { $(this).removeAttr('aria-describedby'); })
            .focus();
    });

    $('.e-book-open').click(function (e) {
        e.preventDefault();
        triggerElement = $(this); // Save trigger element
        $('.e-book-icon').show();
        // 開啟小幫手icon區塊後會跳轉至小幫手按鈕
        // 開啟小幫手icon區塊後會跳轉至小幫手按鈕
        $('.CustomerService').focus();
        e.stopPropagation(); // 防止冒泡觸發 document click
    });

    // 關閉小幫手函式 (shouldFocus: 是否移回焦點)
    function closeChat(shouldFocus) {
        $('.CustomerService').show();
        $('.e-book-close').show();
        $('.talk_con').hide();
        if (shouldFocus) {
            $('.CustomerService').focus();
        }
    }

    // 新增：點擊外部自動縮小 (Auto-Collapse)
    $(document).on('click', function (e) {
        var $target = $(e.target);
        // 如果點擊目標不在 .talk_con 內 且 .talk_con 是顯示狀態 且 不是點擊 Icon 區塊 (Icon 區塊有點擊事件處理)
        if (!$target.closest('.talk_con').length &&
            !$target.closest('.e-book-icon').length &&
            $('.talk_con').is(':visible') &&
            !$target.closest('.CustomerService').length) { // 排除 .CustomerService 防止衝突

            closeChat(false); // 關閉但不強制移回焦點
        }
    });

    // Fix accessibility for .close button
    $('.talk_header .close').attr('href', '#').attr('role', 'button').attr('aria-label', '關閉對話視窗');

    // Add Space key support for close button since we added role='button'
    $('.talk_header .close').keydown(function (e) {
        if (e.keyCode === 32) { // Space
            e.preventDefault();
            $(this).click();
        }
    });

    $('.close').click(function (e) {
        e.preventDefault();
        // 關閉小幫手對話視窗後會跳轉回icon區塊
        closeChat(true);
    });

    $('.e-book-close').click(function (e) {
        e.preventDefault();
        $('.e-book-icon').hide();
        if (triggerElement) {
            // 關閉icon區塊後會跳轉回原本的按鈕區塊
            triggerElement.focus(); // Return focus to trigger
        }
    });

    $("a.btn").click(function () {
        $(this).parent().find(".box").slideToggle("fast");
        $('.informationBlock>div').hide();
    });

    // 資訊選單事件
    $(".btn_statify").click(function () {
        $('.information>.box').slideToggle("fast");
        $('.informationBlock>div').hide();
        $('.informationBlock>.statify').show();
    });

    $(".btn_description").click(function () {
        $('.information').find(".box").slideToggle("fast");
        $('.informationBlock>div').hide();
        $('.informationBlock>.description').show();
    });

    // 字型大小切換
    $(".font").find('li').click(function () {
        $(".font").find('li').removeClass('is-active');
        $(this).addClass('is-active');
        if ($(this).hasClass('small')) {
            $('.talk_show').css('font-size', '0.5rem');
            setCookie('fontsize', 'small', 365);
        } else if ($(this).hasClass('medium')) {
            $('.talk_show').css('font-size', '1rem');
            setCookie('fontsize', 'medium', 365);
        } else if ($(this).hasClass('large')) {
            $('.talk_show').css('font-size', '1.5rem');
            setCookie('fontsize', 'large', 365);
        }
    });

    // 處理 AJAX Loading 動畫
    $(document).ajaxStart(function () {
        $('#tempwords').show().append('<div class="atalk"><span class="dialog temploading" style="height: 25px;width: 70px;"><div class="typing-loader"></div></span></div>');
        var objDiv = document.getElementById("words");
        objDiv.scrollTop = objDiv.scrollHeight;
    }).ajaxStop(function () {
        $('.temploading').parent().remove();
        $('#tempwords').hide();
    });

    // 自動完成 (Autocomplete)
    var autocompleteurl = domain + "/chatbotapi.aspx?type=autocomplete";
    $.ajax({
        type: "get",
        url: autocompleteurl,
        cache: true,
        success: function (obj) {
            autocomplete(document.getElementById("talkwords"), obj);
        }
    });

    // 閒置計時器
    inactivityTime();

    // 綁定輸入框 Enter 事件
    $('#talkwords').keydown(function (event) {
        if (event.which == 13) {
            $('#talksub').trigger('click');
        }
    });

    // 傳送按鈕邏輯
    var notfundcount = 0;
    $('#talksub').click(function () {
        var TalkWords = document.getElementById("talkwords");
        if (TalkWords.value == "") {
            alert("訊息不能為空");
            return;
        }
        TalkWords.value = TalkWords.value.replace(/[(<>/^)]/gi, '');
        var str = '<div class="btalk"><span class="dialog">' + TalkWords.value + getDateString() + '</span></div>';
        append(str);

        var searchword = TalkWords.value;
        TalkWords.value = "";
        var returntext;

        // 紀錄查詢 Log
        $.ajax({
            type: "get",
            url: domain + '/chatbotlogapi.aspx?type=searchlog&n=2&chatbot=1&sms=9037&s=' + searchword + '&sk=0&page=1&PageSize=5&city=' + city,
            cache: true,
            success: function (obj) { }
        });

        // 主要回應邏輯 (API: check)
        $.ajax({
            type: "get",
            url: domain + '/chatbotapi.aspx?type=check&s=' + searchword,
            cache: true,
            success: function (obj) {
                returntext = obj;
                temp = obj;
                if (returntext != null && returntext != '' && returntext != '\r\n') {
                    str = '<div class="atalk"><span class="dialog">' + returntext + '' + getDateString() + '</span></div>';
                    append(str);
                } else {
                    // 若無直接回應，搜尋其他相關服務
                    handleNoDirectResponse(searchword);
                }
            }
        });
    });

    // 處理無直接回應的邏輯封裝
    function handleNoDirectResponse(searchword) {
        var lifeeventobj, topicobj;
        $.ajax({
            type: "get",
            url: domain + '/chatbotapi.aspx?type=Search&s=' + searchword,
            cache: true,
            success: function (obj) {
                lifeeventobj = obj;
                var IsSatisfy = false;
                $.ajax({
                    type: "get",
                    url: domain + '/chatbotapi.aspx?type=searchtopic&s=' + searchword,
                    cache: true,
                    dataType: "html",
                    success: function (obj2) {
                        try {
                            topicobj = obj2;
                            if (topicobj != null && topicobj != '' && topicobj != '\r\n') {
                                append(topicobj);
                            }
                            if (lifeeventobj.length > 0) {
                                var str = '<div class="atalk"><span class="dialog">也許下列會有您需要的服務?<br/><ul>';
                                lifeeventobj.forEach(function (element) {
                                    str += '<li><a class="lifeeventsec" href="' + element.url + '" rel="noopener noreferrer" target="_blank" data-SN="' + element.SN + '" data-Name="' + element.Name + '">' + element.Name + '<span>' + element.dep + '</span></a></li>';
                                });
                                str += '</ul><a target="_blank" rel="noopener noreferrer" href="Advanced_Search.aspx?q=' + searchword + '" title="更多服務" class="talk_sub btnmore" >更多服務</a>' + getDateString() + '</span></div>';
                                append(str);
                                IsSatisfy = true;
                                $('.lifeeventsec').click(function () {
                                    savelog("linkto:" + $(this).attr('href'))
                                });
                                notfundcount = 0;
                            } else {
                                // Double Check Search
                                $.ajax({
                                    type: "get",
                                    url: domain + '/chatbotapi.aspx?type=Search&s=' + searchword,
                                    cache: true,
                                    async: false,
                                    success: function (obj) { lifeeventobj = obj; }
                                });

                                if (lifeeventobj.length > 0) {
                                    var str = '<div class="atalk"><span class="dialog">也許下列會有您需要的服務?<br/><ul>';
                                    lifeeventobj.forEach(function (element) {
                                        str += '<li><a class="checkcity" href="#" data-SN="#" data-Name="' + element + '">' + element + '</a></li>';
                                    });
                                    str += '</ul><a target="_blank" rel="noopener noreferrer" href="Advanced_Search.aspx?q=' + searchword + '" title="更多服務" class="talk_sub btnmore" >更多服務</a>' + getDateString() + '</span></div>';
                                    append(str);
                                    $('.checkcity').click(function () {
                                        setCookie('city', $(this).attr('data-Name'), 365);
                                        city = $(this).attr('data-Name');
                                        savelog($(this).attr('data-Name'));
                                        $('#talksub').click();
                                    });
                                    notfundcount = 0;
                                    IsSatisfy = true;
                                } else if (topicobj != null && topicobj != '' && topicobj != '\r\n') {
                                    // Topic Object exists, handled outside
                                } else {
                                    if (new RegExp(/^[A-Za-z\s\'\.\?\d\$_]*$/gm).test(searchword)) {
                                        append('<div class="atalk"><span class="dialog">Sorry, I did not get your question.</span></div>');
                                    }
                                    if (notfundcount < 3) {
                                        append('<div class="atalk"><span class="dialog">不好意思！目前沒有完全符合您提問的答案，建議您換個問法，或是一次詢問單一問題，或許我就能回答您喔，謝謝！</span></div>');
                                        notfundcount++;
                                    } else {
                                        append('<div class="atalk"><span class="dialog">這個問題沒有合適的答案，也許目前我還無法回答您的問題，歡迎進一步至<a target="_blank" rel="noopener noreferrer" style="color: #2453ff !important;text-decoration: underline !important" href="https://www.service.gov.tw/question">線上客服中心[另開新視窗]</a>提問諮詢。</span></div>');
                                    }
                                    getLifeEvent();
                                }
                            }
                            if (IsSatisfy) {
                                var satisfy = '<div class="atalk"><span class="dialog ">對這次服務滿意嗎?<ul class="evaluate"><li><a role=\'button\' href=\'#\' title=\'點擊送出對回應表示滿意\' onclick=\'satisfylog($(this),"","","","1","' + searchword + '")\'>滿意</a></li><li><a  role=\'button\' href=\'#\' title=\'點擊送出對回應表示不滿意\' onclick=\'satisfylog($(this),"","","","0","' + searchword + '")\'>不滿意</a></li></ul></span></div>';
                                append(satisfy);
                            }
                        } catch (e) { }
                    }
                });
            }
        });
    }

    // 初始化設定：檢查 Cookie 並套用
    if (city == '') {
        setCookie('city', '選擇縣市', 365);
    } else {
        $('#countryselect').val(city);
    }
    if (fontsize != null && fontsize != '') {
        $(".font>." + fontsize).trigger('click');
    }
    if (role != null && role != '') {
        var rolesplit = role.split(',');
        for (var i = 0; i < rolesplit.length; i++) {
            $('.user li input[value="' + rolesplit[i] + '"]').prop('checked', true);
        }
    }

    // 取得推薦 (recommend)
    $.ajax({
        type: "get",
        url: domain + '/chatbotapi.aspx?type=recommend',
        cache: true,
        success: function (obj) {
            append(obj);
            setTimeout(function () { getLifeEvent('請從人生階段中選擇政府申辦服務！'); }, 1000);

            // 處理 URL 帶有的參數 s (QA Search)
            setTimeout(function () {
                if (getParameterByName('s') != '') {
                    $.ajax({
                        type: "get",
                        url: domain + '/chatbotapi.aspx?type=qa&s=' + getParameterByName('s'),
                        cache: true,
                        success: function (obj) {
                            try {
                                var qaobj = obj;
                                if (qaobj != '' && qaobj.length > 0) {
                                    setTimeout(function () { $('.CustomerService').css('background', 'url(../Images/e-book_icon2.gif) no-repeat center') }, 58000);
                                    var str = '<div class="atalk"><span class="dialog">也許下列會有您需要的常見問答?<br/><ul>';
                                    qaobj.forEach(function (element) {
                                        str += '<li><a class="qaobj" target="_blank" rel="noopener noreferrer" data-SN="' + element.SN + '" data-Name="' + element.Name + '">' + element.Name + '</a></li>';
                                    });
                                    str += '</ul></span></div>';
                                    append(str);
                                    $('.qaobj').click(function () {
                                        append('<div class="btalk"><span class="dialog">' + $(this).attr('data-Name') + '' + getDateString() + '</span></div>');
                                        var parentSN = $(this).attr('data-SN');
                                        var result = qaobj.find(function (element) { return element.SN == parentSN; });
                                        append('<div class="atalk"><span class="dialog">' + result.desc + '' + getDateString() + '</span></div>');
                                    });
                                }
                            } catch (e) { }
                        }
                    });
                }
            }, 2000);
        }
    });

    // 取得熱門關鍵字
    $.ajax({
        type: "get",
        url: domain + '/chatbotapi.aspx?type=hotkeyword',
        cache: true,
        success: function (obj) {
            $('.hot_list>ul').append(obj);
            $('.hot_list>ul>li').click(function () {
                $("#talkwords").val($(this).text());
                $('#talksub').trigger('click');
                $(".hot_list").slideToggle("fast")
            });
        }
    });

    // 角色設定確認按鈕
    $('#btn_RoleSet').click(function () {
        var Rolevalues = new Array();
        $.each($('.user li input:checked'), function () {
            Rolevalues.push($(this).val());
        });
        setCookie('role', Rolevalues, 365);
        $.ajax({
            type: "get",
            url: domain + '/chatbotapi.aspx?type=idlerecommend&role=' + Rolevalues.toString(),
            cache: true,
            success: function (obj) { append(obj); }
        });
        $('.set_up>.btn').trigger('click');
    });

    $('#btn_RoleReset').click(function () {
        $('.user li input:checked').prop('checked', false);
        setCookie('role', [], 365);
    });

    // 滿意度送出
    $('#btn_submit').click(function (event) {
        event.preventDefault();
        var satisfied = getCookie('satisfied');
        if ($('#txt_satisfied').val().length > 50) {
            alert("意見最多填寫50字");
        } else if (satisfied != null && satisfied != 'true') {
            var satisfied_value = $('input[name="Satisfied"]:checked').data('satisfiedvalue');
            $.ajax({
                url: domain + '/Common/ChatbotSatisfie.ashx',
                type: 'POST',
                data: {
                    s: 0,
                    satisfie: satisfied_value,
                    unsatisfie: $('#txt_satisfied').val()
                }
            });
            alert("感謝您寶貴的意見");
            $('.informationBlock>div').hide();
            $('#txt_satisfied').val('');
        } else {
            alert("您已填寫過滿意度");
            $('.informationBlock>div').hide();
            $('#txt_satisfied').val('');
        }
    });

    $('#btn_cancel').click(function () { $('.informationBlock>div').hide(); });
    $('#btn_agree').click(function () { setCookie('privacy', 'true', 365); $('.informationBlock>div').hide(); });
    $('#btn_disagree').click(function () { $('.informationBlock>div').hide(); });
    $('#btn_close').click(function () { setCookie('privacy', 'true', 365); $('.informationBlock>div').hide(); });

    // 鍵盤無障礙遊走設定 (Focus Trap)
    function handleFocusTrap(e, $container) {
        if (e.keyCode === 9) { // Tab
            var $focusable = $container.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]').filter(':visible');
            var $first = $focusable.first();
            var $last = $focusable.last();

            if (e.shiftKey) { // Shift + Tab
                if ($(document.activeElement).is($first)) {
                    e.preventDefault();
                    $last.focus();
                }
            } else { // Tab
                if ($(document.activeElement).is($last)) {
                    e.preventDefault();
                    $first.focus();
                }
            }
        }
    }



    $('.talk_con').keydown(function (e) {
        handleFocusTrap(e, $(this));
    });

}); // End of Document Ready

// 人生大事查詢函式
function getLifeEvent(des) {
    if (!des) des = '請問您目前尋找的服務是哪個人生階段呢?';
    $.ajax({
        type: "get",
        url: domain + '/chatbotapi.aspx?type=lifeeventlevel',
        cache: true,
        success: function (obj) {
            try {
                var lifeeventobj = obj;
                var str = '<div class="atalk"><span class="dialog">' + des + '<br/></span></div>';
                var licontent = '';
                lifeeventobj.forEach(function (element) {
                    licontent += '<li><div class="life-block"><img src="' + element.picurl + '" alt="' + element.Name + '_小幫手示意圖"/><div class="title" data-SN="' + element.SN + '" data-Name="' + element.Name + '">' + element.Name + '</div><ol>' + lifteventchildernelement(element.ChildrenObj) + '</ol></div></li>';
                });
                licontent = '<div data-index="1" data-sitesmodulesn="1" class="group-list marquee chat-marquee" ...>' + '<div class="in"><div class="ct"><div class="in"><ul data-index="1" data-child="8" style="margin-left: 0%;">' + licontent + '</ul></div></div></div></div>';

                append(str);
                append(licontent);

                // 動態載入跑馬燈邏輯 (原程式碼邏輯)
                requirejs(['main'], function (func) { func(); });

                $('.lifeevent').click(function () {
                    append('<div class="btalk"><span class="dialog">' + $(this).attr('data-Name') + '' + getDateString() + '</span></div>');
                    var lep = $(this).attr('data-SN');
                    $.ajax({
                        type: "get",
                        url: domain + '/chatbotapi.aspx?type=lifeeventsec&parent=' + $(this).attr('data-SN'),
                        cache: true,
                        success: function (obj) {
                            var lifeeventobj = obj;
                            savelog($(this).attr('data-Name'));
                            var str = '<div class="atalk"><span class="dialog">請問您目前尋找的服務是屬於哪一個主題呢?<br/><ul>';
                            lifeeventobj.forEach(function (element) {
                                str += '<li><a class="lifeeventsec" href="#" lep="' + lep + '" data-SN="' + element.SN + '" data-Name="' + element.Name + '">' + element.Name + '</a></li>';
                            });
                            str += '</ul>' + getDateString() + '</span></div>';
                            append(str);

                            $('.lifeeventsec').click(function () {
                                append('<div class="btalk"><span class="dialog">' + $(this).attr('data-Name') + '' + getDateString() + '</span></div>');
                                var lep = $(this).attr('lep');
                                var parentSN = $(this).attr('data-SN');
                                $.ajax({
                                    type: "get",
                                    url: domain + '/chatbotapi.aspx?type=servicetitle&parent=' + parentSN + '&city=' + city,
                                    cache: true,
                                    success: function (obj) {
                                        var lifeeventobj = obj;
                                        // console.log($(this).attr('data-Name')); // this scope issue here in original code, fixed below
                                        // savelog($(this).attr('data-Name')); 

                                        if (lifeeventobj != undefined && lifeeventobj.length > 0) {
                                            var str = '<div class="atalk"><span class="dialog">也許下列會有您需要的服務?<br/><ul>';
                                            lifeeventobj.forEach(function (element) {
                                                str += '<li><a class="lifeeventsec" target="_blank" rel="noopener noreferrer" href="' + element.url + '" data-SN="' + element.SN + '" data-Name="' + element.Name + '">' + element.Name + '<span>' + element.dep + '</span></a></li>';
                                            });
                                            str += '</ul><a target="_blank" rel="noopener noreferrer" href="News_LifeEvent.aspx?lep=' + lep + '&le=' + parentSN + '" title="更多服務" class="talk_sub btnmore" >更多服務</a><br/>或查詢其他服務關鍵字。' + getDateString() + '</span></div>';
                                            append(str);
                                            var satisfy = '<div class="atalk"><span class="dialog ">對這次服務滿意嗎?<ul class="evaluate"><li><a   role=\'button\' href=\'#\' title=\'點擊送出對回應表示滿意\' onclick=\'satisfylog($(this),"",' + lep + ',' + parentSN + ',"1","")\'>滿意</a></li><li><a   role=\'button\' href=\'#\' title=\'點擊送出對回應表示不滿意\' onclick=\'satisfylog($(this),"",' + lep + ',' + parentSN + ',"0","")\'>不滿意</a></li></ul></span></div>';
                                            append(satisfy);
                                            $('.lifeeventsec').click(function () { savelog("linkto:" + $(this).attr('href')) });
                                        } else {
                                            append('<div class="atalk"><span class="dialog">不好意思！目前無相關服務，歡迎進一步至<a target="_blank" style="color: #2453ff !important;text-decoration: underline !important" href="https://www.service.gov.tw/user_qa_desc.php">線上客服中心</a>提問諮詢。' + getDateString() + '</span></div>');
                                        }
                                    }
                                });
                            });
                        }
                    });
                });
            } catch (e) { }
        }
    });
}

function lifteventchildernelement(childrenobj) {
    var childrencontent = '';
    childrenobj.forEach(function (element) {
        childrencontent += '<li><a class="lifeevent" href="#" data-SN="' + element.SN + '" data-Name="' + element.Name + '">' + element.Name + '</a></li>';
    });
    return childrencontent;
}

// 閒置計時器邏輯
function inactivityTime() {
    var t;
    var t2;
    resetTimer();
    $('.talk_con').find('a,input').click(function () {
        resetTimer();
    });

    function logout() {
        var Rolevalues = new Array();
        $.each($('.user li input:checked'), function () {
            Rolevalues.push($(this).val());
        });
        $.ajax({
            type: "get",
            url: domain + '/chatbotapi.aspx?type=idlerecommend&role=' + Rolevalues.toString(),
            cache: true,
            success: function (obj) {
                append(obj);
            }
        });
        setTimeout(function () { getLifeEvent('本站針對熱門服務做了一些分類'); }, 1000);
    }

    function closewindow() {
        $('.CustomerService').show();
        $('.talk_con').hide();
    }

    function resetTimer() {
        clearTimeout(t);
        clearTimeout(t2);
        var sessionTimeoutWarning = 2; //min
        var sTimeout = parseInt(sessionTimeoutWarning) * 60 * 1000;
        t = setTimeout(logout, sTimeout);
        var sessionTimeoutWarning2 = 10; //min
        var sTimeout2 = parseInt(sessionTimeoutWarning2) * 60 * 1000;
        t2 = setTimeout(closewindow, sTimeout2);
    }
}

// Autocomplete 邏輯
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.insertBefore(a, this.parentNode.firstChild);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                    $.ajax({
                        type: "get",
                        url: domain + '/chatbotlogapi.aspx?type=autocompletelog&n=2&chatbot=1&sms=9037&s=' + this.getElementsByTagName("input")[0].value + '&sk=0&page=1&PageSize=5',
                        cache: true,
                        success: function (obj) { }
                    });
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
            closeAllLists();
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}