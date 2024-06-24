define(['focusNodeFilter'], function(focusNodeFilter){ //取下一個可見 focus 節點
    var $all_a = focusNodeFilter;

    var main = function(node, away){

        var $this = $(node),
            _index = $all_a.index($this);

        if( away === 'prev' ) {
            var _prev = _index - 1;

            for( var i = _prev; i >= 0; i-- ) {

                if( $all_a.eq(i).is(':visible') ) {
                    return $all_a.eq(i);
                }
            }

            return $();

        }else {
            var _next = _index + 1;

            for( var i = _next; i <= $all_a.length; i++ ) {

                if( $all_a.eq(i).is(':visible') ) {
                    return $all_a.eq(i);
                }
            }
            
            return $();
        }
    }

    return main;
});