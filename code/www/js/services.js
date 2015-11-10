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

  .factory('Recommendations', function($http, SERVER, $q){
    var media;
    var o = {
      queue: []
    };

    o.init = function(){
      if (o.queue.length == 0){
        // if there's nothing in the queue, fill it
        // this also means that this is the first call of init
        return o.getNextSongs(); //return promise
      }
      else{
        console.log("recommendations else");
        // otherwise, play the current song
        return o.playCurrentSong(); // return promise
      }
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
      //end the song
      o.haltAudio();
      //low on the queue? let's fill it up
      if (o.queue.length <= 3){
        o.getNextSongs();
      }
    };
    o.playCurrentSong = function(){
      var defer = $q.defer(); // for making a function asynchronous

      //play the current song's preview
      media = new Audio(o.queue[0].preview_url);

      //when song is loaded, resolve the promise to let controller know
      media.addEventListener('loadeddata', function(){
        defer.resolve();
      });

      media.play();

      return defer.promise;
    };
    o.haltAudio = function(){
      if (media) media.pause();
    };

    return o;
  });
