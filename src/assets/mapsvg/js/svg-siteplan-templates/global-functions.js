function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function toUnique(a) { //array,placeholder,placeholder
    let b;
    let c;

    b = a.length;
    while (c = --b) while (c--) a[b] !== a[c] || a.splice(c, 1);
    return a;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function currencyFormattedNumber(number, currency = 'Rp. ', thousandsSeparator = ',', decimalSeparator = '.') {
    if (parseInt(number) == 0) {
        return currency + number;
    } else {
        let parts = number.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        return currency + parts.join(decimalSeparator) + (parts.length === 1 ? decimalSeparator + '00' : (parts[1].length === 1 ? '0' : ''));
    }
}

function daysBetween(startDate, endDate) {
    // Convert both dates to milliseconds
    var startDate_ms = startDate.getTime();
    var endDate_ms = endDate.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = endDate_ms - startDate_ms;
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);

    var diff = '';
    if (days != 0) diff += days + ' days, ';
    if (hours != 0) diff += hours + ' hours, ';
    if (minutes != 0) diff += minutes + ' minutes, ';

    diff += seconds + ' seconds ';

    return diff;
}
