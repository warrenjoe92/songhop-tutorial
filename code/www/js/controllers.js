angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations) {
  // load our first songs
  Recommendations.init()
    .then(function(){
      $scope.currentSong = Recommendations.queue[0];
      Recommendations.playCurrentSong();
    });

  //fired when we favourite / skip a song
  $scope.sendFeedback = function(bool){

    Recommendations.nextSong();

    //if we're favoriting, add song to favorite list
    if (bool) User.addSongToFavorites($scope.currentSong);

    //set variable for the correct animation sequence
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    $timeout(function(){
      // $timeout to allow animation to complete before changing to next song

      //update current song in scope
      $scope.currentSong = Recommendations.queue[0];

    }, 250);

    Recommendations.playCurrentSong();
  };

  // used for retrieving the next album image.
  // if there isn't an album image available next, return empty string.
  $scope.nextAlbumImg = function(){
    if (Recommendations.queue.length > 1){
      return Recommendations.queue[1].image_large;
    }
    return '';
  };

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
  //get the list of our favorites from the user service
  $scope.favorites = User.favorites;

  $scope.removeSong = function(song, index){ //or $scope.removeSong = User.removeSongFromFavorites;
    User.removeSongFromFavorites(song, index);
  };
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations) {
  //stop audio when going to favorites page
  $scope.leavingDiscover = function(){
    Recommendations.haltAudio();
  };
  $scope.enteringDiscover = function(){
    Recommendations.init();
  };
});
