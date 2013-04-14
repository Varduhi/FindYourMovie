


(function() {
	
	

    function refreshFiltersList(root) {
            
        var summary = [];
        var shown = 0;
        
        for (var i=0; i<root.filters.length; i++) {
            
            var filter = root.filters[i];
            var notadded = 0;
            
            for (var j=0; j<filter.values.length; j++) {
                if (filter.values[j].added()) {
                    summary.push(filter.values[j].text);
                } else {
                    notadded++;
                }
            }
            
            filter.show(notadded > 0);
            
            if (filter.show()) {
                shown++;
            }
        }
        root.showAddFilters(shown > 0);
        root.filterSummary(summary.join(', '));
    }

    var vm = {
        filters: [
            {
                name: 'Gender',
                values: [
                    {value: 'M', text: 'Male', added: ko.observable(false)},
                    {value: 'F', text: 'Female', added: ko.observable(false)}
                ],
                show: ko.observable(true)
            },
            {
                name: 'Age Group',
                values: [
                    {value: 1, text: 'Under 18', added: ko.observable(false)},
                    {value: 18, text: '18-24', added: ko.observable(false)},
                    {value: 25, text: '25-34', added: ko.observable(false)},
                    {value: 35, text: '35-44', added: ko.observable(false)},
                    {value: 45, text: '45-49', added: ko.observable(false)},
                    {value: 50, text: '50-55', added: ko.observable(false)},
                    {value: 56, text: '56+', added: ko.observable(false)}
                ],
                show: ko.observable(true)
            },
            {
                name: 'Occuption',
                values: [
                    {value: 0, text: 'other', added: ko.observable(false)},
                    {value: 1, text: 'academic/educator', added: ko.observable(false)},
                    {value: 2, text: 'artist', added: ko.observable(false)},
                    {value: 3, text: 'clerical/admin', added: ko.observable(false)},
                    {value: 4, text: 'college/grad student', added: ko.observable(false)},
                    {value: 5, text: 'customer service', added: ko.observable(false)},
                    {value: 6, text: 'doctor/health care', added: ko.observable(false)},
                    {value: 7, text: 'executive/managerial', added: ko.observable(false)},
                    {value: 8, text: 'farmer', added: ko.observable(false)},
                    {value: 9, text: 'homemaker', added: ko.observable(false)},
                    {value: 10, text: 'K-12 student', added: ko.observable(false)},
                    {value: 11, text: 'lawyer', added: ko.observable(false)},
                    {value: 12, text: 'programmer', added: ko.observable(false)},
                    {value: 13, text: 'retired', added: ko.observable(false)},
                    {value: 14, text: 'sales/marketing', added: ko.observable(false)},
                    {value: 15, text: 'scientist', added: ko.observable(false)},
                    {value: 16, text: 'self-employed', added: ko.observable(false)},
                    {value: 17, text: 'technician/engineer', added: ko.observable(false)},
                    {value: 18, text: 'tradesman/craftsman', added: ko.observable(false)},
                    {value: 19, text: 'unemployed', added: ko.observable(false)},
                    {value: 20, text: 'writer', added: ko.observable(false)}
                ],
                show: ko.observable(true)
            },
            {
                name: 'Genres',
                values: [
                    {value: 'Action', text: 'Action', added: ko.observable(false)},
                    {value: 'Adventure', text: 'Adventure', added: ko.observable(false)},
                    {value: 'Animation', text: 'Animation', added: ko.observable(false)},
                    {value: 'Children\'s', text: 'Children\'s', added: ko.observable(false)},
                    {value: 'Comedy', text: 'Comedy', added: ko.observable(false)},
                    {value: 'Crime', text: 'Crime', added: ko.observable(false)},
                    {value: 'Documentary', text: 'Documentary', added: ko.observable(false)},
                    {value: 'Drama', text: 'Drama', added: ko.observable(false)},
                    {value: 'Fantasy', text: 'Fantasy', added: ko.observable(false)},
                    {value: 'Film-Noir', text: 'Film-Noir', added: ko.observable(false)},
                    {value: 'Horror', text: 'Horror', added: ko.observable(false)},
                    {value: 'Musical', text: 'Musical', added: ko.observable(false)},
                    {value: 'Mystery', text: 'Mystery', added: ko.observable(false)},
                    {value: 'Romance', text: 'Romance', added: ko.observable(false)},
                    {value: 'Sci-Fi', text: 'Sci-Fi', added: ko.observable(false)},
                    {value: 'Thriller', text: 'Thriller', added: ko.observable(false)},
                    {value: 'War', text: 'War', added: ko.observable(false)},
                    {value: 'Western', text: 'Western', added: ko.observable(false)}
                ],
                show: ko.observable(true)
            },
            {
                name: 'Ratings',
                values: [
                    {value: 1, text:'1 Star', added: ko.observable(false)},
                    {value: 2, text:'2 Stars', added: ko.observable(false)},
                    {value: 3, text:'3 Stars', added: ko.observable(false)},
                    {value: 4, text:'4 Stars', added: ko.observable(false)},
                    {value: 5, text:'5 Stars', added: ko.observable(false)}
                ],
                show: ko.observable(true)
            }
        ],
        addedFilters: ko.observableArray([]),
        filterSummary: ko.observable(''),
        showAddFilters: ko.observable(true),
        addFilter: function(item, parent, root) {
            console.log("adding filter:");
            console.log(item);
            console.log(parent);
            console.log(root);
            
            item.added(true);
            root.addedFilters.push(item);
            refreshFiltersList(root);
        },
        removeFilter: function(item, root) {
            console.log("removing filter:");
            console.log(item);
            console.log(root);
            
            item.added(false);
            var index = root.addedFilters.indexOf(item);
            root.addedFilters.splice(index, 1);
            refreshFiltersList(root);
        }
    };
    ko.applyBindings(vm);
}());



$(document).ready(function() {
		


    var menuState = false;
    $('.click-to-open').click(function() {
        if (menuState) {
            menuState = false;
            $('.inner-menu').slideUp("slow");
        } else {
            menuState = true;
            $('.inner-menu').slideDown("slow");
        }
    });
    
    
});