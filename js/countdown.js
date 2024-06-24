define(['langFilter'], function(langFilter){
	
	function main(env, opt, file){

		var $set = {
				debug: false,
				year: 2036,
				month: 1,
				day: 1,
				hour: 0,
				minute: 0,
				second: 0,
				delayTime: 1000, //多久計時一次(ms)
				lang: 'en',
				arrivedMessage: null,
				en: {
					'day':'days',
					'hour': 'hours',
					'minute': 'min',
					'second': 'sec',
					'millisecond': 'ms',
					'arrivedMessage': 'It\'s now!'
				},
				ch: {
					'day': '日',
					'hour': '時',
					'minute': '分',
					'second': '秒',
					'millisecond': '毫秒',
					'arrivedMessage': '已開始!'
				}
			}

		$.extend(true, $set, opt);

		if( langFilter ) {
			$set.lang = 'ch';
		}

		var $this = $(env),
			$ct = $this.find('.ct'),
			$in = $ct.children('.in');

		var _new = (new Date()).getTime(),
			_target_moment = (new Date( $set.month +'/'+ $set.day +'/'+ $set.year +' '+ $set.hour +':'+ $set.minute +':'+ $set.second)).getTime(); //目標時間

		var timer = setTimeout(main, $set.delayTime);

		var _child_len = 0;

		var _day = 86400000,
			_hour = 3600000,
			_minute = 60000,
			_second = 1000;

		if( $set.delayTime < _second - 1 ) {
			_child_len = 4;
		}else if ( $set.delayTime < _minute - 1 ){
			_child_len = 3;
		}else if ( $set.delayTime < _hour - 1 ){
			_child_len = 2;
		}else if ( $set.delayTime < _day - 1 ){
			_child_len = 1;
		}

		var $returnText = [
			function(d){ return '<ul data-index="1" data-child="1"><li data-index="1" class="is-day"><span>'+ d +'<i class="mark">'+ $set[$set.lang].day +'</i></span></li></ul>'; },
			function(d,h){ return '<ul data-index="1" data-child="2"><li data-index="1" class="is-day"><span>'+ d +'<i class="mark">'+ $set[$set.lang].day +'</i></span></li><li data-index="2" class="is-hour"><span>'+ h +'<i class="mark">'+ $set[$set.lang].hour +'</i></span></li></ul>'; },
			function(d,h,m){ return '<ul data-index="1" data-child="3"><li data-index="1" class="is-day"><span>'+ d +'<i class="mark">'+ $set[$set.lang].day +'</i></span></li><li data-index="2" class="is-hour"><span>'+ h +'<i class="mark">'+ $set[$set.lang].hour +'</i></span></li><li data-index="3" class="is-minute"><span>'+ m +'<i class="mark">'+ $set[$set.lang].minute +'</i></span></li></ul>'; },
			function(d,h,m,s){ return '<ul data-index="1" data-child="4"><li data-index="1" class="is-day"><span>'+ d +'<i class="mark">'+ $set[$set.lang].day +'</i></span></li><li data-index="2" class="is-hour"><span>'+ h +'<i class="mark">'+ $set[$set.lang].hour +'</i></span></li><li data-index="3" class="is-minute"><span>'+ m +'<i class="mark">'+ $set[$set.lang].minute +'</i></span></li><li data-index="4" class="is-second"><span>'+ s +'<i class="mark">'+ $set[$set.lang].second +'</i></span></li></ul>'; },
			function(d,h,m,s,ms){ return '<ul data-index="1" data-child="5"><li data-index="1" class="is-day"><span>'+ d +'<i class="mark">'+ $set[$set.lang].day +'</i></span></li><li data-index="2" class="is-hour"><span>'+ h +'<i class="mark">'+ $set[$set.lang].hour +'</i></span></li><li data-index="3" class="is-minute"><span>'+ m +'<i class="mark">'+ $set[$set.lang].minute +'</i></span></li><li data-index="4" class="is-second"><span>'+ s +'<i class="mark">'+ $set[$set.lang].second +'</i></span></li><li data-index="5" class="is-millisecond"><span>'+ ms +'<i class="mark">'+ $set[$set.lang].millisecond +'</i></span></li></ul>'; },
		][_child_len];

		function main(){

			_new += $set.delayTime;

			if( _new > _target_moment ) {
				var _text = $set.arrivedMessage || $set[$set.lang].arrivedMessage;

				printToclient('<span>'+ _text +'</span>');

				return false;
			}

			var _text = convertToCount( _target_moment - _new );

			printToclient( _text );

			timer = setTimeout(main, $set.delayTime); //輪播開始
		}

		function convertToCount( _ms ){
			var _d = Math.floor(_ms / _day),
				_h = Math.floor((_ms % _day) / _hour),
				_m = Math.floor((_ms % _hour) / _minute),
				_s = Math.floor((_ms % _minute) / _second),
				_ms = _ms % _second;

			return $returnText(_d, _h, _m, _s, _ms);
		}

		function printToclient( _text ){
			$in.html(_text);
		}

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');

			console.info('目標時間是：', _target_moment);
		}
	}
	
	return main;
});