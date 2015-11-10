angular.module('songhop.services', [])
  .factory('User', function(){

    var o = {
      favorites: []
    }

    o.addSongToFavorites = function(song){
      //make sure there is a song to add
      if (!song) return false;
      //add to favorites array
      o.favorites.unshift(song);
    };

    o.removeSongFromFavorites = function(song, index){
      // make sure there is a song to remove
      if (!song) return false;

      o.favorites.splice(index, 1);
    }

    return o;
  })

  .factory('Recommendations', function($http, SERVER){
    var o = {
      queue: []
    };
    o.getNextSongs = function(){
      return $http.get(SERVER.url).success(function(data){
        //merge data into the queue
        o.queue = o.queue.concat(data);
      }); //return promise
    };
    o.nextSong = function(){
      //pop the index 0 off
      o.queue.shift();
      //low on the queue? let's fill it up
      if (o.queue.length <= 3){
        o.getNextSongs();
      }
    };

    return o;
  });
