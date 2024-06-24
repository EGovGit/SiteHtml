define(function(){

	return function(){
		
		if( !( window.console && console.log ) ) { //如果沒有 console.log，就用return

			window.console = {
				'log': function(msg) {
					return 'log: ' + msg
				},
				'info': function(msg) {
					return 'info: ' + msg
				},
				'error': function(msg) {
					return 'error: ' + msg
				}
			}
		}
	}
});