$(document).ready(function(){
    $(document).keydown(function(event){
        if(event.keyCode == 27 || event.which ==27){
            $('#iframe').css('display','none');
        }
    }); //esc 누르면 iframe 닫히게 만들기
    
    $('.iconStarter').dblclick(function(){
        $('#iframe').css('display','inline');
        $('#iframe').css('backgroundColor','cornsilk');
    }); // 테트리스 창 실행
               
    $(document).keydown(function(event){
        if(event.keyCode == 90 || event.which ==90){
            $('#window_frame').css('display','inline');
        }else if(event.keyCode == 27 || event.which ==27){
            $('#window_frame').css('display','none');
        }
    }); //z 누르면 windowframe 나오고 esc누르면 사라지기
        
    $('#chrome_icon').click(function(){
        var internet_address = prompt('인터넷주소 입력[★http://는 빼고 입력해주세요.]');
        $('#iframe').css('display','inline');
        iframe.location.href='http://'+internet_address;
    }); //인터넷창
 
    let clock = new Date();
    let hours = clock.getHours();
    if(hours>=12){
        hours='오후'+(hours-12);
    }else if(hours<12){
        hours='오전'+(hours);
    }
    let minutes = clock.getMinutes()+'<br>'; 
    let year = clock.getFullYear();
    let month=clock.getMonth()+1;
    let day = clock.getDate();
    document.getElementById('clock').innerHTML=hours+':'+minutes+(year+'-'+month+'-'+day);

    $('#textarea').keyup(function(){
        console.log(this.value());
    });
});