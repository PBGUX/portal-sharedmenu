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
       '  <a class="list-group-item" ng-click="MenuCtrl.setSelectedMenu(lmitem.menuSelected, lmitem.childMenuSelected)" ng-class="MenuCtrl.selectedTabFn(lmitem.menuSelected) === lmitem.menuSelected ? \'active\' : \'\'" href="{{lmitem.href}}">{{lmitem.name}}</a>'+
       '<span ng-repeat="subitem in lmitem.subMenu">'+
       '  <a class="list-group-item childitem" ng-click="MenuCtrl.setSelectedMenu(subitem.menuSelected, subitem.parentMenuSelected)" ng-class="MenuCtrl.selectedTabFn(subitem.menuSelected) === subitem.menuSelected ? \'active\' : MenuCtrl.selectedTabFn(subitem.menuSelected) === subitem.menuSelected ||  MenuCtrl.selectedTabFn(subitem.parentMenuSelected) === subitem.parentMenuSelected ? \'\' : \'hideitem\'" href="{{subitem.href}}">{{subitem.name}}</a>'+
       '</span>'+   
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
       '        <li ng-if="menuItem.dropdownMenu" style="width:250px;padding:20px;">'+
       '           <div ng-if="MenuCtrl.products.subscribed.length" class="mute" style="padding-bottom:10px;">My APIs</div>'+
       '           <span ng-repeat="s in MenuCtrl.products.subscribed">'+
       '               <span ng-if="menuItem.dropdownMenu[s].type == \'html\'" ng-bind-html="MenuCtrl.renderHtml(menuItem.dropdownMenu[s].htmlCode)"></span>'+
       '           </span>'+
       '           <hr>'+
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

       self.selectedTabFn   = function(menuSelected){
           console.log(self.selectedTab, '<<< self.selectedTab');
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

           console.log(parentChildSelection, '<<<< parentChildSelection');
           if(parentChildSelection)
           self.selectedTab.push(parentChildSelection);
       }
       
       //let email = oktaData.login;
       var productType = 'default';
       self.currentPortal = $rootScope.currentPortal;
           
       if(typeof $rootScope.currentPortal === 'undefined') 
           $rootScope.currentPortal = 'devPortal';
       else if($rootScope.currentPortal === 'appPortal')
           productType = $rootScope.productType;

       $http.get('https://pitneybowes.oktapreview.com/api/v1/sessions/me', {withCredentials: true})
       .then(function(response) {
           var email = (typeof response.data !== 'undefined' && typeof response.data.login !== 'undefined') ? response.data.login : 'unauth';
           self.getmenu(email);
       }, function(response) {
           self.getmenu('unauth');
       });

       self.getmenu = function(login){
           $http.get('/api/menu/build/'+login+'/mainMenu/'+$rootScope.currentPortal+'/'+productType)
           .then(function (res) {
               var currentUrl = $location.absUrl(); 
               var currentLocation = null;

               if(currentUrl.indexOf('identify') !== -1)
               currentLocation = 'identify';
               else if(currentUrl.indexOf('software-apis') !== -1)
               currentLocation = 'LBS';
               else if(currentUrl.indexOf('shipping') !== -1)
               currentLocation = 'Vulcan';
               else if(currentUrl.indexOf('excelapp') !== -1)
               currentLocation = 'ValidateAddress';
                   
               self.menuItems = res.data.main_menu;
               self.rightMenu = res.data.right_menu;
               self.products = {
                   'subscribed':[],
                   'notsubscribed':[]
               }

               for(var key in res.data.hasProducts)
                   res.data.hasProducts[key] ? self.products['subscribed'].push(key) : self.products['notsubscribed'].push(key);

               if(currentLocation){    
                   self.leftmenu = self.menuItems[currentLocation].subMenu;    

                   console.log(self.selectedTab.length, '<< self.selectedTab.length');
                   if(!self.selectedTab.length){
                       var searchFilter = search(self.leftmenu, currentUrl);
                       self.selectedTab.push(searchFilter.menuSelected);

                       if(searchFilter.parentMenuSelected)
                           self.selectedTab.push(searchFilter.parentMenuSelected);
                   }
               }    

           }).catch(function (err) {
               console.log("Got getMenu Err :",err);
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
   }
}());