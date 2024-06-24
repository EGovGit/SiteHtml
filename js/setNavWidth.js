define(['getNode'], function(getNode){
	
	function main(env, opt, file){

		var $set = {
				debug: false
			}

		$.extend($set, opt);
		
		var $ul = getNode.getCtList(env),
			$ul_l = $ul.offset().left,
			$ul_w = $ul.outerWidth(),
			$li = $ul.children('li'), //取 li
			$li_w = $li.width(),
			$li_display = $li.css('display'),
			$li_float = $li.css('float'),
			_base_len = Math.round($ul_w / $li_w); //預設選單數量

		if( $li_float === 'none' && $li_display !== 'inline-block' && $li_display !== 'inline' ) {  //如果是直選單

			$li.each(function(i, d){
				var $this = $(this),
					_width = parseFloat($this.attr('data-width')) || 2;

				var $module = $this.children('[data-index][data-type]'),
					$ct = getNode.getCt($module);

				$ct.css({ 
					'width': ( _width * 100 ) + '%'
				});
			});

		}else if( ( $li_display === 'list-item' || $li_display === 'block' ) && $li_float !== 'none' ) {  //如果選單寬度固定平均分割

			$li.each(function(i, d){
				var $this = $(this),
					// _index = $this.data('index'), //等同於 i + 1
					_width = parseFloat($this.attr('data-width')) || 2;

				var $module = $this.children('[data-index][data-type]'),
					$ct = getNode.getCt($module);

				if( _width >= _base_len ) { //如果 data-width 大於可分割數值

					$ct.css({ 
						'width': ( _base_len * 100 ) + '%',
						'left': ( -100 * ( i % _base_len )) + '%'
					});

				}else if( i % _base_len + _width > _base_len ) { //如果超出邊界就往回推

					var _index = i;

					if( _index > _base_len ) { // 因為 7 % 7 會等於 0
						_index = _index % _base_len;
					}

					$ct.css({ 
						'width': ( _width * 100 ) + '%',
						'left': ( -100 * (( _index % _base_len + _width ) - _base_len )) + '%'
					});

				}else {

					$ct.css({ 
						'width': ( _width * 100 ) + '%'
					});
				}
			});

		}else if( $li_display === 'inline-block' ) { //如果選單寬度隨文字變化

			$li.each(function(i, d){
				var $this = $(this),
					$this_l = ( $this.offset().left ) - $ul_l,
					$this_w = $this.width(),
					_width = parseFloat($this.attr('data-width')) || 2;

				var $module = $this.children('[data-index][data-type]'),
					$ct = getNode.getCt($module),
					$ct_w = $this_w * _width;

				if( $ct_w >= $ul_w ) { //如果寬度大於父層

					$ct.css({ 
						'width': $ul_w + 'px',
						'left': -1 * $this_l + 'px'
					});

				}else if( $ct_w + $this_l > $ul_w ) { //如果超出邊界就往回推

					$ct.css({ 
						'width': $ct_w,
						'left': -1 * ( ( $ct_w + $this_l ) - $ul_w ) + 'px'
					});

				}else {

					$ct.css({ 
						'width': $ct_w + 'px'
					});
				}
			});
		}

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});