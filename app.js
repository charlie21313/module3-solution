(function() {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .controller('FoundItemsDirectiveController', FoundItemsDirectiveController)
  .constant('MenuUri', 'https://davids-restaurant.herokuapp.com/menu_items.json')
  ;

  NarrowItDownController.$inject=['$scope', 'MenuSearchService']
  function NarrowItDownController ($scope, MenuSearchService) {
    var narrowCtrl = this;

    narrowCtrl.keyword = '';
    narrowCtrl.found = [];
    narrowCtrl.hasSearched = false;

    narrowCtrl.remove = function (index) {
      narrowCtrl.found.splice(index, 1);
    }

    narrowCtrl.getMatchedMenuItems = function () {
      if(narrowCtrl.keyword === '') {
        narrowCtrl.hasSearched = true;
        narrowCtrl.found = [];
      } else {
        var promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.keyword);
        promise.then(function (results) {
          narrowCtrl.hasSearched = true;
          narrowCtrl.found = results;
        })
      }
    };
  }

  MenuSearchService.$inject = ['$http', 'MenuUri'];
  function MenuSearchService ($http, MenuUri) {
    this.getMatchedMenuItems = function (searchTerm) {
      return $http({url: MenuUri}).then(function (response) {
        var results = [];

        response.data.menu_items.forEach(function (item) {
          if(itemIsMatch(item, searchTerm)) {
            results.push(item);
          }
        })

        return results;
      })
    }

    function itemIsMatch (item, keyword) {
      function matches (phrase, keyword) {
        return phrase.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
      }

      return matches(item.short_name, keyword) ||
             matches(item.name, keyword) ||
             matches(item.description, keyword);
    }
  }

  function FoundItemsDirective () {
    var ddo = {
      restrict: 'E',
      templateUrl: 'foundItems.html',
      scope: {
        items: '<foundItems',  // one way binding
        remove: '&onRemove',   // pass method
        hasSearched : '<'      // one way binding
      },
      controller: 'FoundItemsDirectiveController',
      bindToController: true,
      controllerAs: 'foundItemsCtrl'
    }

    return ddo;
  }

  function FoundItemsDirectiveController (MenuSearchService) {}

})();



// (function(){'use strict';angular.module('NarrowItDownApp',[]).controller('NarrowItDownController',NarrowItDownController).service('MenuSearchService',MenuSearchService).directive('foundItems',FoundItemsDirective).controller('FoundItemsDirectiveController',FoundItemsDirectiveController).constant('MenuUri','https://davids-restaurant.herokuapp.com/menu_items.json');NarrowItDownController.$inject=['$scope','MenuSearchService'] function NarrowItDownController($scope,MenuSearchService){var narrowCtrl=this;narrowCtrl.keyword='';narrowCtrl.found=[];narrowCtrl.hasSearched=false;narrowCtrl.remove=function(index){narrowCtrl.found.splice(index,1);} narrowCtrl.getMatchedMenuItems=function(){if(narrowCtrl.keyword===''){narrowCtrl.hasSearched=true;narrowCtrl.found=[];}else{var promise=MenuSearchService.getMatchedMenuItems(narrowCtrl.keyword);promise.then(function(results){narrowCtrl.hasSearched=true;narrowCtrl.found=results;})}};} MenuSearchService.$inject=['$http','MenuUri'];function MenuSearchService($http,MenuUri){this.getMatchedMenuItems=function(searchTerm){return $http({url:MenuUri}).then(function(response){var results=[];response.data.menu_items.forEach(function(item){if(itemIsMatch(item,searchTerm)){results.push(item);}}) return results;})} function itemIsMatch(item,keyword){function matches(phrase,keyword){return phrase.toLowerCase().indexOf(keyword.toLowerCase())!==-1;} return matches(item.short_name,keyword)||matches(item.name,keyword)||matches(item.description,keyword);}} function FoundItemsDirective(){var ddo={restrict:'E',templateUrl:'foundItems.html',scope:{items:'<foundItems',remove:'&onRemove',hasSearched:'<'},controller:'FoundItemsDirectiveController',bindToController:true,controllerAs:'foundItemsCtrl'} return ddo;} function FoundItemsDirectiveController(MenuSearchService){}})();
