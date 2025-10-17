// AngularJS Button Component
angular.module('buttonApp', [])
  .component('customButton', {
    template: `
      <button 
        class="custom-btn" 
        ng-class="$ctrl.buttonClass" 
        ng-click="$ctrl.handleClick()" 
        ng-disabled="$ctrl.disabled">
        {{$ctrl.text || 'Click Me'}}
      </button>
    `,
    bindings: {
      text: '@',
      type: '@',
      disabled: '<',
      onClick: '&'
    },
    controller: function() {
      var ctrl = this;
      
      // Set default values
      ctrl.$onInit = function() {
        ctrl.buttonClass = 'btn-' + (ctrl.type || 'primary');
      };
      
      // Handle button click
      ctrl.handleClick = function() {
        if (ctrl.onClick) {
          ctrl.onClick();
        }
      };
    }
  })
  .controller('MainController', function() {
    var vm = this;
    
    vm.message = '';
    vm.isDisabled = false;
    
    vm.buttonClicked = function() {
      vm.message = 'Button was clicked at ' + new Date().toLocaleTimeString();
    };
    
    vm.toggleDisabled = function() {
      vm.isDisabled = !vm.isDisabled;
    };
  });
