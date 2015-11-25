angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the splash page
*/
.controller('SplashCtrl', function($scope, $state, User){
  // attempt to signup/login via User.auth
  $scope.submitForm = function(username, signingUp){
    User.auth(username, signingUp).then(function(){ //success!
      $state.go('tab.discover');
    }, function(){ //error
      alert('Hmm... try another username')
    });
  };
})

/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations, $ionicLoading) {

  //helper functions for loading
  var showLoading = function(){
    $ionicLoading.show({
        template: '<i class="ion-loading-c"></i>',
        noBackdrop: true
    });
  };

  var hideLoading = function(){
    $ionicLoading.hide();
  };

  //set loading to true the first time we retrive songs from the server
  showLoading();

  // load our first songs
  Recommendations.init()
    .then(function(){
      //when Recommendations have finished loading
      hideLoading();
      $scope.currentSong = Recommendations.queue[0];
      Recommendations.playCurrentSong();
    })
    .then(function(){
      //turn loading off
      hideLoading();
      $scope.currentSong.loaded = true;
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
      $scope.currentSong.loaded = false;

    }, 250);

    Recommendations.playCurrentSong().then(function(){
      $scope.currentSong.loaded = true; //when song starts playing, mark song as loaded
    });
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
.controller('FavoritesCtrl', function($scope, User, $window) {
  //get the list of our favorites from the user service
  $scope.favorites = User.favorites;

  $scope.openSong = function(song){
    $window.open(song.open_url, "_system"); //pass url to the system browser
    //"_blank" will pass the url to the app browser
  };

  $scope.removeSong = function(song, index){ //or $scope.removeSong = User.removeSongFromFavorites;
    User.removeSongFromFavorites(song, index);
  };
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations, User) {
  $scope.favCount = User.favoriteCount;
  //stop audio when going to favorites page
  $scope.leavingDiscover = function(){
    Recommendations.haltAudio();
  };
  $scope.enteringDiscover = function(){
    Recommendations.init();
  };
  $scope.enteringFavorites = function(){
    User.newFavorites = 0;
  };
});
