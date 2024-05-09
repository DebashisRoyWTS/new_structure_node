"use strict";

// Class definition
var KTDashboard = function () {
    function convertToOnes (val) {
        val = val.toString();
        if (val.match(/k/gi)) {
            let num = val.replace(' K', '').trim();
            return Number(num * 1E3);
        } else if (val.match(/M/gi)) {
            let num = val.replace(' M', '').trim();
            return Number(num * 1E6);
        } else if (val.match(/B/gi)) {
            let num = val.replace(' B', '').trim();
            return Number(num * 1E9);
        } else if (val.match(/T/gi)) {
            let num = val.replace(' T', '').trim();
            return Number(num * 1E12);
        } else {
            return Number(val);
        }
    };

    function numFormatter (numbers) {
        const num = Number(numbers);
		const si = [
		  { value: 1, symbol: '' }, // if value < 1000, nothing to do
		  { value: 1E3, symbol: 'K' }, // convert to K for number from > 1000 < 1 million 
		  { value: 1E6, symbol: 'M' }, // convert to M for number from > 1 million 
		  { value: 1E9, symbol: 'B' }, // convert to B for number greater than 1 Billion
		  { value: 1E12, symbol: 'T' }, // convert to T for number greater than 1 Trillion
		];
		const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		let i;
		for (i = si.length - 1; i > 0; i--) {
		  if (num >= si[i].value) {
			break;
		  }
		}
		return (num / si[i].value).toFixed(2).replace(rx, '$1') + ' ' + si[i].symbol;
    }

    function animateValue(obj, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = numFormatter(Math.floor(progress * (convertToOnes(end) - convertToOnes(obj.innerHTML)) + convertToOnes(obj.innerHTML)));
            if (progress < 1) {
                if (convertToOnes(obj.innerHTML) !== convertToOnes(end)) {
                    window.requestAnimationFrame(step);
                }
            }
        };
        window.requestAnimationFrame(step);
    }
      
    var dashboardLog = () => {
        $.ajax({
            type: 'GET',
            url: `${window.location.protocol}//${window.location.host}/dashboard/dashboardLog`,
            data: {},
            dataType: 'json',
            success: function (result) {
                const totalCustomerCount = document.getElementById("totalCustomerCount");
                animateValue(totalCustomerCount, result.data.totalCustomers, 1500);

                const totalTechnicianCount = document.getElementById("totalTechnicianCount");
                animateValue(totalTechnicianCount, result.data.totalTechnicians, 1500);

                const totalBadgesCount = document.getElementById("totalBadgesCount");
                animateValue(totalBadgesCount, result.data.totalBadges, 1500);

                const totalServiceCategoryCount = document.getElementById("totalServiceCategoryCount");
                animateValue(totalServiceCategoryCount, result.data.totalServiceCategory, 1500);

                const totalServiceCount = document.getElementById("totalServiceCount");
                animateValue(totalServiceCount, result.data.totalServices, 1500);

                const totalProductCategoryCount = document.getElementById("totalProductCategoryCount");
                animateValue(totalProductCategoryCount, result.data.totalProductCategory, 1500);

                const totalProductCount = document.getElementById("totalProductCount");
                animateValue(totalProductCount, result.data.totalProducts, 1500);

                const totalJobCount = document.getElementById("totalJobCount");
                animateValue(totalJobCount, result.data.totalJobs, 1500);

                const totalStudioCount = document.getElementById("totalStudioCount");
                animateValue(totalStudioCount, result.data.totalStudios, 1500);

                const totalTrainingCount = document.getElementById("totalTrainingCount");
                animateValue(totalTrainingCount, result.data.totalTraining, 1500);

                const totalBlogsCount = document.getElementById("totalBlogsCount");
                animateValue(totalBlogsCount, result.data.totalBlogs, 1500);

                const totalBookingCount = document.getElementById("totalBookingCount");
                animateValue(totalBookingCount, result.data.totalBooking, 1500);
            }
        });
        return true;
    };

    return {
        // Init demos
        init: function () {
            
            // demo loading
            var loading = new KTDialog({
                'type': 'loader',
                'placement': 'top center',
                'message': 'Loading ...'
            });

            loading.show();

            if (
                dashboardLog()
            ) {
                loading.hide();
            }
            // setInterval(function () {
            //     groupLog();
            // }, 15000);
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function () {
    KTDashboard.init();
});