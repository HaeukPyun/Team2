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
        var internet_address = prompt("[http:// 이후를 입력해주세요.]");
        $('#iframe').css('display','inline');
        iframe.location.href='http://'+internet_address;
    }); //인터넷창       


    /////////////////////////////////////////////////////////////
    // 시간 부분 수정함.
    /////////////////////////////////////////////////////////////
    

    $('#textarea').keyup(function(){
        console.log(this.value());
    });
});