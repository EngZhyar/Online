const data = [


{
name:"Calibration Modern",
owner:"Ahmad Nasraddin",
phone1:"+964 782 557 6825",
phone2:" ",
location:" https://maps.app.goo.gl/uDd14ByFswCP9CpcA?g_st=iw",
status:"active"
}
,
{
name:"Haware Hawler",
owner:"Nawar IT manager",
phone1:"+964 783 577 9253",
phone2:" ",
location:"https://maps.app.goo.gl/8MhFnncGykc6kaEh6",
status:"active"
}

,
{
name:"Oscar hotel",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/ACkEhvGuMdSwQXY28",
status:"active"
}

,
{
name:"Vote 2 hotel",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/SE7BHmV3u33spxHJ8",
status:"active"
}



  ,
{
name:"ararat hotel",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/sp64ry1Jx9NvwSGb9",
status:"active"
}


,
{
name:"ad hotel 1",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/EXwEQ19zhzosbX7g9",
status:"active"
}



  ,
{
name:"ad motel 2",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/JoA1HgcsHmDMQSgM7",
status:"active"
}

  
,
{
name:"Blue rose motel",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/zsBsVKvysybxeesC6",
status:"active"
}



  ,
{
name:"Dwnay Hotel",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/GYWpKJd4oooZqbSt7",
status:"active"
}



  
,
{
name:"",
owner:"",
phone1:"",
phone2:" ",
location:"",
status:"active"
}



  ,
{
name:"",
owner:"",
phone1:"",
phone2:" ",
location:"",
status:"active"
}


  
,
{
name:"",
owner:"",
phone1:"",
phone2:" ",
location:"",
status:"active"
}



  ,
{
name:"",
owner:"",
phone1:"",
phone2:" ",
location:"",
status:"active"
}


  
,
{
name:"",
owner:"",
phone1:"",
phone2:" ",
location:"",
status:"active"
}



  ,
{
name:"",
owner:"",
phone1:"",
phone2:" ",
location:"",
status:"active"
}




  

];

window.onload = function(){

setTimeout(function(){
document.getElementById("loadingScreen").style.display="none";
},2000);

};


const list = document.getElementById("list");
const popup = document.getElementById("popup");

function displayList(items){

list.innerHTML="";

items.forEach((item,index)=>{

const div=document.createElement("div");

div.className="list-item";
div.innerText=item.name;

div.onclick=()=>showDetails(index);

list.appendChild(div);

});

}

function showDetails(index){

const item=data[index];

document.getElementById("popupName").innerText=item.name;
document.getElementById("owner").innerText="Name: "+item.owner;

document.getElementById("phone1").innerText="Phone No. 1: "+item.phone1;
document.getElementById("phone2").innerText="Phone No. 2: "+item.phone2;

document.getElementById("mapLink").href=item.location;

const statusElement=document.getElementById("status");
statusElement.innerText="Status: "+item.status;

if(item.status==="active"){
statusElement.className="status-active";
}else{
statusElement.className="status-deactive";
}

document.getElementById("copy1").onclick=()=>{
navigator.clipboard.writeText(item.phone1);
alert("Phone 1 copied!");
};

document.getElementById("copy2").onclick=()=>{
navigator.clipboard.writeText(item.phone2);
alert("Phone 2 copied!");
};

list.style.display="none";
document.getElementById("search").style.display="none";
popup.style.display="block";

}

function goBack(){

popup.style.display="none";
list.style.display="";
document.getElementById("search").style.display="block";

displayList(data);

}

document.getElementById("search").addEventListener("input",function(){

const value=this.value.toLowerCase();

const filtered=data.filter(item =>
item.name.toLowerCase().includes(value)
);

displayList(filtered);

});

displayList(data);

const text = "Online Company";
const loadingText = document.getElementById("loadingText");

let i = 0;

function typeEffect(){

if(i < text.length){

loadingText.innerHTML += text.charAt(i);

i++;

setTimeout(typeEffect, 100);

}

}

typeEffect();

window.onload = function(){

setTimeout(function(){

document.getElementById("loadingScreen").style.display="none";

},3000);


};

