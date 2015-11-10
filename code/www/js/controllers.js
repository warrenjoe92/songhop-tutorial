angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations) {
  // our first songs
  Recommendations.getNextSongs()
    .then(function(){
      $scope.currentSong = Recommendations.queue[0];
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
.controller('TabsCtrl', function($scope) {

});
