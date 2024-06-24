var $jMap = (function(MapID, txtID, Modify) {
    var _modify = Modify || false;
    var _mode = ''; //Mark Polyline Polygon
    var _Places_markers = [];
    var _places;
    var _markers = {};
    var _polyline = new TGOS.TGLine();
    var _polygon = null;
    var _infowindow = new TGOS.TGInfoWindow();
    var _MapDiv = document.getElementById(MapID);


    var _Centerlatlng = new TGOS.TGPoint(120.290602, 22.627883);
    $map = new TGOS.TGOnlineMap(_MapDiv, TGOS.TGCoordSys.EPSG3857);
    $map.setCenter(_Centerlatlng);
    $map.setZoom(11);
   
    if (txtID != '') {
        var input = document.getElementById(txtID);
        var button = $('<input type="button" value="input"></input>');
        var newDiv = document.createElement("div");
        $(newDiv).css("white-space", "nowrap");
        $(newDiv).css("position", "relative");
        $(newDiv).css("top", "10px");
        $(newDiv).css("left", "10px");
        var SearchBtn = document.createElement("input");
        $(SearchBtn).attr('type', 'button');
        $(SearchBtn).attr('value', '查詢');
        $(newDiv).append($(input));
        $(newDiv).append($(SearchBtn));
        //設定網頁顯示層級
        input.index = 1;
        //將控制項放到TOP_CENTER
        $map.controls[TGOS.TGControlPosition.LEFT_TOP].push(newDiv);

        $(SearchBtn).click(function () {
            var Add = $(input).val();
            var LService = new TGOS.TGLocateService();			//宣告一個新的定位服務
            var request = {			
                poi: Add
            };
            var LServiceResult = [];
            LService.locateWGS84(request, function (result1, status) {	//進行定位查詢, 並指定回傳資訊為TWD97坐標系統
                if (result1) LServiceResult = LServiceResult.concat(result1);
            request = {				
                address: Add
            };
            LService.locateWGS84(request, function (result1, status) {	//進行定位查詢, 並指定回傳資訊為TWD97坐標系統
                if (result1) LServiceResult = LServiceResult.concat(result1);
                
                console.log(LServiceResult);
                _ClearAllPlacesMarkers();
                LServiceResult.forEach(function (result) {
                    console.log(result);
                    var marker = new TGOS.TGMarker($map, new TGOS.TGPoint(0, 0));
                    marker.setVisible(true);
                    marker.setZIndex(1000);
                    marker.setPosition(result.geometry.location);  //將定位結果以標記顯示
                    marker.setCursor('pointer');
                    var oTGImage = new TGOS.TGImage("https://www.tgos.tw/MapSites/Resources/Project/Images/Marker/DMarker2.png");
                    marker.setIcon(oTGImage);
                    $map.fitBounds(result.geometry.viewport);	//將地圖畫面移至符合查詢之位置	
                    TGOS.TGEvent.addListener(marker, "click", function () {
                        _SavePlaceInfowindow(result, marker);
                        
                        _infowindow.setPosition(marker.position);
                        _infowindow.open($map);
                    });
                    _Places_markers.push(marker);
                });
            });
           
            });
            
             
        })

    }
 
    $(document).on("click", '#ModifyMark', function () {
        var marker = _infowindow.anchor;
        var buttonstring = '';
        buttonstring += '<input id="SaveMark" value="儲存" type="button" />'
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading"><input type="text" id="title" value="' + marker.title + '" /></h1>' +
            '<div id="bodyContent">' +
            '<p><textarea type="text" id="description" style="margin: 0px; width: 350px; height: 220px" >' + marker.description.replace(/<br\s?\/?>/g, "\n") + '</textarea><p>' +
            buttonstring +
            '</div>' +
            '</div>';
        _infowindow.setContent(contentString);
        _infowindow.update();
    });
    $(document).on("click", '#DeleteMark', function() {
        var marker = _infowindow.anchor;
        _infowindow.close();
        _DeleteMarker(marker);
    });
    $(document).on("click", '#Place_ToMark', function() {
        var anchor = _infowindow.anchor;
        _AddMarker(anchor);
        _infowindow.marker.setMap(null);
        _infowindow.close();
    });

    TGOS.TGEvent.addListener(_infowindow, 'content_changed', function () {
        var button;
        if (document.getElementById('SaveMark')) {
            button = document.getElementById('SaveMark');
            button.onclick = function() {
                // Get input value and call setMarkerTitle function
                var title = document.getElementById('title').value;
                var description = document.getElementById('description').value;
                var marker = _infowindow.anchor;
                marker.title = title;
                marker.description = description.replace(/(?:\r\n|\r|\n)/g, '<br />');
                _infowindow.close();
                TGOS.TGEvent.trigger(marker, 'click');
            };
        }

    });
    var _GetMarksPositionArray = function() {
        var arr = [];
        for (var id in _markers) {
            arr.push(_markers[id].getPosition());
        }
        return arr;
    }

    var _ClearPoly = function () {
        try {
            _polyline.setMap(null);
            _polygon.setMap(null);
        } catch (e) {

        }
        
    }

    var _ChangeMode = function (mode) {
        console.log("_ChangeMode");
        _mode = mode;
        _BuildMode();
    }
    var _BuildMode = function () {
        console.log("_BuildMode");

        _ClearPoly();
        if (_mode == 'Mark') {

        }
        if (_mode == 'Polyline') {
            _Marker2Polyline();
        }
        if (_mode == 'Polygon') {
            _Marker2Polygon();
        }

    }

    var _Marker2Polyline = function() {
        _ClearPoly();
        var path1 = _GetMarksPositionArray();
        if (path1.length > 0) {
            var s1 = new TGOS.TGLineString(path1);
            _polyline = new TGOS.TGLine($map, s1, {
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            _polyline.setMap($map);
        }
    }

    var _Marker2Polygon = function Marker2Polygon() {
        _ClearPoly();
        var path1 = _GetMarksPositionArray();
        var path2 = new TGOS.TGLineString(path1);
        var boarder = new TGOS.TGLinearRing(path2);
        var district1 = new TGOS.TGPolygon([boarder]);
        _polygon = new TGOS.TGFill($map, district1, { fillOpacity:0.5});
        
        //_polygon.setMap($map);
    }
    var _ClearAllPlacesMarkers = function(oldmarker) {
        _Places_markers.forEach(function(marker) {
            marker.setMap(null);
        });
        _Places_markers = [];
    }
    var _ClearAllMarkers = function(oldmarker) {
        for (var id in _markers) {
            var mark = _markers[id];
            _DeleteMarker(mark);
        }
    }
    var _DeleteMarker = function(marker) {
        marker.setMap(null);
        delete _markers[marker.id];
        _BuildMode();
    }
    var _AddMarker = function (oldmarker) {
        var marker = new TGOS.TGMarker($map, oldmarker.position, oldmarker.title);
        var oTGImage = new TGOS.TGImage("https://www.tgos.tw/MapSites/Resources/Project/Images/Marker/DMarker8.png");
        marker.setIcon(oTGImage);
        marker.setDraggable(Modify);
        marker.setCursor('pointer');
        console.log(Modify, "Modify");
        marker.setZIndex(1000);
        marker.id = _guid();
        marker.description = oldmarker.description;
        //marker.draggable =Modify;
        //    marker.addListener = function (action, f) {

        //    TGOS.TGEvent.addListener(oTGOS, action, f); //滑鼠事件監聽
        //};

          
        _markers[marker.id] = marker; // cache marker in markers object
        TGOS.TGEvent.addListener(marker, "click", function () {
            _SaveInfowindow(marker);
            _infowindow.setPosition(marker.position);
            _infowindow.open($map);

        });
        TGOS.TGEvent.addListener(marker, "draggable_changed", function () {
            _BuildMode();
        });
 

        TGOS.TGEvent.addListener(marker, "position_changed",

            function () { _BuildMode(); }
        );



        _BuildMode();
       
    }

    function _SavePlaceInfowindow(place, marker) {
        var img = '';
        if (place.hasOwnProperty('photos')) {
            var imgUrl = place.photos[0].getUrl({
                maxWidth: 250,
                maxHeight: 250
            });
            img = '<img id="img" src="' + imgUrl + '">';
        }
        var name = place.poiName || place.formattedAddress;
        var buttonstring = '';
        if (_modify) {
            buttonstring = '<input id="Place_ToMark" value="加入" type="button" />';
        }
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            img +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>' +
            '<div id="bodyContent">' +
            '<p>' + name+ '<p>' +
            buttonstring +
            '</div>' +
            '</div>';
        _infowindow.anchor = { position: place.geometry.location, title: name, description: name };
        _infowindow.marker = marker;
        _infowindow.setContent(contentString);
    }

    function _SaveInfowindow(marker) {
        var buttonstring = '';
        if (_modify) {
            buttonstring += '<input id="ModifyMark" value="修改" type="button" />'
            buttonstring += '<input id="DeleteMark" value="刪除" type="button" />'
        }
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + marker.title + '</h1>' +
            '<div id="bodyContent">' +
            '<p>' + marker.description + '<p>' +
            buttonstring +
            '</div>' +
            '</div>';
        _infowindow.anchor = marker;        
        _infowindow.setContent(contentString);
    }

    function _guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    //取得設定 包含目前Mode 與 Markers
    var _GetData = function() {
        var arr = [];
        for (var id in _markers) {
            var mark = _markers[id];
            arr.push({
                lat: mark.position.y,
                lng: mark.position.x,
                title: mark.title,
                description: mark.description
            });
        }
        return {
            mode: _mode,
            map: {
                lat: $map.getCenter().y,
                lng: $map.getCenter().x,
                zoom : $map.getZoom()
            },
            datas: arr
        };
    }

    //寫回設定
    var _SaveData = function(obj) {
       
        _SaveSaveMarks(obj.datas);
        $map.setCenter(new TGOS.TGPoint(obj.map.lng, obj.map.lat));
        $map.setZoom(obj.map.zoom);
        _ChangeMode(obj.mode);
        console.log(obj, '寫回設定');
    }


    //加入 MarksArray 元Marks不清除
    var _SaveSaveMarks = function(arr) {
        if (arr.length == 0) return false;
        arr.forEach(function(marker) {
            marker.position = new TGOS.TGPoint(marker.lng, marker.lat ); 
            _AddMarker(marker);
        });
        console.log('_SaveSaveMarks');
    }

    return {
        map: $map,
        ChangeMode: _ChangeMode,
        Marks: _markers,
        GetData: _GetData,
        SaveData: _SaveData,
        SaveMarks: _SaveSaveMarks,
        ClearAllMarkers: _ClearAllMarkers,
        ClearAllPlacesMarkers: _ClearAllPlacesMarkers
    }

});

