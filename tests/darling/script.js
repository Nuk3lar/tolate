function pl(i) {
    return (i == 1 ? '' : 's');
  }
  function convdelta(td) {
    var d = Math.floor(td / (24*60*60));
    td %= 24*60*60;
    var h = Math.floor(td / (60*60));
    td %= 60*60;
    var m = Math.floor(td / 60);
    td %= 60;
    var s = Math.floor(td);
    return (d + '&nbsp;day' + pl(d) +', '
        + h + '&nbsp;hour' + pl(h) + ', '
        + m + '&nbsp;minute' + pl(m) + '&nbsp;and '
        + s + '&nbsp;second' + pl(s));
  }
  function gettime() {
    /*
     * Find airing time, everything else is relative to that.
     * Manual conversion of 11:30pm JST says it's at 2:30pm UTC every Saturday.
     */
    var dateOptions = {weekday:'long', year:'numeric', month:'long', day:'numeric'};
    var timeOptions = {hour:'2-digit', minute:'2-digit', second:'2-digit'};
    var now = new Date();
    var d = new Date();
    var td;
    var td2;
    var datefix = false;
    d.setUTCHours(14);
    d.setUTCMinutes(30);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);
    d.setUTCDate(d.getDate() + (13 - d.getDay()) % 7);
    td = (d - now) / 1000;
    /*
     * Stupid hack to prevent negative times on airing day. -- Jump forward by a week.
     */
    if (td < 0) {
      d.setUTCDate(d.getUTCDate() + 7);
      td = (d - now) / 1000;
      datefix = true;
    }
    /*
     * There won't be an episode on April 28th, so let's make an exception
     */
    if (d.getMonth() == 3 && d.getDate() == 28) {
      d.setUTCDate(d.getUTCDate() + 7);
      td = (d - now) / 1000;
    }
    document.getElementById('airdate').innerHTML = d.toLocaleDateString(undefined, dateOptions);
    document.getElementById('airtime').innerHTML = d.toLocaleTimeString(undefined, timeOptions);
    document.getElementById('airdelta').innerHTML = convdelta(td);
    d.setUTCHours(16);
    d.setUTCMinutes(00);
    td2 = (d - now) / 1000;
    /*
     * Undo the above if needed to fix display for subtitles.
     */
    if (datefix && td2 < 0) {
      d.setUTCDate(d.getUTCDate() - 7);
    }
    document.getElementById('subdate').innerHTML = d.toLocaleDateString(undefined, dateOptions);
    document.getElementById('subtime').innerHTML = d.toLocaleTimeString(undefined, timeOptions);
    td = (d - now) / 1000;
    if (td < 0) {
      d.setUTCDate(d.getUTCDate() + 7);
      td = (d - now) / 1000;
    }
    document.getElementById('subdelta').innerHTML = convdelta(td);
  }
  function main() {
    gettime();
    window.setInterval(gettime, 1000);
    while (document.getElementsByClassName('reqjs').length > 0) {
      document.getElementsByClassName('reqjs')[0].classList.remove('reqjs');
    }
  }
  if (window.addEventListener) {
    window.addEventListener('load', main, false);
  } else {
    window.attachEvent('onload', main);
  }