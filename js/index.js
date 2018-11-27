var 
itemurl="https://awiclass.monoame.com/api/command.php?type=get&name=itemdata";
// 新增一個商品清單的物件
var shoplist={};
shoplist.name="MyBuylist 購物清單";
shoplist.time="2014/6/30";
// 商品清單的清單裡面是個陣列，塞商品物件們
shoplist.list=[
  {name: "原子筆",price: 10},
  {name: "公事包",price: 9000},
  {name: "筆記型電腦",price: 54555},
  {name: "Iphone 8s",price: 32000},
  {name: "皮夾",price: 5000}
];
// ajax非同步的，而是在網頁全部載入後，才去問url有甚麼資料，等url回覆資料，再動態的轉換成可以讀的資料格式(使用"JSON.parse(res);")，最後再用"showlist()"顯示到畫面上
$.ajax({
  url: itemurl,
  success: function(res){
    shoplist.list=JSON.parse(res);
    showlist();
  }
});

// 定義元素用的html模板，{{名稱}}代表要套入的地方
var item_html="<li id={{id}} class='buy_item'>{{num}}.{{item}}<div class='price'>{{price}}</div><div id={{del_id}} data-del-id='{{delid}}' class='del_btn'>X</div></li>";

var total_html="<li class='buy_item total'>總價<div class='price'>{{price}}</div></li>";
// 刪除並重新產生清單中所有項目
function showlist(){
  $("#items_list").html("");
  var total_price=0;
  // 把每個項目做出來
  for (var i=0;i<shoplist.list.length;i+=1){
    var item=shoplist.list[i];
    var item_id="buyitem_"+i;
    var del_item_id="del_buyitem_"+i;
    // 動態統計總價(每一項跑時加上去)
    total_price+=parseInt(item.price);
    // 取代模板位置成資料replace(要取代的,取代成...)
    var current_item_html=
        item_html.replace("{{num}}",i+1)
                 .replace("{{item}}",item.name)
                 .replace("{{id}}",item_id)
                 .replace("{{del_id}}",del_item_id)
                 .replace("{{delid}}",i)
                 .replace("{{price}}",item.price)
    ;
    // 加入元素後才能夠用jquery操作
    $("#items_list").append(current_item_html);
    // delbtn  id  buyitem_1
    $("#"+del_item_id).click(
     function(){
        remove_item(parseInt($(this).attr("data-del-id"))); 
     } 
    );
  }
  
  // 新增總價那一欄
  var current_total_html=
      total_html.replace("{{price}}",total_price);
  $("#items_list").append(current_total_html);
}
// 先顯示一次，因為前面指定義好function 還沒有執行
showlist();
// 新增資料流程: 動態push一筆資料->呼叫shoplist重新渲染清單
$(".addbtn").click(
  function(){
    // 使用val()存取輸入的值，val("..")有給參數是設定
    shoplist.list.push(
    {
      name:$("#input_name").val(),
      price:$("#input_price").val()
    }
  );
    $("#input_name").val("");
    $("#input_price").val("");
    showlist();
 }
);
// 刪除項目 陣列.splice(位置,長度)
// 刪除資料->重新根據資料渲染清單
function remove_item(id){
  shoplist.list.splice(id,1);
  showlist();
}