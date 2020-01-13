//== Class definition

var BookingUnit = function () {
	//== Private functions

	var lazyLoading = function (method, selector, message, location) {
		mApp.block(selector, {
			overlayColor: '#000000',
			type: 'loader',
			state: 'danger',
			message: message
		});

		setTimeout(function () {
			mApp.unblock(selector);
			if (method == "verify-customer") {
				$("#modal_verify").modal("show");
			}
			if (method == "add-to-chart") {
				if (location != null) {
					window.location.href = location;
				}
			}
		}, 2000);
	}	
	
	var unitSelectionForm = function () {
        $("#form-unit-Selection").validate({
            // define validation rules
            rules: {
                rennov: { required: true },
				term: { required: true }
            },
            
            //display error alert on form submit  
            invalidHandler: function(event, validator) {     
                var alert = $('#alert-verify-customer');
                alert.removeClass('m--hide').show();
                mApp.scrollTo(alert, -200);
            },

            submitHandler: function (form) {
				lazyLoading(
					'add-to-chart', 
					'#data-unit-selection', 
					'Adding to chart ..', 
					'cart/cart-list-unit.html');
            }
        });       
	}
	
	var verifyCustomerForm = function () {
        $("#form-verify-customer").validate({
            // define validation rules
            rules: {
                fullname: { required: true },
				idnumber: { required: true }
            },
            
            //display error alert on form submit  
            invalidHandler: function(event, validator) {     
                var alert = $('#alert-verify-customer');
                alert.removeClass('m--hide').show();
                mApp.scrollTo(alert, -200);
            },

            submitHandler: function (form) {
				 lazyLoading(
					 'verify-customer', 
					 '#verify-customer-wrapper', 
					 'Verifying ' + $(".fullname").val() + ' ..', 
					 null);
            }
        });       
	}	

	var confirmOrderForm = function () {
        $("#confirm-order-wrapper").validate({
            // define validation rules
            rules: {
                fundsource: { required: true },
				transactiondestination: { required: true },
				bankname: { required: true },
				cardnumber: { required: true }
            },
            
            //display error alert on form submit  
            invalidHandler: function(event, validator) {     
                var alert = $('#alert-verify-customer');
                alert.removeClass('m--hide').show();
                mApp.scrollTo(alert, -200);
            },

            submitHandler: function (form) {
				alert();
				//  lazyLoading(
				// 	 'verify-customer', 
				// 	 '#verify-customer-wrapper', 
				// 	 'Verifying ' + $(".fullname").val() + ' ..', 
				// 	 null);
            }
        });       
	}	

	var bookingAgain = function() {
		$('#booking-cancel').click(function () {
			window.location.href = "available-unit-diagramatic.html";
		});
		$('#booking-again').click(function () {
			window.location.href = "booking-unit.html";
			//$("#modal_bookingexpired").modal("hide");
			//bookingDuration();
		});
	}

	var bookingDuration = function() {
		var location = window.location.toString();
		location = location.split("/");
		// var position = location[location.length - 1];
		console.log('iki location',location);
		var position=false;
		for(var i=0; i<=location.length; i++)
		{
			if (location[i]==='cart'){
				position=true;
			}
		}
		if (position == "false") {
			console.log('proses put timer')
			document.getElementById('timer').innerHTML = localStorage.getItem('booking_duration');
			startTimer();
		} else {
			$( "#start" ).click(function() {
				alert('Your unit has been reserved for 30 minutes')
				document.getElementById('timer').innerHTML = 30 + ":" + 00;
				localStorage.setItem('booking_duration', 30 + ":" + 00);
				startTimer();
			}); 
		}

		function startTimer() {
			var presentTime = document.getElementById('timer').innerHTML;
			var timeArray = presentTime.split(/[:]+/);
			var m = timeArray[0];
			var s = checkSecond((timeArray[1] - 1));
			if(s==59){m=m-1}
			if(m==0&&s==0) {
				document.getElementById('timer').innerHTML = "Expired";
				$("#modal_bookingexpired").modal("show");
			} else {
				document.getElementById('timer').innerHTML = m + ":" + s;
				setTimeout(startTimer, 1000);
			}
		}

		function checkSecond(sec) {
			if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
			if (sec < 0) {sec = "59"};
			return sec;
		}		
	}

	return {
		// public functions
		init: function () {
			unitSelectionForm();
			verifyCustomerForm();
			confirmOrderForm();
			bookingDuration();	
			bookingAgain();
		}
	};
}();

jQuery(document).ready(function () {
	BookingUnit.init();
});