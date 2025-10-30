function getParameterByName(e) {
    e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var t = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(location.search);
    return null == t ? "" : decodeURIComponent(t[1].replace(/\+/g, " "))
}

function getParameterByUrlAndName(e, t) {
    var n = encodeURI(e),
        a = "";
    if (-1 != n.indexOf("?")) {
        var o = n.split("?")[1].split("&");
        for (var i in o) o[i].toString().split("=")[0] == t && (a = o[i].toString().split("=")[1])
    }
    return a
}

function doSearch(e) {
    var t = e.closest("div").find('[data-search="' + e.attr("data-search") + '"]').val();
    "1" == $("#searchselect" + e.attr("data-search")).val() ? window.location.href = "News3_2.html?q=" + t : window.location.href = "https://api.www.gov.tw/Advanced_Search.aspx?q=" + t
}

function CCMS_Print(e) {
    $.ajax({
        url: "https://api.www.gov.tw/Common/CCMS_WebAPI.ashx?Type=GetSitesPrint&SitesSN=" + e,
        type: "get",
        success: function (e) {
            var t = $('<div class="group-list content" data-setlen="1" data-type="4" data-child="2"><div class="in"><div class="ct"><div class="in">' + e.PrintFooterContent + "</div></div></div></div>");
            $(".group.base-section").after(t);
            var n = $('<div class="group-list content" data-setlen="1" data-type="4" data-child="2"><div class="in"><div class="ct"><div class="in">' + e.PrintTopContent + "</div></div></div></div>");
            $(".group.base-section").before(n), setTimeout(function () {
                print(), t.remove(), n.remove()
            }, 100)
        },
        error: function () { }
    })
}
$(function () {
    var e = getParameterByName("n");
    $(".minor-nav").find("ul").find("a").each(function () {
        "" != e && getParameterByUrlAndName($(this).attr("href"), "n") == e && $(this).parent().parent().addClass("is-active")
    })
}), $(function () {
    if ($("[data-ccms_hitcount]").click(function () {
        var e = "https://api.www.gov.tw/Common/GetVisitcount.ashx?s=" + $(this).data("ccms_hitcount") + "&sms=" + getParameterByName("sms") + "&n=" + getParameterByName("n");
        $.ajax({
            url: e,
            type: "POST",
            success: function (e) { }
        })
    }), $("[data-ccms_hitcount_relfile]").each(function () {
        $(this).click(function (e) {
            var t = "https://api.www.gov.tw/Common/GetVisitcount.ashx?type=relfile&s=" + $(this).data("ccms_hitcount_relfile");
            $.ajax({
                url: t,
                contentType: "text/plain",
                type: "POST",
                success: function (e) { }
            })
        })
    }), "undefined" != typeof CCMS_SitesSN_Encryption) {
        var e = "https://api.www.gov.tw/Common/GetVisitcount.ashx?sitessn=" + CCMS_SitesSN_Encryption;
        window.getParameterByName && "" != getParameterByName("n") && (e = e + "&n=" + getParameterByName("n") + "&sms=" + getParameterByName("sms") + "&s=" + getParameterByName("s")), $.ajax({
            url: e,
            contentType: "text/plain",
            type: "POST",
            success: function (e) {
                $("#footer_visitcount_span") && $("#footer_visitcount_span").html(e)
            }
        })
    }
}), $(function () {
    $(".btngo_quicklink").click(function () {
        var e = $("#" + $(this).data("selectid")).find(":selected"),
            t = e.data("isnewwindow") ? "_blank" : "_self";
        console.log($(this).data("selectid")), e.data("href") && window.open(e.data("href"), t)
    })
}), $(function () {
    $("[data-fancyboxOpen]").click(function (e) {
        e.preventDefault();
        var t = $("[data-fancyboxOpen]").index(this),
            n = $(this).data("fancyboxopen");
        $.fancybox.open({
            href: n,
            type: "iframe",
            padding: 20,
            autoSize: !1,
            height: 150,
            afterShow: function () {
                $(this.content).focus()
            },
            beforeClose: function () {
                $("[data-fancyboxOpen]").eq(t).focus()
            }
        })
    }), $(document).on("keydown", ".fancybox-close", function (e) {
        9 == e.keyCode && (e.stopPropagation(), e.preventDefault(), $.fancybox.close())
    })
}), $(function () {
    $(".bopomofo").click(function (e) {
        var t, n, a;
        e.preventDefault(), t = this, n = $(t).hasClass("active"), a = ".page-content", n ? ($.fn.JPhoneticRecovery({
            Selector: a
        }), $(t).removeClass("active")) : ($.fn.JPhonetic ? $.fn.JPhonetic({
            Selector: a,
            ExSelector: ".page-select,.xxxx"
        }) : $.getScript("/scripts/JPhonetic.js", function (e, t, n) {
            $.fn.JPhonetic({
                Selector: a,
                ExSelector: ".page-select,.xxxx"
            })
        }), $(t).addClass("active"))
    })
}), $(function () {
    $(".CCMS_SearchBtn").each(function () {
        $(this).click(function () {
            doSearch($(this))
        })
    }), $(".C_Pager").each(function () {
        var e = $(this).data("path"),
            t = $(this).find("select");
        $(this).find(".btn").click(function () {
            var n = t.val();
            window.location = e + "&page=1&PageSize=" + n
        })
    })
}), $(function () { }), $(function () {
    var e;
    e = "." + document.location.hostname, null == $.cookie(e) ? ($(".login").show(), $(".join").show(), $(".zone").hide(), $(".logout").hide()) : ($(".zone").show(), $(".logout").show(), $(".login").hide(), $(".join").hide())
}), $(function () {
    $('[href="#Accesskey_U"]').click(function (e) {
        e.preventDefault();
        var t = $(this);
        $href = $(t.attr("href")), $("html,body").stop().animate({
            scrollTop: 0
        }, 300), $("#Accesskey_U").focus()
    })
}), $(document).ready(function () {
    $(".goog-te-menu-value span").bind("DOMSubtreeModified", function (e) {
        setTimeout(function () {
            $("iframe.goog-te-menu-frame.skiptranslate").eq(0).contents().find("table").find("a").last().keydown(function (e) {
                9 === (e.keyCode || e.which) && (e.preventDefault(), $(".major-logo").find("a").focus())
            })
        }, 1e3)
    }), setTimeout(function () {
        $("iframe.goog-te-menu-frame.skiptranslate").eq(0).contents().find("table").find("a").last().keydown(function (e) {
            9 === (e.keyCode || e.which) && (e.preventDefault(), $(".major-logo").find("a").focus())
        })
    }, 1e3)
});