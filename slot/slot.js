$(document).ready(function () {
    var API = "https://ticket.motorworld.com.tw/api";
    var prizeName = window.localStorage.getItem("prize_name");
    var prizeId = window.localStorage.getItem("prize_id");
    var lotteryId = window.localStorage.getItem("lottery_id");
    var holder=[];
    var isRolling = false;
    var token = "";

    $("#winner").hide();
    $("#arm").click(function () {
        if (!isRolling) {
            var arm = $(this).addClass("clicked");
            setTimeout(function() { arm.removeClass("clicked");}, 500);
            getWinner();
        }
    });
    // 抽獎
    function go (mobile) {
        console.log('mobile', mobile)
        isRolling = true;
        var theNUM = mobile;
        var holderArr = [];
        var location = [];
        for(var i = 0; i < 10; i++){
            var valu = theNUM.slice(i, i+1);
            holderArr.push(valu);
        };
        for(var i=0; i < 10; i++){
            var theValue = holderArr[i];
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
            getWinnerList();
        }, 4000);
        holder.length = 0;
    };
    // 登入
    function signin () {
        var payload = {
            "api_id": "5f789b17a1b6a909d6de43a2",
            "api_secret": "ucNSeFMhVo2TKX6IOUFdxoyorNaU7CMAFmEtfcoN7vqACGwiE5nEQvdM5Q9kjcJN"
        }
        axios.post(API + "/auth/customer/login", payload, {
            headers: {
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(function (res) {
            // window.localStorage.setItem('lott_token', res.data.data.token);
            token = res.data.data.token;
            getPrizeInfo();
            // getWinnerList();
        }).catch(function (error) {
            // handle error
            console.log(error);
        });
    };
    // 取得 獎品資訊
    function getPrizeInfo () {
        axios.get(API + "/lottery/" + prizeId + "/prize", {
            headers: {
                'Authorization': token
            } 
        })
        .then(function (res) {
            var info = {};
            var str = "";
            res.data.data.forEach(e => {
                if (e.id == lotteryId) {
                    info = e
                };
            });
            console.log(info)
            $("#prize_title").html(prizeName + "  " + info.qty + "名");
            $("#prize_img").attr("src", info.image);
            $("#prize_name").html(info.name);
            $("#prize_qty").html("X&nbsp;1");
            // str = `<div class="card border-0" style="width: 100%; margin: auto; background: antiquewhite;">
            //             <img class="prize-img mt-4 p-1" src="${info.image}" alt="${info.name}">
            //             <div class="card-body">
            //                 <div class="text-center">
            //                     <span style="font-size: 30px;"><strong>${info.name}</strong></span><br/>
            //                     <span style="font-size: 20px;">${info.description}</span>
            //                 </div>
            //             </div>
            //         </div>`;
            // $("#prizeInfo").html(str);
            // $(".prize-img").css('max-width', '320px')
            //     .css('margin', 'auto')
            //     .css('border', '1px solid #f3cccc')
                // .css('border-radius', '6px');
        })
        .catch(function (err) {
            console.log(err);
        })
    }
    // 轉出得獎者
    function getWinner () {
        var payload = {
            "qty": 1,
            "prize_id": lotteryId
        };
        axios.post(API + '/lottery/' + prizeId + '/winner/take', payload, {
            headers: {
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*',
                'Authorization': token
            }
        }).then(function (res) {
            if (res.data.status == "success") {
                go(res.data.data[0].mobile);
            } else {
                alert(res.data.message);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
    };
    // 取得 得獎者清單
    function getWinnerList () {
        axios.get(API + '/lottery/' + prizeId + '/winner', {
            headers: {
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*',
                'Authorization': token
            }
        })
        .then(function (res) {
            var name = "";
            var tmp = "";
            // var phone = "";
            // var tmp2 = [];
            if (res.data.data[0].name.includes(" ")){
                tmp = res.data.data[0].name.split(" ");
            } else {
                tmp = res.data.data[0].name.split("");
            }
            name = tmp[0] + " X " + tmp[tmp.length - 1];
            $("#winner_no").html(res.data.data.length)
            $("#winner").html("姓名&nbsp;&nbsp;&nbsp;&nbsp;" + name)
            $("#winner_phone").html("電話末五碼&nbsp;&nbsp;&nbsp;" + res.data.data[0].mobile.slice(res.data.data[0].mobile.length - 5, res.data.data[0].mobile.length));
            $("#winner_box").removeClass('d-none');
            
            // var str = `<thead>
            //                 <tr><th colspan=3 class="text-center" style="font-size: 30px;">獲獎名單</th></tr>
            //                 <tr>
            //                     <th>姓名</th>
            //                     <th>E-mail</th>
            //                     <th>電話號碼</th>
            //                 </tr>
            //             </thead>`;
            // res.data.data.forEach(e => {
            //     var email = e.email.split('@');
            //     var name = "";
            //     var tmp = "";
            //     if (e.name.includes(" ")){
            //         tmp = e.name.split(" ");
            //     } else {
            //         tmp = e.name.split("");
            //     }
            //     name = tmp[0] + " X " + tmp[tmp.length - 1];
            //     str += `<tbody>
            //                 <tr>
            //                     <td>${name}</td>
            //                     <td>${email[0]}@XXXXXXXX</td>
            //                     <td>${e.mobile}</td>
            //                 </tr>`;
            // });
            // str += `</tbody>`;
            // if (res.data.data.length != 0) {
            //     $("#winnerList").html(str);
            // }
        })
        .catch(function (err) {
            console.log(err);
        })
    }
    signin();
});