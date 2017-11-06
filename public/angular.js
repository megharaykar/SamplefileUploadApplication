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
        this.displayFiles = function(){
			return $http.get();
			//$http.get()
			//	.success(function(data){
			//	})
			
		}
        
     }]);
     
FileUpload.controller('mainController', ['$scope', 'fileUpload', function($scope, fileUpload){
        $scope.createFiles = function(){
           var file = $scope.filename;
           var uploadUrl = "/api/files";
           fileUpload.uploadFileToUrl(file, uploadUrl);
        };
        $scope.findFiles = function(){
          fileUpload.displayFiles().success(function(data) {
		  //   $scope.files = data;
          //    console.log(data);
			//fileUpload.displayFiles();
		     $scope.files = data;
              console.log(data);
		  })	
        };
    }]);

