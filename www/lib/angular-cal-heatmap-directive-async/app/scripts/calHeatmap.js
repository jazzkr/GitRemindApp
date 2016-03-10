'use strict';
angular.module('calHeatmap', []).directive('calHeatmap', function () {
    function link(scope, el) {
        var config = scope.config || {};
        var element = el[0];
        var cal = new CalHeatMap();
        var defaults = {
            itemSelector: element,
            domain: 'month',
            subDomain: 'x_day',
            subDomainTextFormat: ' ',
            data: '',
            start: new Date(),
            cellSize: 15,
            range: 3,
            domainGutter: 10,
            legend: [2, 4, 6, 8, 10],
            itemName: 'item',
            rowLimit: 15,
            tooltip: true
        };
        angular.extend(defaults, config);
        cal.init(defaults);
        scope.$watchCollection('config.data', function(newValue) {
            cal.update(newValue);
        } );
    }
    return {
        template: '<div class="cal-heatmap" config="config"></div>',
        restrict: 'E',
        link: link,
        scope: {
            config: '='
        }
    };
});
