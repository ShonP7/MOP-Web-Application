"use strict";
angular
  .module("mediaServicesApp")
  .controller("manageUsersCtrl", function (
    $scope,
    $anchorScroll,
    $window,
    $http,
    errors,
    valueTrans,
    $interval,
    $localStorage,
    $filter,
    $location,
    $state,
    uibDateParser
  ) {
    $scope.errorCount = 0;
    $scope.users = [];
    $scope.showSelected = false;
    $scope.selected = [];
    $scope.listOfDeparments = [];

    $scope.setSelectedUser = function (user, index) {
      depId.selectedIndex = user.departmentId + 1;
      arcAc.selectedIndex = user.permissions.archives;
      resAc.selectedIndex = user.permissions.restores;
      dupAc.selectedIndex = user.permissions.duplications;
      ingAc.selectedIndex = user.permissions.ingests;
      forAc.selectedIndex = user.permissions.fore;
      $scope.selected = user;
      $scope.selectedIndex = index;
      $scope.showSelected = true;
      $location.hash("editPlace");
      $anchorScroll();
    };

    $scope.formateUsers = function (selected) {
        if (selected.lastLogin !== null) {
          selected.lastLogin = moment(selected.lastLogin).format("h:mma - M/D/Y");
        } else {
          selected.lastLogin = "---";
        }

        if (selected.accountStatus === 0) {
          selected.accountStatusDisplay = "Inactive";
        } else if (selected.accountStatus === 1) {
          selected.accountStatusDisplay = "Active";
        }

        if (selected.departmentId !== null) {
          selected.departmentId--;
          selected.depDisplay = $scope.listOfDeparments[selected.departmentId];
        }

        if (selected.permissions.archives === 0) {
          selected.archivesDisplay = "No Access";
        } else if (selected.permissions.archives === 1) {
          selected.archivesDisplay = "No Access";
        } else if (selected.permissions.archives === 2) {
          selected.archivesDisplay = "Read Only";
        } else if (selected.permissions.archives === 3) {
          selected.archivesDisplay = "Read and Submit";
        } else if (selected.permissions.archives === 4) {
          selected.archivesDisplay = "Read, Submit and Edit";
        } else if (selected.permissions.archives === 5) {
          selected.archivesDisplay = "Administrator";
        }

        if (selected.permissions.duplications === 0) {
          selected.duplicationsDisplay = "No Access";
        } else if (selected.permissions.duplications === 1) {
          selected.duplicationsDisplay = "No Access";
        } else if (selected.permissions.duplications === 2) {
          selected.duplicationsDisplay = "Read Only";
        } else if (selected.permissions.duplications === 3) {
          selected.duplicationsDisplay = "Read and Submit";
        } else if (selected.permissions.duplications === 4) {
          selected.duplicationsDisplay = "Read, Submit and Edit";
        } else if (selected.permissions.duplications === 5) {
          selected.duplicationsDisplay = "Administrator";
        }

        if (selected.permissions.fore === 0) {
          selected.foreDisplay = "No Access";
        } else if (selected.permissions.fore === 1) {
          selected.foreDisplay = "No Access";
        } else if (selected.permissions.fore === 2) {
          selected.foreDisplay = "Read Only";
        } else if (selected.permissions.fore === 3) {
          selected.foreDisplay = "Read and Submit";
        } else if (selected.permissions.fore === 4) {
          selected.foreDisplay = "Read, Submit and Edit";
        } else if (selected.permissions.fore === 5) {
          selected.foreDisplay = "Administrator";
        }

        if (selected.permissions.ingests === 0) {
          selected.ingestsDisplay = "No Access";
        } else if (selected.permissions.ingests === 1) {
          selected.ingestsDisplay = "No Access";
        } else if (selected.permissions.ingests === 2) {
          selected.ingestsDisplay = "Read Only";
        } else if (selected.permissions.ingests === 3) {
          selected.ingestsDisplay = "Read and Submit";
        } else if (selected.permissions.ingests === 4) {
          selected.ingestsDisplay = "Read, Submit and Edit";
        } else if (selected.permissions.ingests === 5) {
          selected.ingestsDisplay = "Administrator";
        }

        if (selected.permissions.restores === 0) {
          selected.restoresDisplay = "No Access";
        } else if (selected.permissions.restores === 1) {
          selected.restoresDisplay = "No Access";
        } else if (selected.permissions.restores === 2) {
          selected.restoresDisplay = "Read Only";
        } else if (selected.permissions.restores === 3) {
          selected.restoresDisplay = "Read and Submit";
        } else if (selected.permissions.restores === 4) {
          selected.restoresDisplay = "Read, Submit and Edit";
        } else if (selected.permissions.restores === 5) {
          selected.restoresDisplay = "Administrator";
        }
        return selected;
    };

    $scope.pushUsers = function (listOfUsers) {
      angular.forEach(listOfUsers, function (selected) {
        $scope.users.push($scope.formateUsers(selected));
      });
    };

    $scope.checkForm = function (id) {
      if ($scope.userEdit.$invalid) {
        angular.forEach($scope.userEdit.$error, function (field) {
          angular.forEach(field, function (errorField) {
            errorField.$setDirty();
          });
        });
        swal(
          "Oops!",
          "Please fill out all required fields before submitting",
          "error"
        );
        return;
      }
      $scope.patchUser(id);
    };

    $scope.patchUser = function (userId) {
      $http({
        method: "PATCH",
        url: "https://moc.golfchannel.com/api/v1/operator/user/" +
          userId +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken,
        data: {
          nameFirst: $scope.selected.firstName,
          nameLast: $scope.selected.lastName,
          email: $scope.selected.email,
          phone: $scope.selected.phone,
          mobile: $scope.selected.mobile,
          departmentId: parseInt(depId.value) + 1,
          permissions: {
            ingests: ingAc.value,
            restores: resAc.value,
            archives: arcAc.value,
            fore: forAc.value,
            duplications: dupAc.value
          }
        }
      }).then(
        function successCallback(response) {
          $scope.errorCount = 0;
          $scope.users[$scope.selectedIndex] = $scope.formateUsers(response.data.user);
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    $scope.activateAccount = function (userId) {
      $http({
        method: "PATCH",
        url: "https://moc.golfchannel.com/api/v1/operator/user/" +
          userId +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken,
        data: {
          accountStatus: 1
        }
      }).then(
        function successCallback(response) {
          $scope.errorCount = 0;
          $scope.selected.accountStatus = 1;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    $scope.deactivateAccount = function (userId) {
      $http({
        method: "DELETE",
        url: "https://moc.golfchannel.com/api/v1/operator/user/" +
          userId +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken
      }).then(
        function successCallback(response) {
          $scope.errorCount = 0;
          $scope.selected.accountStatus = 0;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    // Gets the Departments for the drop down select
    $http({
      method: "GET",
      url: "https://moc.golfchannel.com/api/v1/system/codex/department/?authuser=" +
        $localStorage.authUser +
        "&authtoken=" +
        $localStorage.authToken
    }).then(
      function successCallback(response) {
        angular.forEach(response.data.departments, function (selected) {
          $scope.listOfDeparments[selected["ud_id"] - 1] = selected["ud_name"];
        });
      },
      function errorCallback(response, status) {
        console.log(response);
        errors.httpError(response.status, $scope.errorCount++);
      }
    );

    $http({
      method: "GET",
      url: "https://moc.golfchannel.com/api/v1/operator/user/?authuser=" +
        $localStorage.authUser +
        "&authtoken=" +
        $localStorage.authToken
    }).then(
      function successCallback(response) {
        $scope.pushUsers(response.data.users);
      },
      function errorCallback(response, status) {
        console.log(response);
        errors.httpError(response.status, $scope.errorCount++);
      }
    );
  });