'use strict';

/* From http://adamalbrecht.com/2013/12/12/creating-a-simple-modal-dialog-directive-in-angular-js/ */

kanbanApp.directive('modalDialog', function() {
   return {
       restrict: 'E',
       scope: {
           show: '='
       },
       replace: true,
       transclude: true,
       link: function(scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function() {
                scope.show = false;
            };
       },
       templateUrl: 'app/templates/modalDialog.html'
   };
});