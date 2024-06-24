define(['getNode', 'backgroundFilter'], function(getNode, backgroundFilter){
	
	function main(env, opt, file){

		var $set = {
				auto: false,
				delay: 5000,
				speed: 500,
				sliderType: 0, //預設是 0(箭頭) 1(點點) 2(箭頭+點點)	
				startItem: 0,
				debug: false,
				addHd: false
			}

		$.extend($set, opt);

		if( backgroundFilter ) {
			$set.auto = false;
		}
		
		var _event = file;

		var $content_in = getNode.getCtIn(env),
			$content_ul = $content_in.children('ul'),
			$content_li = $content_ul.children('li'),
			$content_li_length = $content_li.length || 1;

		if( $content_li_length <= 1 ) { //如果輪播項目在一個以下，就掰掰囉~
			return false;
		}
		
		if( $content_li_length <= $set.startItem * 2 + 1 ) { //若有設定起始項目在第 N 個，則至少要有 N * 2 + 1 個才能完整顯示
			console.error(env, '輪播項目不足 '+ ( $set.startItem * 2 + 1 ) +' 個，因此可能會出錯。');
		}
		
		var _start = ( $set.startItem ) * -100;

		$content_li.slice( -1 * $set.startItem ).prependTo($content_ul);

		$content_ul.css({
			'margin-left': _start + '%'
		});
		
		var $env = $(env),
			$content_in_width = $content_in.width(),
			$content_li_width = $content_li.innerWidth();
			
		var $li_persent_width = 100 / Math.round( $content_in_width / $content_li_width ), //把 li 寬度換算成 %
			_offset = -1 * $li_persent_width,
			_aLineLength = 100 / $li_persent_width, //一行有幾個
			_dotLength = Math.ceil($content_li_length / _aLineLength);
		
		var $ctrls = $(),
			$dots = $();
		
		var _index = 0,
			_right = 1,
			_left = -1;
			
		if( $set.sliderType !== 1 ) { //加箭頭

			var $hd_a = getNode.getHdLink(env,$set.addHd),
				$hd_a_text = $hd_a.text();
			
			var $next_li = getNode.getFtItemBtn(env, 'next'),
				$prev_li = getNode.getFtItemBtn(env, 'prev');

			var $prev_li_a = $prev_li.find('a'),
				$next_li_a = $next_li.find('a');

			var $prev_li_a_text = $prev_li_a.text(),
				$next_li_a_text = $next_li_a.text(),
				$next_text = $prev_li_a_text + $hd_a_text,
				$prev_text = $next_li_a_text + $hd_a_text;

			$next_text = $next_text.replace(/\s/g, '');
			$prev_text = $prev_text.replace(/\s/g, '');

			$prev_li_a.text($next_text);
			$next_li_a.text($prev_text);

			$prev_li_a.attr('title', $next_text);
			$next_li_a.attr('title', $prev_text);
				
			$ctrls = $ctrls.add($prev_li);
			$ctrls = $ctrls.add($next_li);
				
			$prev_li_a.on('click', function(evt){
				evt.preventDefault();
	
				slider(_left);
			});
	
			$next_li_a.on('click', function(evt){
				evt.preventDefault()
	
				slider(_right);
			});
		}
		
		if( $set.sliderType === 1 || $set.sliderType === 2 ) { //點點
			
			var $more_li = getNode.getFtItemBtn(env, 'more'),
				$more_li_a = $more_li.find('a'),
				_href = $more_li_a.attr('href'),
				_target = $more_li_a || '_self';

			for(var i = 0; i < _dotLength; i++ ) {
				
				var $dot = getNode.getFtItemBtn(env, 'slider-item'+ (i + 1)),
					$a = $dot.find('a'),
					_info = '輪播項目'+ (i + 1);

				$a.attr('href', _href);
				$a.attr('title', _info);
				$a.attr('target', _target);
				$a.text(_info);

				$dot.addClass('is-dot');
				
				$a.on(_event, function(){
					slider(_aLineLength);
				});

				$dots = $dots.add($dot);
			}
			
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

		compareWidth();

		function slider(_away){ //輪播的方法

			if( compareWidth() ) {

				$content_li = $content_ul.children('li'); //重取 dom

				if (_away > 0) { //如果往右

					$content_ul.stop().animate({
						'margin-left': _start + (_away * _offset) + '%' //讓 ul 變成 -$li_width
					}, $set.speed, function(){
						$content_li.slice(0,  _away ).appendTo($content_ul); //把第一個變成最後一個
						$content_ul.css('margin-left', _start + '%'); //調整 margin-_left 為 0
					});

				} else { //如果往左

					$content_ul.css('margin-left', _start + (Math.abs(_away) * _offset) + '%'); //預先調整 margin-_left
					$content_li.slice(_away).prependTo($content_ul); //把最後一個變成第一個

					$content_ul.stop().animate({
						'margin-left': _start + '%' //讓 ul 變成 -$li_width
					}, $set.speed);
				}
			}
		}

		function compareWidth(){ //比較播放列表與撥放框的寬度
			$content_in_width = $content_in.width();
			$content_li_width = $content_li.innerWidth();
			_aLineLength = 100 / $li_persent_width; //一行有幾個
			_dotLength = Math.ceil($content_li_length / _aLineLength);

			if( $content_in_width + $content_li_width / 2 >= $content_li_width * $content_li_length ) {
				$ctrls.fadeOut();
				$dots.fadeOut();

				return false;
			}else {
				$ctrls.show();
				$dots.show();

				return true;
			}
		}

		if ($set.auto) { //如果要輪播
			var timer; //設定計時器

			function auto() { //設定自動撥放涵式
				slider(1);
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