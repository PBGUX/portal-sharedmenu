(function () {
    'use strict';
    angular
    .module('devportal-json-menu', [])
    .controller('MenuController', MenuController)
    .directive('custommenu', menuDirective)
    .directive('leftmenu', leftmenuDirective);

    function leftmenuDirective() {
       //define the directive object
       var directive = {};
       
       //restrict = E, signifies that directive is Element directive
       directive.restrict = 'E';
       
       //template replaces the complete element with its text. 
       directive.template = '<div class="list-group" id="getStartlist">'+
       '<span ng-repeat="lmitem in MenuCtrl.leftmenu">'+
       '  <a ng-if="(lmitem.hideWhenIn !== \'microPortal\' || MenuCtrl.microPortal !== true )" class="list-group-item" ng-click="MenuCtrl.setSelectedMenu(lmitem.menuSelected, lmitem.childMenuSelected)" ng-class="MenuCtrl.selectedTabFn(lmitem.menuSelected) === lmitem.menuSelected ? \'active\' : \'\'" href="{{lmitem.href}}" target="{{lmitem.target}}">{{lmitem.name}}</a>'+
       '  <span ng-repeat="subitem in lmitem.subMenu">'+
       '     <a class="list-group-item childitem"'+ 
       '        ng-click="MenuCtrl.setSelectedMenu(subitem.menuSelected, subitem.parentMenuSelected)"' +
       '        ng-class="MenuCtrl.selectedTabFn(subitem.menuSelected) === subitem.menuSelected ? \'active\' : MenuCtrl.selectedTabFn(subitem.menuSelected) === subitem.menuSelected ||  MenuCtrl.selectedTabFn(subitem.parentMenuSelected) === subitem.parentMenuSelected ? \'\' : \'hideitem\'"' + 
       '        href="{{subitem.href}}" target="{{subitem.target}}" >{{subitem.name}}</a>'+
       '  </span>'+   
       '</span>'+
       '</div>';
       directive.controller  = 'MenuController';
       directive.controllerAs= 'MenuCtrl';
           
       //compile is called during application initialization. AngularJS calls it once when html page is loaded.
       
       directive.compile = function(element, attributes) {
           
           //linkFunction is linked with each element with scope to get the element specific data.
           var linkFunction = function($scope, element, attributes) {
              
           }
           return linkFunction;
        };

       return directive;
   } 

   function menuDirective() {
       //define the directive object
       var directive = {};
       
       //restrict = E, signifies that directive is Element directive
       directive.restrict = 'E';
       
       //template replaces the complete element with its text. 
       directive.template = '<div id="main-navbar" pb-mobile-menu-close="" class="collapse navbar-collapse">'+
       '  <ul class="nav navbar-nav">'+
       '    <li class="divider-vertical hidden-xs"></li>'+
       '    <li ng-if="MenuCtrl.currentPortal === \'appPortal\'" ng-repeat="menuItem in MenuCtrl.menuItems" class="dropdown"><a data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" ng-class="{\'selected-tab\': (MenuCtrl.selectedTab == menuItem.menuSelected)}" class="dropdown-toggle">{{menuItem.name}}</a>'+
       '      <ul class="dropdown-menu pb-animate-menu">'+
       '        <li ng-repeat="subMenu in menuItem.subMenu"><a target="{{subMenu.target}}" href="{{subMenu.href}}" subMenu.attributes="subMenu.attributes">{{subMenu.name}}</a></li>'+
       '      </ul>'+
       '    </li>'+
       '  </ul>'+
       '  <!-- start right menus-->'+
       '  <ul id="headerright-devportal" class="nav navbar-nav navbar-right">'+
       '    <!-- Help menu-->'+
       '    <li class="divider-vertical hidden-xs"> </li>'+
       '    <li class="dropdown" ng-if="MenuCtrl.spinnerRun"><a href="#"><i class="nc-icon-mini loader_circle-04 spin x1 text-white"  aria-label="loading"></i></a></li>'+
       '    <li ng-repeat="menuItem in MenuCtrl.rightMenu" class="dropdown">'+
       '      <a href="{{menuItem.href}}" data-toggle="{{menuItem.dataToggle}}" {{menuItem.attributes}}="{{menuItem.attributes}}" ng-class="{\'selected-tab\': (MenuCtrl.selectedTab == menuItem.menuSelected)}"> '+
       '        <span ng-if="menuItem.type == \'text\'">{{menuItem.name}}</span>'+
       '        <span ng-if="menuItem.type == \'html\'" ng-bind-html="MenuCtrl.renderHtml(menuItem.htmlCode)"></span>'+
       '      </a>'+
       '      <ul class="dropdown-menu pb-animate-menu">'+
       '        <li ng-repeat="subMenu in menuItem.subMenu">'+
       '          <a target="{{subMenu.target}}" href="{{subMenu.href}}" subMenu.attributes="subMenu.attributes">'+
       '            {{subMenu.name}}'+
       '          </a>'+
       '        </li>'+
       '        <li ng-if="menuItem.dropdownMenu" style="width:250px;padding:20px;cursor: default;">'+
       '           <div ng-if="MenuCtrl.myapis" class="mute" style="padding-bottom:10px;">My Apis</div>'+
       '           <span ng-repeat="s in MenuCtrl.products.subscribed">'+
       '               <span ng-if="menuItem.dropdownMenu[s].type == \'html\'" ng-bind-html="MenuCtrl.renderHtml(menuItem.dropdownMenu[s].htmlCode)"></span>'+
       '           </span>'+
       '           <hr ng-if="MenuCtrl.myapis">'+
       '           <div ng-if="MenuCtrl.products.notsubscribed.length" class="mute" style="padding-bottom:10px;">Developer Hub APIs</div>'+
       '           <span ng-repeat="ns in MenuCtrl.products.notsubscribed">'+
       '             <span ng-if="menuItem.dropdownMenu[ns].type == \'html\'" ng-bind-html="MenuCtrl.renderHtml(menuItem.dropdownMenu[ns].htmlCode)"></span>'+
       '           </span>'+
       '        </li>'+
       '      </ul>'+
       '    </li>'+
       '  </ul>'+
       '</div>';
       directive.controller  = 'MenuController';
       directive.controllerAs= 'MenuCtrl';
           
       //compile is called during application initialization. AngularJS calls it once when html page is loaded.
       
       directive.compile = function(element, attributes) {
           
           //linkFunction is linked with each element with scope to get the element specific data.
           var linkFunction = function($scope, element, attributes) {
              
           }
           return linkFunction;
        };

       return directive;
   }

   MenuController.$inject = ["$rootScope", "$http", "$stateParams", "$sce", "$location", "$filter"];

   function MenuController($rootScope, $http, $stateParams, $sce, $location, $filter) {
       var self = this;
       self.selectedTab = [];
       self.currentLocation = null;
       var microPortalStatus = false; 
       //let email = oktaData.login;
       var productType = 'default';
       self.currentPortal = $rootScope.currentPortal;
       self.myapis = false;
    
       if(typeof $rootScope.currentPortal === 'undefined') 
           $rootScope.currentPortal = 'devPortal';
       else if($rootScope.currentPortal === 'appPortal')
           productType = $rootScope.productType;
       self.spinnerRun = true;
       $http.get(window.oktaHostURL+'api/v1/sessions/me', {withCredentials: true})
       .then(function(response) {
           var email = (typeof response.data !== 'undefined' && typeof response.data.login !== 'undefined') ? response.data.login : 'unauth';
           self.getmenu(email);
       }, function(response) {
           self.getmenu('unauth');
       });

        self.getmenu = function(login){
            $http.get('/api/menu/build/'+login+'/mainMenu/'+$rootScope.currentPortal+'/'+productType)
            .then(function (res) {
                self.microPortal  = res.data.microPortal; 
                microPortalStatus = res.data.currentLocation;

                getCurrentLocation($location.absUrl(), microPortalStatus);
                   
                //console.log(self.microPortal, '<<<<<<<<<<<<<< self.microPortal >>>'+self.currentLocation);
                self.menuItems = res.data.main_menu;
                self.rightMenu = res.data.right_menu;
                self.products = {
                   'subscribed':[],
                   'notsubscribed':[]
                }

                for(var key in res.data.hasProducts)
                   res.data.hasProducts[key] ? self.products['subscribed'].push(key) : self.products['notsubscribed'].push(key);

			    (self.products.subscribed.length > 1) ? self.myapis = true :  self.myapis = false; 
                
				displayLeftmenu();   

                self.spinnerRun = false; 

           }).catch(function (err) {
               //console.log("Got getMenu Err :",err);
               self.spinnerRun = false;
           });
       }

       self.renderHtml = function(htmlData){
           if(typeof htmlData !== 'undefined')
           return $sce.trustAsHtml(atob(htmlData));
       }

       var search = function(menu, url){
           for(var key in menu){
               if(menu[key].subMenu){
                 var submenu = search(menu[key].subMenu, url)
                 if(submenu) 
                    return submenu;
               }
               
               if(menu[key].href === url){
                   return menu[key];
                   break;
               }      
           }
       }
       
       var displayLeftmenu = function(){
            if(self.currentLocation && typeof self.menuItems[self.currentLocation] !== 'undefined'){     
                self.leftmenu = self.menuItems[self.currentLocation].subMenu;    

                var searchFilter = search(self.leftmenu, $location.absUrl());
                self.selectedTab = [];
                
                if(searchFilter){
                    self.selectedTab.push(searchFilter.menuSelected);

                    if(searchFilter.parentMenuSelected)
                        self.selectedTab.push(searchFilter.parentMenuSelected);
                }
            } 
       }

       var getCurrentLocation = function(currentUrl, microPortalStatus){
           if(self.microPortal){
            self.currentLocation = microPortalStatus; 
           }else if(currentUrl.indexOf('software-apis') !== -1){
            self.currentLocation = 'LBS';  
           }else if(currentUrl.indexOf('identify') !== -1){
            self.currentLocation = 'identify';  
           }else if(currentUrl.indexOf('shipping') !== -1){
            self.currentLocation = 'Vulcan';
           }else if(currentUrl.indexOf('excelapp') !== -1){
            self.currentLocation = 'ValidateAddress';
           }else if(currentUrl.indexOf('gsuite') !== -1){
            self.currentLocation = 'ValidateAddressGSuite';
           }
       }

       self.selectedTabFn   = function(menuSelected){
                        
            getCurrentLocation($location.absUrl(), microPortalStatus); // get which section of the portal user is in

            displayLeftmenu();

            //console.log(self.selectedTab, 'from selectedTabFn');
            for(var key in self.selectedTab)
                if(self.selectedTab[key] === menuSelected){
                    return menuSelected;
                    break;
                } 
                
            return false;
        }

        self.setSelectedMenu = function(menuSelected, parentChildSelection){
            self.selectedTab = [];
            self.selectedTab.push(menuSelected);

            //console.log(menuSelected+'<>'+parentChildSelection, '<<<< parentChildSelection');
            if(parentChildSelection)
            self.selectedTab.push(parentChildSelection);
        }

        $rootScope.$on("locationUpdate",function (event, Portalinfo) {
            //console.log(Portalinfo, "<<<from dbheader $rootScope.PortalLocation");
            displayLeftmenu();
        });
   }
}());