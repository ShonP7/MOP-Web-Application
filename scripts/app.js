"use strict";
angular
  .module("mediaServicesApp", [
    "oc.lazyLoad",
    "ui.router",
    "ui.bootstrap",
    "angular-loading-bar",
    "ngRoute",
    "ngResource",
    "ngStorage",
    'ngTable',
    "ngMask"
  ])

  .config(["$stateProvider", "$urlRouterProvider", "$ocLazyLoadProvider",
    function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

      $ocLazyLoadProvider.config({
        debug: false,
        events: false,
        cache: false
      });

      $urlRouterProvider.otherwise("/login");

      $stateProvider

        .state("login", {
          url: "/login",
          controller: "LoginCtrl",
          templateUrl: "views/pages/login.html",
          resolve: {
            loadMyFiles: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load(
                [{
                  name: "mediaServicesApp",
                  files: [
                    "./scripts/controllers/login/LoginCtrl.js"
                  ]
                }]
              )
            }]
          }
        })

        .state("dashboard", {
          url: "/dashboard",
          controllers: ["LogoutCtrl", "DateCtrl", "TimeCtrl"],
          templateUrl: "views/dashboard/main.html",
          resolve: {
            loadMyDirectives: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                  name: "mediaServicesApp",
                  files: [
                    "./scripts/directives/header/header.js",
                    "./scripts/directives/header/header-notification/header-notification.js",
                    "./scripts/directives/sidebar/sidebar.js",
                    "./scripts/directives/sidebar/sidebar-search/sidebar-search.js",
                    "./scripts/directives/chat/chat.js",
                    "./scripts/directives/jobTimeCard/jobTimeCard.js",
                    "./scripts/directives/dubPanel/dubPanel.js"
                  ]
                },
                {
                  name: "mediaServicesApp",
                  files: [
                    "./scripts/controllers/login/logout.js",
                    "./scripts/controllers/date.js",
                    "./scripts/controllers/time.js",
                    "./scripts/services/valueTrans.js",
                    "./scripts/services/errors.js"
                  ]
                }
              ])
            }]
          }
        })

        .state("dashboard.operatorHome", {
          url: "/operatorHome",
          controller: "operatorDashboardCtrl",
          templateUrl: "views/dashboard/operatorDashboard.html",
          resolve: {
            loadMyHome: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load(
                [{
                  name: "mediaServicesApp",
                  files: [
                    "./scripts/controllers/dashboard/operatorDashboardCtrl.js"
                  ]
                }]
              )
            }]
          }
        })

        .state("dashboard.userHome", {
          url: "/userHome",
          controller: "userDashboardCtrl",
          templateUrl: "views/dashboard/userDashboard.html",
          resolve: {
            loadMyHome: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load(
                [{
                  name: "mediaServicesApp",
                  files: [
                    "./scripts/controllers/dashboard/userDashboardCtrl.js"
                  ]
                }]
              )
            }]
          }
        })

        .state("dashboard.createDubRequest", {
          url: "/createDuplicationRequest",
          controller: "dubRequestCtrl",
          templateUrl: "./views/duplications/createDubRequest.html",
          resolve: {
            loadMyCreateDubRequest: [
              "$ocLazyLoad",
              function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                  name: "mediaServicesApp",
                  files: [
                    "./scripts/controllers/duplications/dubRequestCtrl.js"
                  ]
                })
              }
            ]
          }
        })
        .state("dashboard.viewDubRequests", {
          url: "/viewDuplicationRequests",
          controller: "viewDubRequestsCtrl",
          templateUrl: "views/duplications/viewDubRequests.html",
          resolve: {
            loadMyCreateDubRequest: [
              "$ocLazyLoad",
              function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                  name: "mediaServicesApp",
                  files: [
                    "./scripts/controllers/duplications/viewDubRequestsCtrl.js"
                  ]
                })
              }
            ]
          }
        })

        .state("dashboard.createIngestRequests", {
          url: "/createIngestRequests",
          controller: "ingestRequestCtrl",
          templateUrl: "views/ingests/createIngestRequest.html",
          resolve: {
            loadMyCreateIngestRequests: [
              "$ocLazyLoad",
              function ($ocLazyLoad) {
                return $ocLazyLoad.load(
                  [{
                    name: "mediaServicesApp",
                    files: ["./scripts/controllers/ingests/ingestRequestCtrl.js"]
                  }]
                )
              }
            ]
          }
        })

        .state("dashboard.viewIngestRequests", {
          templateUrl: "views/ingests/viewIngestRequests.html",
          controller: "viewIngestsCtrl",
          url: "/viewIngestRequests",
          resolve: {
            loadMyCreateIngestRequests: [
              "$ocLazyLoad",
              function ($ocLazyLoad) {
                return $ocLazyLoad.load(
                  [{
                    name: "mediaServicesApp",
                    files: ["./scripts/controllers/ingests/viewIngCtrl.js"]
                  }]
                )
              }
            ]
          }
        })

        .state("dashboard.viewRestoreRequests", {
          url: "/viewRestoreRequests",
          templateUrl: "views/restores/viewRestoreRequests.html",
          controller: "viewRestCtrl",
          resolve: {
            loadMyViewRestoreCtrl: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                name: "viewRestoreCtrl",
                files: ["./scripts/controllers/restores/viewRestCtrl.js"]
              }])
            }]
          }
        })

        .state("dashboard.createArchiveRequest", {
          url: "/createArchiveRequest",
          controller: "archiveRequestCtrl",
          templateUrl: "views/archive/createArchiveRequest.html",
          resolve: {
            loadMyCreateArchiveRequest: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                name: "mediaServicesApp",
                files: ["./scripts/controllers/archives/archiveRequestCtrl.js"]
              }])
            }]
          }

        })
        .state("dashboard.viewArchiveRequests", {
          templateUrl: "views/archive/viewArchiveRequests.html",
          url: "/viewArchiveRequests",
          controller: "viewArchiveCtrl",
          resolve: {
            loadMyCreateArchiveView: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                name: "mediaServicesApp",
                files: ["./scripts/controllers/archives/viewArchiveCtrl.js"]
              }])
            }]
          }
        })


        .state("dashboard.viewRetrievalRequest", {
          templateUrl: "views/vault/viewRetrievalRequest.html",
          url: "/viewRetrievalRequest"
        })

        .state("dashboard.createMediaRetrieval", {
          templateUrl: "views/vault/createMediaRetrieval.html",
          url: "/createMediaRetrieval",
          controller: "mediaRetrievalRequestCtrl",
          resolve: {
            loadMyCreateArchiveRequest: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                name: "mediaServicesApp",
                files: ["./scripts/controllers/vault/mediaRetrievalRequestCtrl.js"]
              }])
            }]
          }
        })


        .state("dashboard.createCaptionRequest", {
          templateUrl: "views/captioning/createCapRequest.html",
          url: "/createCaptionRequest",
          controller: "createCapRequestCtrl",
          resolve: {
            loadMyCreateArchiveRequest: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                name: "mediaServicesApp",
                files: ["./scripts/controllers/captioning/createCapRequestCtrl.js"]
              }])
            }]
          }
        })

        .state("dashboard.viewCaptionRequests", {
          templateUrl: "views/captioning/viewCapRequests.html",
          url: "/viewCaptionRequests",
          controller: "viewCapRequestCtrl",
          resolve: {
            loadMyCreateArchiveRequest: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                name: "mediaServicesApp",
                files: ["./scripts/controllers/captioning/viewCapRequestsCtrl.js"]
              }])
            }]
          }
        })

        .state("dashboard.createStockRequest", {
          templateUrl: "views/vault/createStockRequest.html",
          url: "/createStockRequest",
          controller: "mediaStockRequestCtrl",
          resolve: {
            loadMyCreateArchiveRequest: ["$ocLazyLoad", function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                name: "mediaServicesApp",
                files: ["./scripts/controllers/vault/mediaStockRequestCtrl.js"]
              }])
            }]
          }
        })

        .state("dashboard.instructionalVideos", {
          url: "/instructionalVideos",
          controller: "instructionalVideosCtrl",
          templateUrl: "views/training/instructionalVideos.html",
          resolve: {
            loadMyInstructionalVideos: [
              "$ocLazyLoad",
              function ($ocLazyLoad) {
                return $ocLazyLoad.load(
                  [{
                    name: "mediaServicesApp",
                    files: ["./scripts/controllers/training/instructionalVideosCtrl.js"]
                  }]
                )
              }
            ]
          }
        })

        .state("dashboard.manageUsers", {
          templateUrl: "views/admin/manageUsers.html",
          url: "/manageUsers",
          controller: "manageUsersCtrl",
          resolve: {
            loadUsersController: [
              "$ocLazyLoad",
              function ($ocLazyLoad) {
                return $ocLazyLoad.load(
                  [{
                    name: "mediaServicesApp",
                    files: ["./scripts/controllers/admin/manageUsersCtrl.js"]
                  }]
                )
              }
            ]
          }
        })

        .state("dashboard.contact", {
          templateUrl: "views/pages/contact.html",
          url: "/contact"
        })

        .state("dashboard.cheatSheets", {
          templateUrl: "views/training/cheatSheets.html",
          url: "/cheatSheets"
        })

        .state("dashboard.importantDocs", {
          templateUrl: "views/pages/importantDocs.html",
          url: "/importantDocs"
        })

        .state("dashboard.underConstruction", {
          templateUrl: "views/pages/underConstruction.html",
          url: "/construction"
        })

    }
  ]);