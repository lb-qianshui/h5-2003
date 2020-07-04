var i=()=>{
    console.log(111);
}
i();
var xhr = new XMLHttpRequest;
xhr.open('get','/aaa')
xhr.send();
xhr.onload = function(){
    console.log(xhr.responseText);
}