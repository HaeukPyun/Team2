document.addEventListener("DOMContentLoaded", function () {
    realTimer();
    setInterval(realTimer, 600);
});
function addZ(num) {
    if (num < 10) { num = "0" + num; }
    return num;
}
function realTimer() {

    const nowDate = new Date();

    const year = nowDate.getFullYear();

    const month = nowDate.getMonth() + 1;

    const date = nowDate.getDate();

    const hour = nowDate.getHours();

    const min = nowDate.getMinutes();

    const sec = nowDate.getSeconds();

    document.getElementById("nowTimes").innerHTML = 
    hour + ":" + addZ(min) + ":"+addZ(sec);;

    document.getElementById("nowTimes2").innerHTML = 
    year + "-" + addZ(month) + "-" + addZ(date);

}