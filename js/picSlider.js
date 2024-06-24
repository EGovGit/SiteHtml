define(['getNode'], function(getNode){
	
	function main(env, opt, file){

		var $set = {
				auto: false, //是否自動撥放
				delay: 5000, //停留時間
				speed: 300, //輪播速度
				animateType: 0, //預設值是 0(淡入/淡出) 1(隨機) 2(上下切換) 3(左右切換) 4(依序掉落) 5(上下交叉)
				sliderType: 0, //預設是 0(箭頭) 1(點點) 2(箭頭+點點) 3(縮圖) 4(箭頭+縮圖)
				sliceLeng: 10, //切片數量
				activeClass: 'is-active', //啟動點點的 class
				debug: false
			}

		$.extend($set, opt);

		var _event = 'change.node';

		var $env = $(env),
			$video = $env.find('video'),
			$ul = getNode.getCtList(env);

		var _haveVideo = !!$video.length

		if( _haveVideo ) { // 如果有影片
			$set.animateType = 0;
			$set.auto = false;
		}

		var $content_li = getNode.getCtItem(env),
			$content_li_length = $content_li.length;

		if( $content_li_length <= 1 ) { //如果輪播項目在一個以下，就掰掰囉~
			return false;
		}

		var $dots = $();

		var _index = 0, //被播放的順序
			_right = 1,
			_left = -1;

		if( $set.sliderType !== 1 && $set.sliderType !== 3  ) { //箭頭
		
			var $prev_li = getNode.getFtItemBtn(env, 'prev'),
				$next_li = getNode.getFtItemBtn(env, 'next');

			var $prev_li_a = $prev_li.find('a'),
				$next_li_a = $next_li.find('a');

			$prev_li_a.on(_event, function(){
				slider(_left);
			});

			$prev_li_a.on('click', function(evt){
				evt.preventDefault();

				$(this).trigger(_event);
			});

			$next_li_a.on(_event, function(){
				slider(_right);
			});

			$next_li_a.on('click', function(evt){
				evt.preventDefault();

				$(this).trigger(_event);
			});
		}

		if( $set.sliderType === 1 || $set.sliderType === 2 || $set.sliderType === 3 || $set.sliderType === 4 ) { //點點 & 縮圖

			for( var i = 0; i < $content_li_length; i++ ) {
				var $dot = getNode.getFtItemBtn(env, 'slider-item'+ (i + 1)),
					$a = $dot.find('a'),
					$img = $content_li.eq(i).find('img'),
					_src = $img.attr('src'),
					_info = $img.attr('title') || $img.attr('alt') || '輪播項目'+ (i + 1);

				var $link_a = $content_li.eq(i).find('a'),
					_href = _src,
					_target = null;

				if( $link_a.length ) { //如果有 a
					_href = $link_a.attr('href');
					_target = $link_a.attr('target') || '_self';
				}

				if( _haveVideo && !$img.length ) { //如果有影片而且該項目內找不到圖片
					_src = $content_li.eq(i).find('video').data('src');
				}

				$a.attr('href', _href);
				$a.attr('target', _target);
				$a.attr('title', _info);
				$a.text(_info);

				$dots = $dots.add($dot);

				if( $set.sliderType === 1 || $set.sliderType === 2 ) { //點點

					$dot.addClass('is-dot');

				}else if( $set.sliderType === 3 || $set.sliderType === 4 ) { //縮圖

					var $span = $dot.find('span');

					$span.css({
						'background-image': 'url('+ _src +')'
					});
					
					$dot.addClass('is-img');
				}

				(function(j){ //閉包傳遞參數

					$a.on(_event, function(){
						slider(j - _index);
					});
				})(i)

				$a.on('click focusin', function(evt){
					evt.preventDefault();

					$(this).trigger(_event);
				});

				$a.on('keydown', function(evt){

					var _enter_key = 13;

					if( evt.which === _enter_key ) {
						evt.preventDefault();
						
						var $this = $(this),
							_href = $this.attr('href'),
							_target = $this.attr('target');

						if( _href ) {
							window.open(_href, _target);
						}
					}
				});
			}
		}

		$env.touchwipe({
			wipeLeft: function() {

				slider(_left);
				clearTimeout(timer);
			},
			wipeRight: function() {

				slider(_right);
				clearTimeout(timer);
			},
			min_move_x: 20,
			min_move_y: 20,
			preventDefaultEvents: false
		});

		slider(0); //播放第一個

		function slider(_away) { //輪播特效

			_index = (_index + _away + $content_li_length) % $content_li_length; //算出第幾個要被撥放

			var _at = $set.animateType;

			if( _at === 1 ) { //如果是 1(隨機)
				_at = Math.floor(Math.random() * 6); //就隨機選一種 case，也有可能是 0，6 是寫死的特效數量，有擴充要再加
			}

			var $node = $content_li.eq(_index),
				_img = $node.find('img').attr('src');

			switch (_at) {

				case 2: //上下切換

					$('.'+ file).remove();

					var $dom = $('<div class="'+ file +'">'),
						$img = $('<img alt="animation images" src="'+ _img +'">');

					$ul.css({
						'position': 'relative',
						'overflow': 'hidden'
					});

					$dom.css({ //設定css
						'position': 'absolute',
						'right': 0,
						'left': 0
					});

					$img.css({ //設定css
						'display': 'block',
						'width': '100%'
					});

					$dom.append($img);
					$ul.append($dom); //插入 dom

					if( _away === _left ) {
						$dom.css({'bottom': '100%'});  //設定css
						$dom.stop().animate({'bottom': 0}, $set.speed, end); //設定動畫

					}else if( _away === _right ) {
						$dom.css({'top': '100%'});  //設定css
						$dom.stop().animate({'top': 0}, $set.speed, end); //設定動畫
					}

					function end() {
						$node.show().siblings().hide(); //show 出圖片並刪除遮罩

						console.log($dom)
						$dom.remove();
					}

					break;

				case 3: //左右切換

					$('.'+ file).remove();

					var $dom = $('<div class="'+ file +'">'),
						$img = $('<img alt="animation images" src="'+ _img +'">');

					$ul.css({
						'position': 'relative',
						'overflow': 'hidden'
					});

					$dom.css({ //設定css
						'position': 'absolute',
						'width': '100%',
						'top': 0
					});

					$img.css({ //設定css
						'display': 'block',
						'width': '100%'
					});

					$dom.append($img);
					$ul.append($dom); //插入 dom

					if( _away === _left ) {
						$dom.css({'left': '100%'});  //設定css
						$dom.stop().animate({'left': 0}, $set.speed, end); //設定動畫

					}else if( _away === _right ) {
						$dom.css({'right': '100%'});  //設定css
						$dom.stop().animate({'right': 0}, $set.speed, end); //設定動畫
					}

					function end() {
						$node.show().siblings().hide(); //show出圖片並刪除遮罩
						$dom.remove();
					}

					break;

				case 4: //依序掉落

					$('.'+ file).remove();

					var length = $set.sliceLeng, //設定片數
						_animateSpeed = $set.speed / length,
						$doms = $(), //遮罩
						virtual_ani = 0; //虛擬動畫

					$ul.css({
						'position': 'relative',
						'overflow': 'hidden'
					});

					for( i = 0; i < length; i++) { //加入 jquery dom

						var $dom = $('<div class="'+ file +'">'),
							$img = $('<img alt="animation images" src="'+ _img +'">');

						$dom.css({
							'position': 'absolute',
							'left': 0,
							'top': 0,
							'width': ( 100 / length ) * ( i + 1 ) +'%',
							'overflow': 'hidden',
							'bottom': '100%'
						});

						$img.css({'width': (length * 100) / ( i + 1 ) +'%'});

						$dom.append($img);
						$doms = $doms.add($dom);
					}

					$ul.append($doms); //插入dom

					$doms.each(function(i, d){ //依序執行動畫
						$(d).stop().delay( _animateSpeed * i ).animate({'bottom': 0}, $set.speed);
					});

					$ul.stop().animate({virtual_ani: 100}, $set.speed * 2, function() { //結束後顯示圖片並刪除遮罩，以虛擬動畫計時
						$node.show().siblings().hide(); //show出圖片並刪除遮罩
						$doms.remove();
					});

					break;

				case 5: //上下交叉

					$('.'+ file).remove();

					var length = $set.sliceLeng, //設定片數
						$doms = $(), //單數遮罩
						$domd = $(), //雙數遮罩
						virtual_ani = 0; //虛擬動畫

					$ul.css({
						'position': 'relative',
						'overflow': 'hidden'
					});

					for( i = 0; i < length; i++) { //加入 jquery dom

						var $dom = $('<div class="'+ file +'">'),
							$img = $('<img alt="animation images" src="'+ _img +'">');

						$dom.css({
							'position':'absolute',
							'left': ( 100 / length ) * i +'%',
							'width': ( 100 / length ) +'%',
							'overflow': 'hidden'
						});

						$img.css({
							'width': (length * 100) +'%',
							'margin-left': -100 * i +'%'
						});

						$dom.append($img);
						$doms = $doms.add($dom);

						if( i % 2 ) { //單數與雙數分開來設定，並分開存取

							$dom.css({
								'top': 0,
								'bottom': '100%'
							});

							$doms = $doms.add($dom);

						} else {

							$dom.css({
								'bottom': 0,
								'top': '100%'
							});

							$domd = $domd.add($dom);
						}
					}

					$ul.append($doms).append($domd); //插入dom

					$doms.stop().animate({ //分別執行兩種動畫
						'bottom': 0
					}, $set.speed);

					$domd.stop().animate({
						'top': 0
					}, $set.speed);

					$ul.stop().animate({virtual_ani: 100}, function() {
						$node.show().siblings().hide();
						$doms.remove();
						$domd.remove();
					});  //結束後顯示圖片並刪除遮罩，以虛擬動畫計時

					break;

				default: // 0 and 1 淡入淡出

					$node.stop().fadeIn($set.speed).siblings().hide(); //show出圖片並把其他隱藏
			}

			$dots.removeClass($set.activeClass);
			$env.find('.slider-item'+ (_index + 1)).addClass($set.activeClass);
		}

		if ($set.auto) { //如果要輪播
			var timer; //設定計時器

			var $all_a = $env.find('a'),
				$first_a = $all_a.eq(0),
				$last_a = $all_a.eq(-1);

			function auto() { //設定自動撥放涵式

				slider(_right); //預設向右撥放
				timer = setTimeout(auto, $set.delay);
			}

			function autoStart(){
				clearTimeout(timer);
				timer = setTimeout(auto, $set.delay);
			}

			function autoClear(){
				clearTimeout(timer);
			}
			
			$env.on('mouseenter', function(){ //設定滑進滑出項目
				autoClear();
			});

			$env.on('mouseleave', function(){
				autoStart();
			});

			$first_a.on('focusin', function(){
				autoClear();
			});

			$last_a.on('focusout', function(){
				autoStart();
			});

			timer = setTimeout(auto, $set.delay); //輪播開始
		}

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});