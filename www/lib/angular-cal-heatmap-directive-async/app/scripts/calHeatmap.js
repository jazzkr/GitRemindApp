'use strict';
angular.module('calHeatmap', []).directive('calHeatmap', function () {
    function link(scope, el) {
        var config = scope.cal_config;
        var element = el[0];
        var cal = new CalHeatMap();
        var defaults = {
            // Presentation
            itemSelector: element,
            domain: 'month',
            subDomain: 'x_day',
            range: 3,
            cellSize: 15,
            cellPadding: 1,
            cellRadius: 0,
            domainGutter: 10,
            domainMargin: [5, 5, 5, 5],
            domainDynamicDimension: false,
            verticalOrientation: true,
            label: {
              position: 'bottom',
              align: 'center',
              rotate: null,
              width: 100,
              offset: {x: 0, y:0},
              height: null
            },
            colLimit: 15,
            rowLimit: null,
            tooltip: true,

            //Data
            start: new Date(),
            data: '',
            dataType: 'json',
            highlight: false,
            weekStartOnMonday: true,
            minDate: null,
            maxDate: null,
            considerMissingDataAsZero: false,

            //Legend
            displayLegend: true,
            legend: [2, 4, 6, 8, 10],
            legendCellSize: 10,
            legendCellPadding: 2,
            legendMargin: [10, 0, 0, 0],
            legendVerticalPosition: 'bottom',
            legendHorizontalPosition: 'left',
            legendOrientation: 'horizontal',
            legendColors: null,
            subDomainTextFormat: ' ',

            //i18n
            itemName: ["commit", "commits"],
            subDomainTitleFormat: {
              empty: '{date}',
              filled: '{count} {name} {connector} {date}'
            },
            //subDomainDateFormat: null,
            subDomainTextFormat: function(date ,value) {
		            return value;
	          },
            //domainLabelFormat: null,
            legendTitleFormat: {
              lower: 'less than {min} {name}',
              inner: 'between {down} and {up} {name}',
              upper: 'more than {max} {name}'
            },
            animationDuration: 500,
            previousSelector: false,
            nextSelector: false,
            itemNamespace: 'cal-heatmap'
        };
        angular.extend(defaults, config);
        cal.init(defaults);
        scope.$watch('cal_config.data', function(newValue) {
          console.log("updating cal-heatmap!");
          console.log(newValue);
          cal.update(newValue);
        } );
    }
    return {
        template: '<div class="cal-heatmap"></div>',
        link: link
    };
});
