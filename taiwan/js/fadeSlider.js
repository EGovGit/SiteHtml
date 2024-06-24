define(['getNode', 'backgroundFilter'], function(getNode, backgroundFilter){
	
	function main(env, opt, file){

		var $set = {
				auto: false,
				delay: 5000, //停留時間
				speed: 300, //輪播速度
				sliderType: 0, //預設是 0(箭頭) 1(點點) 2(箭頭+點點)				
				debug: false
			}

		$.extend($set, opt);

		if( backgroundFilter ) {
			$set.auto = false;
		}

		var _event = file;

		var $env = $(env);

		var $content_li = getNode.getCtItem(env),
			$content_li_length = $content_li.length;

		if( $content_li_length <= 1 ) { //如果輪播項目在一個以下，就掰掰囉~
			return false;
		}

		var $dots = $();

		var _index = 0, //被播放的順序
			_right = 1,
			_left = -1;
			
		if( $set.sliderType !== 1 ) { //箭頭
		
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
		
		if( $set.sliderType === 1 || $set.sliderType === 2 ) { //點點

			$content_li.each(function(i, d){
				var $this = $(this);

				var $dot = getNode.getFtItemBtn(env, 'slider-item'+ (i + 1)),
					$a = $dot.find('a'),
					_href = $this.find('a').attr('href') || _src,
					_target = $this.find('a').attr('target') || '_self',
					_info = '輪播項目'+ (i + 1);

				$a.attr('href', _href);
				$a.attr('title', _info);
				$a.attr('target', _target);
				$a.text(_info);

				$dot.addClass('is-dot');
				
				$a.on(_event, function(){
					slider(i - _index);
				});

				$dots = $dots.add($dot);
			});
			
			$dots.find('a').on('click focusin', function(evt){
				evt.preventDefault();

				$(this).trigger(_event);
			});
			
			$dots.find('a').on('keydown', function(evt){

				var _enter_key = 13;

				if( evt.which === _enter_key ) {
					evt.preventDefault();

					var $this = $(this),
						_href = $this.attr('href'),
						_target = $this.attr('target');

					window.open(_href, _target);
				}
			});
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

			var $node = $content_li.eq(_index);

			$node.stop().fadeIn($set.speed).siblings().hide(); //show 出物件並把其他隱藏
		}

		if ($set.auto) { //如果要輪播
			var timer; //設定計時器

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

			$env.on('focusin', function(){
				autoClear();
			});

			$env.on('focusout', function(){
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