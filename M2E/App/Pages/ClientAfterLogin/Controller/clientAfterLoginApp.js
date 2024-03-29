'use strict';
define([appLocation.postLogin], function (app) {
    app.config(function ($routeProvider) {

        $routeProvider.when("/", { templateUrl: "../../App/Pages/ClientAfterLogin/Index/Index.html" }).
                       when("/edit", { templateUrl: "../../App/Pages/ClientAfterLogin/EditPage/EditPage.html" }).
                       when("/createTemplate/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/Survey/CreateTemplate/CreateTemplate.html" }).
                       when("/editTemplate/:username/:templateid", { templateUrl: "../../App/Pages/ClientAfterLogin/EditTemplate/EditTemplate.html" }).
                       when("/templateSample/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/TemplateSample/TemplateSample.html" }).
                       when("/templateInfo/:type/:subType/:templateId", { templateUrl: "../../App/Pages/ClientAfterLogin/TemplateInfo/TemplateInfo.html" }).
                       when("/templateResponseDetail/:type/:subType/:templateId", { templateUrl: "../../App/Pages/ClientAfterLogin/TemplateResponseDetail/TemplateResponseDetail.html" }).
                       when("/transcriptionResponseDetail/:type/:subType/:templateId", { templateUrl: "../../App/Pages/ClientAfterLogin/DataEntry/TranscriptionResponseDetail/TranscriptionResponseDetail.html" }).
                       when("/moderatingPhotos/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/Moderation/ModeratingPhotos/ModeratingPhotos.html" }).
                       when("/moderatingPhotosResponseDetail/:type/:subType/:templateId", { templateUrl: "../../App/Pages/ClientAfterLogin/Moderation/ModeratingPhotosResponseDetail/ModeratingPhotosResponseDetail.html" }).
                       when("/transcriptionTemplate/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/DataEntry/TranscriptionTemplate/TranscriptionTemplate.html" }).
                       when("/dataCollectionTemplate/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/DataEntry/dataCollection/dataCollection.html" }).
                       when("/surveyLinkTemplate/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/Survey/SurveyLink/SurveyLink.html" }).
                       when("/taggingImageTemplate/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/DataEntry/taggingImage/taggingImage.html" }).
                       when("/transcribeAVTemplate/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/DataEntry/TranscribeAV/TranscribeAV.html" }).
                       when("/articleWrittingTemplate/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/ContentWritting/articleWritting/articleWritting.html" }).
                       when("/dataEntryTemplate/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/ContentWritting/articleWritting/articleWritting.html" }).
                       when("/facebookLikeTemplate/:type/:subType", { templateUrl: "../../App/Pages/ClientAfterLogin/Ads/facebookLike/facebookLike.html" }).
                       when("/myReferrals", { templateUrl: "../../App/Pages/ClientAfterLogin/Referrals/Referrals.html" }).
                       when("/myEarningHistory", { templateUrl: "../../App/Pages/ClientAfterLogin/ClientEarningHistory/ClientEarningHistory.html" }).
                       when("/clientAllMessages", { templateUrl: "../../App/Pages/ClientAfterLogin/ShowAllMessages/ShowAllMessages.html" }).
                       when("/clientAllNotifications", { templateUrl: "../../App/Pages/ClientAfterLogin/ShowAllNotifications/ShowAllNotifications.html" }).
                       otherwise({ templateUrl: "../../Resource/templates/beforeLogin/contentView/404.html" });

    });

    app.directive("highChart", function ($parse) {
        return {
            link: function (scope, element, attrs, ngModel) {
                var props = $parse(attrs.highChart)(scope);
                props.chart.renderTo = element[0];
                //console.log(props)
                new Highcharts.Chart(props);
            }
        }
    });

    app.run(function ($rootScope, $location, CookieUtil, SessionManagementUtil) { //Insert in the function definition the dependencies you need.

        $rootScope.$on("$locationChangeStart", function (event, next, current) {

            //            var headerSessionData = {
            //                UTMZT: CookieUtil.getUTMZT(),
            //                UTMZK: CookieUtil.getUTMZK(),
            //                UTMZV: CookieUtil.getUTMZV()
            //            }

            //SessionManagementUtil.isValidSession(headerSessionData);
            /* Sidebar tree view */
            //userSession.guid = CookieUtil.getUTMZT();
            $(".sidebar .treeview").tree();

            gaWeb("BeforeLogin-Page Visited", "Page Visited", next);
            var path = next.split('#');
            gaPageView(path, 'title');
        });
    });


    app.controller('ClientAfterMasterPage', function ($scope, $http, $rootScope, CookieUtil) {

        _.defer(function () { $scope.$apply(); });
        $rootScope.IsMobileDevice = (mobileDevice || isAndroidDevice) ? true : false;

        $scope.openTemplateSamplePageWithId = function (id) {
            if (mobileDevice)
                $('#sideBarMenuToggleButtonId').click();
            //alert(id);
            location.href = id;
        }

        $scope.signOut = function () {
            logout();
        }

        loadClientDetails();

        function loadClientDetails() {
            var url = ServerContextPah + '/Client/GetClientDetails?userType=' + M2EConstants.userType_client;
            var headers = {
                'Content-Type': 'application/json',
                'UTMZT': CookieUtil.getUTMZT(),
                'UTMZK': CookieUtil.getUTMZK(),
                'UTMZV': CookieUtil.getUTMZV()
            };
            startBlockUI('wait..', 3);
            $http({
                url: url,
                method: "POST",
                headers: headers
            }).success(function (data, status, headers, config) {
                //$scope.persons = data; // assign  $scope.persons here as promise is resolved here
                stopBlockUI();
                if (data.Status == "200") {
                    $rootScope.clientDetailResponse = data.Payload;
                    $scope.ClientNotificationsList.Messages = data.Payload.Messages;
                    $scope.ClientNotificationsList.Notifications = data.Payload.Notifications;
                    CookieUtil.setUserName(data.Payload.FirstName + ' ' + data.Payload.LastName, userSession.keepMeSignedIn);
                    CookieUtil.setUserImageUrl(data.Payload.imageUrl, userSession.keepMeSignedIn);
                    if (data.Payload.isLocked == "true") {
                        location.href = "/Auth/LockAccount?status=true";
                    }
                }
                else if (data.Status == "404") {

                    alert("This template is not present in database");
                }
                else if (data.Status == "500") {

                    alert("Internal Server Error Occured");
                }
                else if (data.Status == "401") {
                    location.href = "/?type=info&mssg=your session is expired/#/login";
                }
            }).error(function (data, status, headers, config) {

            });
        }

        $scope.ClientNotificationsList = {
            Messages: {
                UnreadMessages: "0",
                CountLabelType: "success",
                MessageList: [         
                ]

            },

            Notifications: {
                UnreadNotifications: "0",
                CountLabelType: "warning",
                NotificationList: [                 
                ]
            },
            Tasks: {
                UnreadTasks: "0",
                CountLabelType: "danger",
                TaskList: [                   
                ]
            }
        };

        $scope.updateClientNotificationMessage = function(userType, newLink, newImageUrl, newMessageTitle, newMessagePostedInTimeAgo, newMessageContent) {
            //alert("inside angular js function updateBeforeLoginUserProjectDetailsDiv");
            var realTimeMessage = {
                link: newLink,
                imageUrl: newImageUrl,
                messageTitle: newMessageTitle,
                MessagePostedInTimeAgo: newMessagePostedInTimeAgo,
                messageContent: newMessageContent
            };
            $scope.ClientNotificationsList.Messages.UnreadMessages = parseInt($scope.ClientNotificationsList.Messages.UnreadMessages) + 1;
            $scope.ClientNotificationsList.Messages.MessageList.push(realTimeMessage);
            showToastMessage("Success", newMessageTitle + "<br\>" + newMessageContent);
        };

        $scope.updateAllClientTaskNotification = function (newLink, newMessageTitle, newMessagePostedInTimeAgo, newMessageBody) {
            //alert("inside angular js function updateBeforeLoginUserProjectDetailsDiv");
            var realTimeTask = {
                link: newLink,
                TaskDetail: newMessageTitle,
                TotalCompleted: newMessagePostedInTimeAgo
            };
            $scope.ClientNotificationsList.Tasks.UnreadTasks = parseInt($scope.ClientNotificationsList.Tasks.UnreadTasks) + 1;
            $scope.ClientNotificationsList.Tasks.TaskList.push(realTimeTask);
            showToastMessage("Success", newMessageTitle);

        };

        $scope.updateClientTaskNotification = function (userType, newLink, newMessageTitle, newMessagePostedInTimeAgo, newMessageBody) {
            //alert("inside angular js function updateBeforeLoginUserProjectDetailsDiv");
            var realTimeTask = {
                link: newLink,
                TaskDetail: newMessageTitle,
                TotalCompleted: newMessagePostedInTimeAgo
            };
            $scope.ClientNotificationsList.Tasks.UnreadTasks = parseInt($scope.ClientNotificationsList.Tasks.UnreadTasks) + 1;
            $scope.ClientNotificationsList.Tasks.TaskList.push(realTimeTask);
            showToastMessage("Success", newMessageTitle);
        };

        $scope.updateClientNotification = function (userType, newLink, newImageUrl, newMessageTitle, newMessagePostedInTimeAgo) {
            //alert("inside angular js function updateBeforeLoginUserProjectDetailsDiv");
            var realTimeNotification = {
                link: newLink,
                NotificationMessage: newMessageTitle,
                NotificationClass: newImageUrl,
                NotificationPostedTimeAgo: newMessagePostedInTimeAgo
            };
            $scope.ClientNotificationsList.Notifications.UnreadNotifications = parseInt($scope.ClientNotificationsList.Notifications.UnreadNotifications) + 1;
            $scope.ClientNotificationsList.Notifications.NotificationList.push(realTimeNotification);
            showToastMessage("Success", newMessageTitle);
        };


        $scope.ClientCategoryList = [
       {
           MainCategory: "Category",
           subCategoryList: [
           {
               value: "Data entry", dropDownMenuShow: true, dropDownSubMenuClass: "dropdown-submenu", dropDownMenuClass: "dropdown-menu", dropDownSubMenuArrow: "dropdown", dropDownMenuList: [
               //{ value: "Verification & Duplication", link: "#/VerificationAndDuplicationSample" },
               { value: "Data Collection", link: "#/templateSample/" + TemplateInfoModel.type_dataEntry + "/" + TemplateInfoModel.subType_dataCollection },
               { value: "Tagging of an Image", link: "#/templateSample/" + TemplateInfoModel.type_dataEntry + "/" + TemplateInfoModel.subType_taggingImage },
               { value: "Search the web", link: "#/templateSample/" + TemplateInfoModel.type_dataEntry + "/" + TemplateInfoModel.subType_searchTheWeb },
               { value: "Do Excel work", link: "#/templateSample/" + TemplateInfoModel.type_dataEntry + "/" + TemplateInfoModel.subType_doExcelWork },
               //{ value: "Find information", link: "#" },
               //{ value: "Post advertisements", link: "#" },
               { value: "Transcription", link: "#/templateSample/" + TemplateInfoModel.type_dataEntry + "/" + TemplateInfoModel.subType_Transcription },
               { value: "Transcription from A/V", link: "#/templateSample/" + TemplateInfoModel.type_dataEntry + "/" + TemplateInfoModel.subType_transcribeAV }
               ]
           },
           {
               value: "Content Writing", dropDownMenuShow: true, dropDownSubMenuClass: "dropdown-submenu", dropDownMenuClass: "dropdown-menu", dropDownSubMenuArrow: "dropdown", dropDownMenuList: [
                 { value: "Article writing", link: "#/templateSample/" + TemplateInfoModel.type_contentWritting + "/" + TemplateInfoModel.subType_articleWritting },
                 { value: "Blog writing", link: "#/templateSample/" + TemplateInfoModel.type_contentWritting + "/" + TemplateInfoModel.subType_blogWriting },
                 { value: "Copy typing", link: "#/templateSample/" + TemplateInfoModel.type_contentWritting + "/" + TemplateInfoModel.subType_copyTyping },
                 { value: "Powerpoint", link: "#/templateSample/" + TemplateInfoModel.type_contentWritting + "/" + TemplateInfoModel.subType_powerpoint },
                 { value: "Short stories", link: "#/templateSample/" + TemplateInfoModel.type_contentWritting + "/" + TemplateInfoModel.subType_shortStories },
                 { value: "Travel writing", link: "#/templateSample/" + TemplateInfoModel.type_contentWritting + "/" + TemplateInfoModel.subType_travelWriting },
                 { value: "Reviews", link: "#/templateSample/" + TemplateInfoModel.type_contentWritting + "/" + TemplateInfoModel.subType_reviews },
                 { value: "Product descriptions", link: "#/templateSample/" + TemplateInfoModel.type_contentWritting + "/" + TemplateInfoModel.subType_productDescriptions }
               ]
           },
           {
               value: "Survey", dropDownMenuShow: true, dropDownSubMenuClass: "dropdown-submenu", dropDownMenuClass: "dropdown-menu", dropDownSubMenuArrow: "dropdown", dropDownMenuList: [
                 { value: "Product survey", link: "#/templateSample/" + TemplateInfoModel.type_survey + "/" + TemplateInfoModel.subType_productSurvey },
                 { value: "User feedback survey", link: "#/templateSample/" + TemplateInfoModel.type_survey + "/" + TemplateInfoModel.subType_userFeedbackSurvey },
                 { value: "Pools", link: "#/templateSample/" + TemplateInfoModel.type_survey + "/" + TemplateInfoModel.subType_pools },
                 { value: "Survey Link", link: "#/surveyLinkTemplate/" + TemplateInfoModel.type_survey + "/" + TemplateInfoModel.subType_surveyLink }
               ]
           },
           {
               value: "Moderation", dropDownMenuShow: true, dropDownSubMenuClass: "dropdown-submenu", dropDownMenuClass: "dropdown-menu", dropDownSubMenuArrow: "dropdown", dropDownMenuList: [
                 //{ value: "Moderating Ads", link: "#" },
                 { value: "Moderating Photos", link: "#/templateSample/" + TemplateInfoModel.type_moderation + "/" + TemplateInfoModel.subType_imageModeration },
                 { value: "Moderating Music", link: "#" },
                 { value: "Moderating Video", link: "#" }
               ]
           },
           {
               value: "Ads", dropDownMenuShow: true, dropDownSubMenuClass: "dropdown-submenu", dropDownMenuClass: "dropdown-menu", dropDownSubMenuArrow: "dropdown", dropDownMenuList: [
                 //{ value: "Facebook Views", link: "#" },
                 { value: "Facebook likes", link: "#/facebookLikeTemplate/" + TemplateInfoModel.type_Ads + "/" + TemplateInfoModel.subType_facebookLike },
                 //{ value: "Video reviewing", link: "#" },
                 //{ value: "Comments on social media", link: "#" }
               ]
           }
           ]
       }
        ];
    });


    function loadjscssfile(filename, filetype) {
        var fileref = "";
        if (filetype == "js") { //if filename is a external JavaScript file
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
        }
        else if (filetype == "css") { //if filename is an external CSS file
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref);
    }

});
