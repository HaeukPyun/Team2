// window.onload = function () {
//     let obj = document.getElementById('tetris_icon');
//     obj.onmousedown = function (e) {
//         obj.xGap=e.clientX-obj.offsetLeft;
//         obj.yGap=e.clientY-obj.offsetTop;
       
//         window.onmousemove = function (e2) {
           
//             obj.style.left = (e2.clientX - obj.xGap)+ 'px';
//             obj.style.top = (e2.clientY - obj.yGap) + 'px';
//         };
//     };
//     obj.onmouseup = function (e) {
      
//         window.onmousemove = null;
//     }
// }