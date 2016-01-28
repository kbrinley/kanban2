'use strict';

/* From http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field-in-angularjs */

kanbanApp.directive('formFocus', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.formFocus, function(value) {
        if(value === true) { 
          console.log('value=',value);
          //$timeout(function() {
            element[0].focus();
            scope[attrs.focusMe] = false;
          //});
        }
      });
    }
  };
});