define(['langFilter'], function(langFilter) {

	//取共通平台節點的方法物件

	var _type_module = '0', //模組
		_type_cell = '1', //分割
		_type_tab = '2', //頁籤
		_type_row = '3', //單欄
		_type_list = '4'; //清單
		
	var _method = 'append',
		_extend = 'link',
		_defaultText = 'website index';
	
	if ( langFilter ) {
		_extend = '連結';
		_defaultText = '網站索引';
	}

	return {

		getType: function(env) { //取得 data-type
			return $(env).data('type');
		},

		getIndex: function(env) { //取得 data-index
			return $(env).data('index');
		},

		getChildLen: function(env) { //取得子模組的數量
			return $(env).data('child');
		},

		getIn: function(env) { //取得 in 節點

			var $this = $(env);

			if( $this.children('.bg-drop-layout').length ) {
				return $this.children('.bg-drop-layout').children('.in');
			}

			return $this.children('.in');
		},

		getHd: function(env, add) { //取得 hd 節點
			var $in = this.getIn(env),
				$hd = $in.children('.hd');

			if( !$hd.length && add !== false ) {
				$hd = $('<div class="hd"><div class="in"></div></div>');

				$in.prepend($hd);
			}

			return $hd;
		},

		getHdIn: function(env) { //取得 hd in 節點
			return this.getIn(this.getHd(env));
		},

		getHdLink: function(env, add) { //取得 hd a 節點
			var $hdIn = this.getHdIn(env),
				_type = this.getType(env),
        $link = null;
        // console.log(_type);
        // if( !_type ) {
        // 	$link = $hdIn.children('h4');
        // } else {
        // 	$link = $hdIn.children('h3');
        // }

			$link = $hdIn.find('>div');
			console.log($link)
			if (!$link.length && add !== false) {

			  // if( !_type ) {
			  // 	$link = $('<h4></h4>');
			  // }else {
			  // 	$link = $('<h3></h3>');
			  // }
			  $link = $('<div class="headeH3"></div>');
			  $link.append('<span><a title="' + _defaultText + '[' + _extend + ']" href="#">' + _defaultText + '</a></span>');
			  $hdIn.append($link);
      }
      
			return $link;
		},

		getCt: function(env) { //取得 ct 節點
			return this.getIn(env).children('.ct');
		},

		getCtIn: function(env) { //取得 ct in 節點
			return this.getIn(this.getCt(env));
		},

		getCtList: function(env) { //取得 ct ul 節點，給 group-list、text-list、pic-list 用
			return this.getCtIn(env).children('ul');
		},

		getCtItem: function(env) { //取得 ct li 節點，給 group-list、text-list、pic-list 用
			return this.getCtList(env).children('li');
		},

		getChildGroup: function(env) { //取得子模組節點(群組用)，給 group-list、text-list、pic-list 用

			if( this.getCtIn(env).children('[data-type]').length ) {
				return this.getCtIn(env).children('[data-type]');
			}

			if( this.getCtItem(env).children('[data-type]').length ) {
				return this.getCtItem(env).children('[data-type]');
			}

			return $();
		},

		getCtItemLen: function(env) { //取得 ct li 節點的數量
			return this.getCtList(env).data('data-child');
		},

		getFt: function(env, add) { //取得 ft 節點
			var $in = this.getIn(env),
				$ft = $in.children('.ft');

			if( !$ft.length && add !== false ) {
				$ft = $('<div class="ft"><div class="in"></div></div>');

				$in.append($ft);
			}

			return $ft;
		},

		getFtIn: function(env) { //取得 ft in 節點
			return this.getIn(this.getFt(env));
		},

		getFtList: function(env, add) { //取得 ft ul 節點
			var $ftIn = this.getFtIn(env)
				$ul = $ftIn.children('ul');

			if( !$ul.length && add !== false ) {
				$ul = $('<ul data-index="0"></ul>');

				$ftIn.append($ul);
			}

			return $ul;
		},

		getFtItem: function(env, add) { //取得 ft li 節點
			var $li = this.getFtList(env).children('li');

			return $li;
		},

		getFtItemBtn: function(env, className, add) { //取得 ft li btn 節點
			var $ftList = this.getFtList(env),
				$btn = $ftList.children('.'+ className);

			if( !$btn.length && add !== false ) { //如果沒有這顆按鈕，且沒有明確指定不加入按鈕

				var _method = 'append';

				if( className === undefined ) { //如果是匿名按鈕
					$btn = $('<li><span><a title="'+ _defaultText +'['+ _extend +']" href="#">'+ _defaultText +'</a></span></li>');

				}else {
					var _text = className;
					
					if (_text === 'prev' || _text === 'next') {
						_method = 'prepend';
					}

					if ( langFilter ) {

						if( _text === 'prev' ) {
							_text = '上一則';
						}else if( _text === 'next' ) {
							_text = '下一則';
						}else if( _text === 'more' ) {
							_text = '更多';
						}
					}
					
					$btn = $('<li class="'+ className +'"><span><a title="'+ _text +'['+ _extend +']" href="#">'+ _text +'</a></span></li>');
				}

				$ftList[_method]($btn);
				
				this.updateFtItemLen(env);
				this.updateIndex($btn);
			}

			return $btn;
		},

		updateIndex: function(env) { //更新 data-index
			var $this = $(this)
				$parent = $this.parent(),
				$childs = $parent.children(),
				$childs_l = $childs.length;

			if( $parent.is('ul') ) {
				$parent.attr('data-child', $childs_l);
			}

			for( var i = 0; i < $childs_l; i++ ) {
				$childs.eq(i).attr('data-index', i + 1);
			}

			return $this;
		},

		updateChildLen: function(env) { //更新子模組的數量
			var $this = $(this),
				$childs = this.getChildGroup(env),
				$childs_length = $childs.length;

			$this.attr('data-child', $item_length);

			return $this;
		},

		updateCtItemLen: function(env) { //更新 ct li 節點的數量
			var $this = $(this),
				$list = this.getCtList(env);

			$list.attr('data-child', $list.children().length);

			return $this;
		},

		updateFtItemLen: function(env) { //更新 ft li 節點的數量
			var $this = $(this),
				$list = this.getFtList(env, false),
				$list_l = $list.length;

			for( i = 0; i < $list_l; i++ ) {
				var $ul = $list.eq(i);

				$ul.attr('data-child', $ul.children().length);
			}

			return $this;
		},

		buildGroup: function() { //動態建立group

		}
	}
});