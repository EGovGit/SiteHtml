/*! fu_Accessibility v1.2 | 2019 | johnnyyang */
$(window).on('load', (function () {
    $(document).ready(function () {
        ////Table 補ID、Headers
        //var $page_content, th_col, th_row, col_count, col, row, $td, $th;
        //if (0 < $("table").length) {
        //    var $table = $("table");
        //    for (i = 0; i < $table.length; i++)
        //        if (void 0 == $table.eq(i).attr("id") && $table.eq(i).attr("id", "table_" + i), $th = $table.eq(i).find("th"), 0 == $th.length)
        //            for ($td = $table.eq(i).find("td"), j = 0; j < $td.length; j++)
        //                if (row = $td.eq(j).parent().index() + 1, col = $td.eq(j).index() + 1, col_count = 0, 1 == row) void 0 == $td.eq(j).attr("id") && $td.eq(j).attr("id", "table_" + i + "_" + j);
        //                else
        //                    for (k = 0; k < $td.length; k++) {
        //                        var td_row = $td.eq(k).parent().index() +
        //                            1,
        //                            td_col = $td.eq(k).index() + 1;
        //                        1 == td_row && (col_count = void 0 == $td.eq(k).attr("colspan") ? Number(col_count) + Number(1) : Number(col_count) + Number($td.eq(k).attr("colspan")));
        //                        if (col_count >= col) {
        //                            void 0 == $td.eq(j).attr("headers") && $td.eq(j).attr("headers", $td.eq(k).attr("id"));
        //                            break
        //                        }
        //                    } else {
        //            void 0 == $table.eq(i).attr("id") && $table.eq(i).attr("id", "table_" + i);
        //            $th = $table.eq(i).find("th");
        //            for (j = 0; j < $th.length; j++) void 0 == $th.eq(j).attr("id") && $th.eq(j).attr("id", "table_" + i + "_" + j);
        //            $td = $table.eq(i).find("td");
        //            for (k =
        //                0; k < $td.length; k++) {
        //                row = $td.eq(k).parent().index() + 1;
        //                col = $td.eq(k).index() + 1;
        //                var row_count = 0;
        //                for (l = col_count = 0; l < $th.length; l++)
        //                    if (th_row = $th.eq(l).parent().index() + 1, th_col = $th.eq(l).index() + 1, 1 == th_row && (col_count = void 0 == $th.eq(l).attr("colspan") ? Number(col_count) + Number(1) : Number(col_count) + Number($th.eq(l).attr("colspan"))), col_count >= col) {
        //                        void 0 == $td.eq(k).attr("headers") && $td.eq(k).attr("headers", $th.eq(l).attr("id"));
        //                        break
        //                    }
        //                for (l = 0; l < $th.length; l++)
        //                    if (th_row = $th.eq(l).parent().index() + 1, th_col =
        //                        $th.eq(l).index() + 1, 1 == th_col && (row_count = void 0 == $th.eq(l).attr("rowspan") ? Number(row_count) + Number(1) : Number(row_count) + Number($th.eq(l).attr("rowspan"))), row_count >= row) {
        //                        var rowheaders = $td.eq(k).attr("headers");
        //                        void 0 == rowheaders ? void 0 == $td.eq(k).attr("headers") && $td.eq(k).attr("headers", $th.eq(l).attr("id")) : (rowheaders = rowheaders + " " + $th.eq(l).attr("id"), void 0 == $td.eq(k).attr("headers") && $td.eq(k).attr("headers", rowheaders));
        //                        break
        //                    }
        //            }
        //        }
        //}


        var New_Windows_Title = "[另開新視窗]", New_Windows_LanguageSN = 12;
        var Fancybox_Title = "[彈出視窗]";
        //取得語系
        function GetLanguage() {
            try {
                var lang = document.getElementsByTagName("html")[0].getAttribute("lang").toLowerCase();
                switch (lang) {
                    case 'zh-hant-tw':
                    case 'zh-tw':
                        New_Windows_LanguageSN = 1;
                        New_Windows_Title = "[另開新視窗]";
                        Fancybox_Title = "[彈出視窗]";
                        break;
                    case 'en':
                        New_Windows_LanguageSN = 2;
                        New_Windows_Title = "[open a new window]";
                        Fancybox_Title = "[open a inline window]";
                        break;
                    case 'vi':
                        New_Windows_LanguageSN = 2;
                        New_Windows_Title = "[Mở cửa sổ mới]";
                        Fancybox_Title = "[Cửa sổ bật lên]";
                        break;
                    case 'id':
                        New_Windows_LanguageSN = 2;
                        New_Windows_Title = "[Buka jendela baru]";
                        Fancybox_Title = "[Jendela pop-up]";
                        break;
                    case 'th':
                        New_Windows_LanguageSN = 2;
                        New_Windows_Title = "[เปิดหน้าต่างใหม่]";
                        Fancybox_Title = "[ออกจากหน้าต่าง]";
                        break;
                    case 'jp':
                        New_Windows_LanguageSN = 2;
                        New_Windows_Title = "[新しいウィンドウを開きます]";
                        Fancybox_Title = "[ポップアップウィンドウ]";
                        break;
                    case 'ko':
                        New_Windows_LanguageSN = 2;
                        New_Windows_Title = "[새창 열기]";
                        Fancybox_Title = "[인라인 창을 엽니 다]";
                        break;
                    default:
                        New_Windows_LanguageSN = 2;
                        New_Windows_Title = "[open a new window]";
                        Fancybox_Title = "[open a inline window]";
                        break;

                }
            } catch (b) {
                New_Windows_LanguageSN = 1
            }

        }
        GetLanguage();

        //判斷另開新視窗邏輯
        function CheckIndex(b) {
            //var a = b.indexOf("開啟");
            //if (-1 != a) return a;
            var a = b.indexOf("視窗");
            if (-1 != a) return a;
            a = b.indexOf("分頁");
            if (-1 != a) return a;
            a = b.indexOf("另開");
            if (-1 != a) return a;
            a = b.indexOf("新窗");
            if (-1 != a) return a;
            a = b.indexOf("new window");
            return -1 != a ? a : a = b.indexOf("window")
        }


        var h2value = $('title').html().trim();
        if (h2value == null || h2value == '' || h2value.length == 0) {
            h2value = '標題項目';
        }

        //沒有圖標題的就加標題
        $("img:not([alt])").each(function (index) {
            $(this).attr("alt", h2value + "_" + index);
        });
        //如果是null 就取代為空值
        $("img[alt='null'], img[alt='Null'], img[alt='NULL'] , img[alt=' ']").each(function (index) {
            $(this).attr("alt", '');
        });

        $('[data-fancyboxopen]').each(function (index) {
            var $atitle = $(this).attr('title');
            $(this).attr('title', Fancybox_Title + $atitle);
        });


        //檢查所有連結
        $('a').each(function (index) {
            var $this = $(this); // 緩存物件以提升效能
            var domain = window.location.origin.toLowerCase();

            // ==========================================
            // 1. 圖片 Alt 屬性處理
            // ==========================================
            // 10/19無障礙檢測 圖片都需要有alt
            // <a> 標籤內之 IMG 替代文字為空即可 (邏輯:<a>內有圖片且子節點>1or有文字說明時，IMG之替代文字為空)
            if ($this.find('img').length > 0 && ($this.children().length > 1 || $this.text().trim() !== '')) {
                $this.find('img').attr('alt', '');
            }

            if ($this.find('img').length > 0 && ($this.children().length == 1) && $this.attr('title') == $this.find('img').attr('alt')) {
                $this.find('img').attr('alt', $this.attr('title') + ' 連結裝飾圖');
            }

            // ==========================================
            // 2. 空 <a> 內容補全 (AAA 優化重點)
            // ==========================================
            if ($this.text().trim() == '' && $this.children('img').length === 0) {
                // 嘗試使用 title 作為補全文字，若無則給予預設值，避免連結無名稱
                var fallbackText = $this.attr('title') || '連結';

                // 建立 visually-hidden (sr-only) 的 span
                var $srSpan = $('<span>').text(fallbackText).css({
                    'position': 'absolute',
                    'width': '1px',
                    'height': '1px',
                    'padding': '0',
                    'margin': '-1px',
                    'overflow': 'hidden',
                    'clip': 'rect(0,0,0,0)',
                    'border': '0',
                    'white-space': 'nowrap'
                });
                $this.append($srSpan);
            }

            // ===========================================================================
            // 區塊開始：Title 生成邏輯 (依賴外部變數 h2value)
            // ===========================================================================
            var $atitle = $this.attr('title');
            var titlevalue = '';

            if ($atitle == undefined || $atitle.length == 0) {
                if ($this.children().length > 0) {
                    titlevalue = $this.text();

                    if (titlevalue == '' && typeof h2value !== 'undefined') titlevalue = h2value + "_" + index;
                    if (titlevalue == '') titlevalue = ' ';

                } else if ($this.children().length == 0 && $this.text() != '') {
                    titlevalue = $this.text();
                } else {
                    if (typeof h2value !== 'undefined') titlevalue = h2value + "_" + index;
                }

                if (titlevalue && titlevalue.trim() == '' && $this.attr('name') != undefined)
                    titlevalue = $this.attr('name');

                if (titlevalue) {
                    $this.attr('title', titlevalue.trim());
                }
            }
            // ===========================================================================
            // 區塊結束：Title 生成邏輯
            // ===========================================================================


            // ==========================================
            // 3. Title 重複性優化 (解決語音重複)
            // ==========================================
            // 重新取得當下的 title 與 text
            var currentTitle = ($this.attr('title') || '').trim();
            var currentText = $this.text().trim();
            var hrefContent = $this.attr('href');

            if (currentTitle.length > 0) {
                // 情況 A: 可視文字與 Title 完全一樣 -> 移除 Title (符合 FreeGo 與 WCAG 最佳實務)
                if (currentText.length > 0 && currentText === currentTitle) {
                    $this.removeAttr('title');
                }
                // 情況 B: 功能性連結 (#) 且文字相同 -> 移除 Title
                else if (hrefContent === '#' && currentText === currentTitle) {
                    $this.removeAttr('title');
                }
            }


            // ==========================================
            // 4. 檔案下載連結處理 (補上副檔名)
            // ==========================================
            var href = $this.attr('href');
            if (href) {
                var matchExt = href.toLowerCase().match(/\.([a-z0-9]+)(?=($|\?|#))/);
                if (matchExt) {
                    var ext = matchExt[1];
                    var pageExts = ['html', 'aspx', 'php', 'ashx', 'asp', 'action', 'jsp'];

                    if ($.inArray(ext, pageExts) === -1) {
                        // 重新檢查 text 和 title (因為 title 可能剛被移除)
                        var nowTitle = $this.attr('title') || '';
                        var nowText = $this.text().trim();
                        var extLabel = '(' + ext.toUpperCase() + ')';

                        // 如果 title 存在，且沒包含副檔名 -> 加在 title
                        if (nowTitle && nowTitle.indexOf(ext.toUpperCase()) === -1) {
                            $this.attr('title', nowTitle + extLabel);
                        }
                        // 如果 title 不存在 (被移除了)，且文字本身也沒包含副檔名 -> 加回 title 以提示使用者
                        else if (!nowTitle && nowText.indexOf(ext.toUpperCase()) === -1) {
                            $this.attr('title', nowText + extLabel);
                        }
                    }
                }
            }


            // ==========================================
            // 5. 外連網址處理
            // ==========================================
            if ($this.attr('href') != null && $this.attr('href').indexOf('http') > -1 &&
                $this.attr('href').indexOf(domain) == -1 &&
                $this.attr('href').indexOf('webws.miaoli.gov.tw') == -1 &&
                $this.attr('href') != '#' &&
                $this.attr('target') != "_blank" &&
                $this.attr('href').indexOf('javascript:') < 0) {
                $this.attr('target', "_blank");
            }


            // ===========================================================================
            // 區塊開始：新視窗提示 (依賴 CheckIndex, New_Windows_Title)
            // ===========================================================================
            if ($this.attr('target') == "_blank") {
                // 確保變數存在才執行，避免 JS 錯誤
                if (typeof CheckIndex === 'function' && typeof New_Windows_Title !== 'undefined') {

                    var finalTitle = $this.attr('title') || '';

                    if (CheckIndex(finalTitle) == -1) {
                        // 若 title 存在，補在 title 前
                        if (finalTitle) {
                            $this.attr('title', New_Windows_Title + finalTitle);
                        }
                    }

                    // 補在文字後方 (視覺提示)
                    if ($this.find('img').length === 0 && $this.text().trim().length > 0) {
                        if (CheckIndex($this.text()) === -1) {
                            $this.append(New_Windows_Title);
                        }
                    }
                }

                // 安全性屬性補強
                if ($this.attr('rel') != "noopener noreferrer")
                    $this.attr('rel', 'noopener noreferrer');
            }
            // ===========================================================================
            // 區塊結束：新視窗提示
            // ===========================================================================


            // ==========================================
            // 6. Role="tab" 互動邏輯 (AAA 鍵盤導航增強)
            // ==========================================
            // 修改：排除 data-fun 或 data-funclog 區塊內的 tab，避免與 tab.js 衝突
            if ($this.attr('role') == "tab" && $this.closest('[data-fun], [data-funclog]').length === 0) {
                var $parentLi = $this.closest('li');
                var isInsideList = $parentLi.length > 0 && $parentLi.parent().is('ul');

                // --- 初始化狀態 ---
                if (isInsideList) {
                    if ($parentLi.attr('data-index') == "1") {
                        $this.attr('aria-selected', 'true');
                        // tabindex="0" 表示可被 Tab 鍵聚焦
                        $this.attr('tabindex', '0');
                    } else {
                        $this.attr('aria-selected', 'false');
                        // tabindex="-1" 表示 Tab 鍵跳過 (需搭配方向鍵腳本，若無方向鍵腳本，建議改回 0)
                        // 為了保守起見，若無法確認是否有方向鍵監聽，可設為 0
                        $this.attr('tabindex', '0');
                    }
                }

                // --- 事件綁定 (滑鼠與鍵盤) ---
                $this.on('click keydown', function (e) {
                    // 支援滑鼠點擊，或鍵盤 Enter(13)、Space(32)
                    if (e.type === 'click' || (e.type === 'keydown' && (e.which == 13 || e.which == 32))) {

                        // 防止空白鍵造成頁面捲動
                        if (e.which == 32) e.preventDefault();

                        // 設定自己為選取狀態
                        $(this).attr('aria-selected', 'true');
                        $(this).attr('tabindex', '0'); // 確保可聚焦

                        // 處理兄弟元素
                        if (isInsideList) {
                            var $siblings = $parentLi.siblings().find('a[role="tab"]');
                            $siblings.attr('aria-selected', 'false');
                            // 未選取者設為不可 Tab 聚焦 (符合 WAI-ARIA Pattern)
                            $siblings.attr('tabindex', '-1');
                        }
                    }
                });
            }

        });

        //如果有onkeypress進行移除
        $("a[onkeypress]").each(function (index) {
            $(this).removeAttr("onkeypress");
        });

        //回報問題隱藏
        $(".btn-tool.btn-problem").each(function (index) {
            $(this).attr("style", "display:none");
        });

        //移除沒用的行動版的h4 項目(會防礙無帳礙)
        $('.base-mobile .search .in .hd .in h4').remove();

        //沒有iframe沒有標題的就加標題
        $("iframe").each(function (index) {
            var title = '影音';
            //console.log($(this).attr("src"));
            if ($('div[class="photoandtext"] h4').html() != "") title = $('div[class="photoandtext"] h4').html();
            if ($(this).attr("title") == null) $(this).attr("title", title);
            //if ($(this).attr("title") == null && title == null && $(this).attr("src") != null && ($(this).attr("src").indexOf("youtu") > -1)) $(this).attr("title", 'youtube');
            if ($(this).attr("title") == null && title == null && $(this).attr("data-src") != null && ($(this).attr("data-src").indexOf("youtu") > -1)) $(this).attr("title", 'youtube');
            if ($(this).attr("title") == null && title == null && $(this).attr("data-src") != null && ($(this).attr("data-src").indexOf("Frame_PublicHearing") > -1)) $(this).attr("title", '公聽會');
            if ($(this).attr("title") == null && title == null && $(this).attr("data-src") != null && ($(this).attr("data-src").indexOf("Frame_LiveVideo") > -1)) $(this).attr("title", '議會直播');
            if ($(this).attr("title") == null && title == null && $(this).attr("data-src") != null && ($(this).attr("data-src").indexOf("IframeDetail") > -1)) $(this).attr("title", '本會專刊');
            if ($(this).attr("title") == null && title == null) $(this).attr("title", 'Map');
        });


        //內容區 px to em 預設 16px = 1em
        function pxtoem(x) {
            var y = 16; //預設 16px = 1em
            var result = "0";
            if (x) {
                result = x / y;
            }
            var size = Math.pow(10, 4);
            result = Math.round(result * size) / size;
            result = result + "em";
            return result;
        }

        //<span>內之 style font-size px→em
        if (0 < $("span").length) {
            var $span = $("span");
            for (i = 0; i < $span.length; i++) {
                if ($span.eq(i).attr('style') != null && $span.eq(i).attr('style').indexOf('font-size') != -1 && $span.eq(i).css('font-size').toLowerCase().indexOf('px') != -1) {
                    var px = $span.eq(i).css('font-size').toLowerCase().replace('px', '');
                    var em = pxtoem(px);
                    if (em != "0") $span.eq(i).css('font-size', em);
                }
            }
        }

        //<p>內之 style font-size px→em
        if (0 < $("p").length) {
            var $p = $("p");
            for (i = 0; i < $p.length; i++) {
                if ($p.eq(i).attr('style') != null && $p.eq(i).attr('style').indexOf('font-size') != -1 && $p.eq(i).css('font-size').toLowerCase().indexOf('px') != -1) {
                    var px = $p.eq(i).css('font-size').toLowerCase().replace('px', '');
                    var em = pxtoem(px);
                    if (em != "0") $p.eq(i).css('font-size', em);
                }
            }
        }
        if (CCMS_LanguageSN == '1') {
            $('.small').find('a').attr('title', $('.small').find('a').attr('title') + '字級');
            $('.medium').find('a').attr('title', $('.medium').find('a').attr('title') + '字級');
            $('.large').find('a').attr('title', $('.large').find('a').attr('title') + '字級');
            $('.share').find('ul').find('a').each(function () {
                $(this).attr('title', $(this).attr('title').replace(/\Share to/g, '分享至'));
            });
        }




    });



}));