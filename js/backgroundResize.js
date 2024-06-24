define(['getNode'], function(getNode){
	
	function main(env, opt, file){

		var $set = {
				rwd: true,
				debug: false
			}

		$.extend($set, opt);

		var $win = $(window),
			$env = $(env),
			$ct = getNode.getCt($env),
			$span = $ct.find('span');

		var BgObjArray = []; //存放要被本程式控制的物件

		var BgObj = function($node, _mode){ //背景大小重製物件

			this.node = $node;
			this.mode = _mode; //native mode cover or contain
			
			this.box = {
				width: null,
				height: null
			}
			
			var img = document.createElement('img');

			img.src = $node.css('background-image').replace(/(url\('?"?)|('?"?\))/ig, ''); //去掉 url("")

			this.img = {
				width: img.width,
				height: img.height
			}
		}
			
		BgObj.prototype.updateBoxSize = function(){ //更新 box 大小
			this.box.width = this.node.innerWidth();
			this.box.height = this.node.innerHeight();
		}
			
		BgObj.prototype.returnMode = function(){
			this.updateBoxSize();

			if( this.mode === 'cover' ) { //如果是 cover 就要兩邊都更大
				
				if( this.img.width > this.box.width && this.img.height > this.box.height ) {
					return 'cover';
				}else if( this.img.width > this.box.width || this.img.height > this.box.height ) {
					return 'contain';
				}

			}else if( this.mode === 'contain' ) { //如果是 contain 一邊更大即可

				if( this.img.width > this.box.width || this.img.height > this.box.height ) {
					return 'contain';
				}
			}

			return 'auto';
		}

		BgObj.prototype.setMode = function(){ //設定圖片模式
			var _mode = this.returnMode();

			this.node.css('background-size', _mode);
		}

		$span.each(function(i, n){
			
			var $this = $(n);
				_backgroundSize = $this.css('background-size');

			//處理所有有 bgimg 且 bgz 等於 cover 或 contain 的圖片，只處理這兩種狀態
			if( $this.css('background-image') !== 'none' && ( _backgroundSize === 'cover' || _backgroundSize === 'contain' ) ) {
				var $Obj = new BgObj($this, _backgroundSize);

				//設定圖片模式
				$Obj.setMode();

				//加入集合
				BgObjArray.push($Obj); 
			}
		});

		var BgObjArray_length = BgObjArray.length;

		if( $set.rwd ) {

			//改變解析度就 resize
			$win.on('resize', function(){
				
				for( var i = 0; i < BgObjArray_length; i++ ) {
					BgObjArray[i].setMode();
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