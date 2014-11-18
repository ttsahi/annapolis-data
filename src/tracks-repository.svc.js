/**
 * Created by tzachit on 18/11/14.
 */


(function(app){

    'use strict';

    function TracksRepository($distribution){

        var _tracksCollection = [];
        var _onUpdateListeners = [];

        Object.defineProperty(this, 'onupdate', {
            set: function(callback){
                if(typeof callback !== 'function'){
                    return;
                }

                _onUpdateListeners.push(callback);
            }
        });

        this.getAll = function(){
            return _tracksCollection;
        };

        $distribution.onreceive = function (evt) {
            var tracks = angular.fromJson(evt.data);

            for (var i = 0; i < tracks.length; i++) {
                _tracksCollection[tracks[i].id] = tracks[i];
            }

            for (var i = 0; i < _onUpdateListeners.length; i++) {
                _onUpdateListeners[i](tracks);
            }
        };
    }

    app.factory('tracksRepository', ['$distribution', function($distribution){

        return new TracksRepository($distribution);
    }]);

}(angular.module('annapolis-data')));