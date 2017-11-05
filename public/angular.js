var FileUpload = angular.module('FileUpload', []);

FileUpload.directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }]);

FileUpload.service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function(file, uploadUrl){
           var fd = new FormData();
           fd.append('file', file);
           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
        
           })
           .success(function(){
           })
           .error(function(){
           });
        }
       
        $http.get("/api/files")
      //  .success(function displayfiles(data, downloadurl) {
          .success(function findfiles(data) {
            $scope.findfiles = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
     }]);
     FileUpload.controller('mainController', ['$scope', 'fileUpload', function($scope, fileUpload){
        $scope.createFiles = function(){
           var file = $scope.filename;
           var uploadUrl = "/api/files";
           fileUpload.uploadFileToUrl(file, uploadUrl);
        };
     //   $scope.findfiles = function(){
     //      var data = $scope.findfiles;
     //      var downloadurl = "/api/files";
     //      fileupload.displayfiles(data, downloadurl);
     //   };
    }]);
    
    Filedownload.controller('controller', function($scope,$http) {

    $scope.findfiles = [];

    $http.get('/api/files').then(function(d)
        {
            console.log(d);
            $scope.findfiles= d.data;
        },function(err)
        {
            console.log(err);            }
    )

})





