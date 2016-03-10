'use strict';

angular.module('ngSocial.facebook', ['ngRoute', 'ngFacebook'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'FacebookCtrl'
  });
}])

.config(function( $facebookProvider ) {
  $facebookProvider.setAppId('840567996070980');
  $facebookProvider.setPermissions('email,public_profile,user_posts,publish_actions,user_photos');
})

.run(function ($rootScope) {
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
})

.controller('FacebookCtrl', ['$scope', '$facebook', function($scope, $facebook) {

  $scope.isLoggedIn = false;

  $scope.login = function () {
    $facebook.login().then(function(){
      $scope.isLoggedIn = true;
      refresh();
      console.log('Logged in!')
    });
  };

  $scope.logout = function () {
    $facebook.logout().then(function(){
      $scope.isLoggedIn = false;
      refresh();
      console.log('Logged out!')
    });
  };

  function refresh () {
    $facebook.api('/me', {fields: 'id,name,last_name,first_name,email,gender,locale,link'}).then(function (response) {
      console.log('response>>>', response)
      $scope.isLoggedIn = true;
      $scope.welcomeMsg = 'Welcome ' + response.name;
      $scope.userInfo = response;
      $facebook.api('/me/picture').then(function (picture) {
        $scope.picture = picture.data.url;
        $facebook.api('me/permissions').then(function (permissions) {
          $scope.permissions = permissions.data;
          $facebook.api('/me/posts').then(function (posts) {
            console.log('posts>>>', posts)
            $scope.posts = posts.data;
          });
        });
      });
    }, function (err) {
      $scope.welcomeMsg = 'Please Log In';
    });
  }

  refresh();


}]);
