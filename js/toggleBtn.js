define(['getNode', 'mobileFilter', 'langFilter'], function (getNode, mobileFilter, langFilter) {

	function main(env, opt, file) {

		var $set = {
			bindNode: '.hd',
			targetNode: null,
			targetClass: 'is-active',
			toggleClass: 'is-active',
			btnOrangeText: null,
			btnActiveText: null,
			clickToRemove: false,
			event: 'click', //jQuery 事件名稱
			cookie: false,
			text: 'link',
			addHref: true,
			chText: '連結',
			debug: false
		}

		$.extend($set, opt);

		var $env = $(env),
			$target = $($set.targetNode),
			_eventNmae = file;

		//取觸發 btn，都沒有就取第一個 a
		var $btn = null; //按鈕物件

		if ($set.bindNode === '.hd') { //綁頭、身體或尾巴
			// $btn = getNode.getHdLink(env,false).find('a');  
			$btn = getNode.getHdIn(env).find('a');
		} else if ($set.bindNode === '.ct') {
			$btn = getNode.getCtIn(env).find('a');
		} else if ($set.bindNode === '.ft') {
			$btn = getNode.getFtItemBtn(env).find('a');
		} else {
			$btn = $env.find('a');
		}

		var _text = $set.text;

		if (langFilter) {
			_text = $set.chText;
		}

		//設定文字功能...有原生文字及觸發文字
		if (!!$set.btnOrangeText && _flag && !!$set.btnActiveText) {
			$btn.text($set.btnActiveText);
			$btn.attr('title', $set.btnActiveText + '[' + _text + ']');
		} else if (!!$set.btnOrangeText) {
			$btn.text($set.btnOrangeText);
			$btn.attr('title', $set.btnOrangeText + '[' + _text + ']');
		}

		//紀錄觸發過的事件 cookie(UUID)，有的話就還原它的動作
		var _uuid = $env.attr('class').replace($set.toggleClass, ''), //!!!!----還要想一個 UUID 方法
			_flag = null; //0 未執行 / 1  執行中 / null 沒有

		if (!$set.cookie) { //如果物件有建立 cookie 記錄此 env
			$.cookie(_uuid, null,{ expires : 365, path: "/;SameSite=Lax", secure: true});
		} else {
			_flag = $.cookie(_uuid);
		}

		if (_flag === '1') {
			$target.addClass($set.targetClass);
			$env.addClass($set.toggleClass);
		} else if (_flag === '0') {
			$target.removeClass($set.targetClass);
			$env.removeClass($set.toggleClass);
		}

		if ($btn.attr('href') === undefined && $set.addHref) { //沒有 href 就加入
			$btn.attr('href', '#');
		}

		//如果符合以下三條件，就開啟 click body 刪除 env class 的功能
		if ($set.event === 'click' && $set.clickToRemove) {
			var $body = $('body');

			$env.on('click', function (evt) {
				evt.stopPropagation();

				//把不是自己，且 data-funclog 有 'clickToRemove':true 的物件刪除 class
				var $clickToRemoveNodes = $('[data-funclog]').filter(function (i, d) {
					var _log = d.getAttribute('data-funclog'),
						_isClickToRemoveNode = /('clickToRemove':true)/i.test(_log),
						_isSelf = (d != env);

					return (_isClickToRemoveNode && _isSelf);
				});

				$clickToRemoveNodes.removeClass($set.toggleClass);
			});

			$body.on('click', function () {
				$env.removeClass($set.toggleClass);
			});
		}

		$btn.on($set.event, function (evt) { //觸發事件
			evt.preventDefault();

			$(this).trigger(_eventNmae);
			if (event.shiftKey == 1 && event.which == 9) {
				$env.removeClass('is-active');
			}
		});

		//--------------------------lele cus kcc
		var $item = getNode.getCtIn(env).find('li'),
		$item_list = $item.eq(-1),
		$item_list_first = $item.eq(0),
			_itemLeng = $item.length;
			$item_list.on('keydown', function (event) {
				if (event.shiftKey == 1 && event.which == 9) {
					$item.eq(_itemLeng-2).focus();
				}else if(event.which == 9){
					$env.removeClass('is-active');
				}
			});
		var $item_list_li = getNode.getCtIn(env).find('.group-list>.in>.ct>.in>ul>li');
		$item_list_li_last = $item_list_li.eq(-1);
		console.log($item_list_li_last);
		$item_list_li_last.on('keydown', function (event) {				
				if(event.which == 9 && !$(this).hasClass('is-active')){
					$env.removeClass('is-active');
				}
			});
		
			//--------------------------lele cus kcc
		$item_list_first.on('keydown', function (event) {
		  if (event.shiftKey == 1 && event.which == 9) {
			$env.removeClass('is-active');
		  }
		});


		//觸發的事件
		$btn.on(_eventNmae, function () {

			// 主要功能...換 class orz
			// $target.toggleClass($set.targetClass);
			$env.toggleClass($set.toggleClass);



			//如果有開啟 cookie 功能就紀錄吧
			if ($env.attr('class').search($set.toggleClass) > -1 && $set.cookie) {
				$.cookie(_uuid, '1',{ expires : 365, path: "/;SameSite=Lax", secure: true});
			} else if (!!$set.cookie) {
				$.cookie(_uuid, '0',{ expires : 365, path: "/;SameSite=Lax", secure: true});
			}

			//如果有開啟更改文字功能就改吧
			if ($btn.text() === $set.btnOrangeText && !!$set.btnActiveText) {
				$btn.text($set.btnActiveText);
				$btn.attr('title', $set.btnActiveText + '[' + _text + ']');
			} else if ($btn.text() === $set.btnActiveText && !!$set.btnOrangeText) {
				$btn.text($set.btnOrangeText);
				$btn.attr('title', $set.btnOrangeText + '[' + _text + ']');
			}
		});

		if ($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 ' + file + '.js 已順利執行。');
		}
	}

	return main;
});