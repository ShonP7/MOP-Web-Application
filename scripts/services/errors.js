'use strict';
angular.module('mediaServicesApp')
  .service('errors', function ($state, valueTrans, $localStorage) {

    this.httpError = function (error, errorCount) {

      // No Internet Connection
      if (error == -1) {
        swal(
          "Server Conection Lost",
          "There was an error. Please try again. This may be due to loss of internet connection. If you are able to load other sites like Google please contact Media Operations (MediaOperations@GolfChannel.com)",
          "error"
        );
        // Bad Request
      } else if (error == 400) {
        swal(
          "Bad Server Request",
          "There was an error. Please try again. The request could not be understood by the server due to malformed syntax. If this problem continues please contact Media Operations (MediaOperations@GolfChannel.com)",
          "error"
        );
        // Forbidden
      } else if (error == 401) {
        swal(
          "Unauthorized",
          "There was an error. It is possible you have been logged in for too long. Please try again. This request requires proper authorization. If this problem continues please contact Media Operations (MediaOperations@GolfChannel.com)",
          "error"
        );
        valueTrans.reset();
        $localStorage.$reset();
        $state.go("login");
        // Forbidden
      } else if (error == 403) {
        swal(
          "Forbidden",
          "There was an error. It is possible you have been logged in for too long. Please try again. This request requires proper authorization. If this problem continues please contact Media Operations (MediaOperations@GolfChannel.com)",
          "error"
        );
        valueTrans.reset();
        $localStorage.$reset();
        $state.go("login");
        // Not Found
      } else if (error == 404) {
        swal(
          "Not Found",
          "There was an error. Please try again. The server has not found anything matching the Request-URI.  If this problem continues please contact Media Operations (MediaOperations@GolfChannel.com)",
          "error"
        );
        // Conflict
      } else if (error == 409) {
        swal(
          "Conflict",
          "There was an error. Please try again. The request could not be completed due to a conflict with the current state of the resource. If this problem continues please contact Media Operations (MediaOperations@GolfChannel.com)",
          "error"
        );
        // I am a Tea Pot
      } else if (error == 418) {
        swal(
          "I am a Teapot",
          "There was an error. Please try again. The Hyper Text Coffee Pot Control Protocol has crashed. If this problem continues please contact Media Operations (MediaOperations@GolfChannel.com)",
          "error"
        );
        // Internal Server Error
      } else if (error >= 500) {
        swal(
          "Internal Server Error",
          "There was an error. Please try again. The server encountered an unexpected condition which prevented it from fulfilling the request. If this problem continues please contact Media Operations (MediaOperations@GolfChannel.com)",
          "error"
        );
        // Unknow error!
      } else {
        swal(
          "Im Sorry",
          "There was an unknown error. Please try again. If this problem continues please contact Media Operations (MediaOperations@GolfChannel.com)",
          "error"
        );
      }

      // Boot them out for more then 10 errors
      if (errorCount > 10) {
        swal("I'm Sorry", "There was more than 10 errors! Please restart your computer and try again. If this problem continues please contact Media Operations (MediaOperations@GolfChannel.com)", "error");
        valueTrans.reset();
        $window.localStorage.clear();
        $state.go("login");
      }
    }
  });