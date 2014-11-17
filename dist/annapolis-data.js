/**
 * Created by tzachit on 17/11/14.
 */

(function(window, angular, undefiend){

    'use strict';

    var module = angular.module('annapolis-data', []);

    function DistributionService(socketUrl, notifications){

        var _socket = null;
        var _socketUrl = socketUrl;
        var _notifications = notifications;

        var _onStartListeners = [];
        var _onReceiveListeners = [];
        var _onStopListeners = [];
        var _onErrorListeners = [];

        Object.defineProperties(this, {
            socketUrl: {
                get: function(){ return _socketUrl; }
            },
            notifications: {
                get: function(){ return _notifications; },
                set: function(val){
                    if(typeof val !== 'boolean'){
                        return;
                    }

                    _notifications = val;
                }
            },
            onstart: {
                set: function(callback){
                    if(typeof callback !== 'function'){
                        return;
                    }

                    _onStartListeners.push(callback);
                }
            },
            onreceive: {
                set: function(callback){
                    if(typeof callback !== 'function'){
                        return;
                    }

                    _onReceiveListeners.push(callback);
                }
            },
            onstop: {
                set: function(callback){
                    if(typeof callback !== 'function'){
                        return;
                    }

                    _onStopListeners.push(callback);
                }
            },
            onerror: {
                set: function(callback){
                    if(typeof callback !== 'function'){
                        return;
                    }

                    _onErrorListeners.push(callback);
                }
            }
        });

        this.start = function(){
            if(_socket === null || _socket.readyState === WebSocket.CLOSED){
                _socket = initSocket(_socketUrl);
                return true;
            }

            return false;
        };

        this.stop = function(){
            if(_socket !== null){
                _socket.close();
            }
        };

        function initSocket(url){
            var socket = new WebSocket(url);

            socket.onopen = function(){
                if(_notifications){
                    console.log("Distribution start!!!");
                }

                for(var i = 0; i < _onStartListeners.length; i++){
                    _onStartListeners[i]();
                }
            };

            socket.onmessage = function(evt){
                for(var i = 0; i < _onReceiveListeners.length; i++){
                    _onReceiveListeners[i](evt);
                }
            };

            socket.onclose = function(){
                if(_notifications){
                    console.log("Distribution stop!!!");
                }

                for(var i = 0; i < _onStopListeners.length; i++){
                    _onStopListeners[i]();
                }
            };

            socket.onerror = function(){
                if(_notifications){
                    console.log("Distribution error!!!");
                }

                for(var i = 0; i < _onErrorListeners.length; i++){
                    _onErrorListeners[i]();
                }
            };

            return socket;
        }
    }

    module.provider('$distribution', [
        function(){
            var socketUrl = "";
            var notifications = true;

            this.setSocketUrl = function(url){
                socketUrl = url;
            };

            this.allowNotifications = function(val){
                notifications = val;
            };

            this.$get = [function(){

                return new DistributionService(socketUrl, notifications);
            }];
        }
    ]);

}(window, window.angular));