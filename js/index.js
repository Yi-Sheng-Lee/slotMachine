$(document).ready(function () {
    var holder=[];
    var randomm = 0;
    var isRolling = false;
    var API = "https://ticket-adm.acumen.tools/api"

    $("#winner").hide();
    $("#arm").click(function () {
        if (!isRolling) {
            var arm = $(this).addClass('clicked');
            setTimeout(function() { arm.removeClass('clicked');}, 500);
            go();
        }
    });
    signin();
    function go () {
        isRolling = true;
        randomize();
        sliceNum();
        turnTheSlot();
        reset();
        console.log(randomm)

    }
    function randomize () {
        // var gap = 0
        randomm = Math.floor(Math.random()*100000000);
        // gap = 8 - (randomm).toString().length
        // console.log(randomm, gap)
        randomm = '0972523197'
        var num;
        if(randomm == 0){num = "0900000000"}
        else if(randomm < 10){num = "090000000" + randomm;}
        else if(randomm < 100){num = "09000000" + randomm;}
        else if(randomm < 1000){num="0900000" + randomm;}
        else if(randomm < 10000){num="090000" + randomm;}
        else if(randomm < 100000){num="09000" + randomm;}
        else if(randomm < 1000000){num="0900" + randomm;}
        else if(randomm < 10000000){num="090" + randomm;}
        else if(randomm < 100000000){num="09" + randomm;}
        // else{num = randomm}
        $("#winner").text(num);
    }

    function sliceNum () {
        var theNUM = $("#winner").text();
        for(var i = 0; i < 10; i++){
            var valu = theNUM.slice(i, i+1);
            holder.push(valu);
        }
        // console.log(holder)
    }

    function reset (){
        holder.length = 0;
    }

    function turnTheSlot () {
        var location = []
        for(var i=0; i < 10; i++){
            var theValue = holder[i];
            var margin= 100 * theValue + 1000*i + 6000;
            location.push(-margin)
            $("#"+i+"").css("margin-top", "-" + margin + "px");
        }
        setTimeout(function () {
            for(var i=0; i < 10;i++){
                $("#"+ i +"").removeClass("digitTransform")
            }
        }, 3000);
        setTimeout(function () {
            for(var i=0; i < 10;i++){
                $("#"+ i +"").css("margin-top", location[i] + 1000 * i + 6000 + "px");
            }
        }, 3500);
        setTimeout(function () {
            for(var i=0; i < 10;i++){
                $("#"+ i +"").addClass("digitTransform");
            }
            isRolling = false
        }, 4000);
    }
    function signin () {
        var payload = {
            "api_id": "5d88362abff235fb661ac513",
            "api_secret": "GvKHz1XQ1HJxyzeBZTXcfx1q8uDthpI8aks2YhaLc39aEp6IpZ5pWnIXO1GX57Iz"
        }
        $.ajax({
            type: "POST",
            data: JSON.stringify(payload),
            crossDomain: true,
            url: API + "/auth/customer/login",
            headers: {
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*',
                "Connection": 'keep-alive'
            },
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                console.log(data)
            }
        })
    }
});