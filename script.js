const data = [

//A
{
name:"Ararat Hotel",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/sp64ry1Jx9NvwSGb9",
status:"active"
},

{
name:"AD Hotel 1",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/EXwEQ19zhzosbX7g9",
status:"active"
},
{
name:"AD Motel 2",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/JoA1HgcsHmDMQSgM7",
status:"active"
},

{
name:"Amas Hypermarket",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/ygJKRKMCAQohKGY7A",
status:"active"
},


//B

,
{
name:"Bahare Kar Shorsh",
owner:"",
phone1:"+964 772 171 8657",
phone2:" ",
location:"https://maps.app.goo.gl/qQJegrF4VCmQfgPA8",
status:"active"
},

//b

{
name:"Blue Rose Motel",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/zsBsVKvysybxeesC6",
status:"active"
},

//c

{
name:"Calibration Modern",
owner:"Ahmad Nasraddin",
phone1:"+964 782 557 6825",
phone2:" ",
location:" https://maps.app.goo.gl/uDd14ByFswCP9CpcA?g_st=iw",
status:"active"
},

//d
{
name:"Detail Company",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/dQiPGXa8sMB3fsmE8",
status:"active"
}
,
  
  
//k

  {
name:"Kinam Hotel",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/o8zUoTmDQgUJThew7",
status:"active"
},


{
name:"Koshki Rashid",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/RgH2wmHgNNJQ8qPv7",
status:"active"
},

{
name:"King School",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/mwWHMNqsUhM5Jauj6",
status:"active"
},

{
name:"King school wazeran",
owner:"Ziad Surchi",
phone1:"+964 750 363 3454",
phone2:" ",
location:"https://www.google.com/maps?q=36.20460510253906,43.98479080200195&z=17&hl=en",
status:"active"
}

,

{
name:"Khalat",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/C3zcsRdjhUUkLP137",
status:"active"
},


  

//m

  ,
{
name:"Male Gashtearan",
owner:"",
phone1:"+964 750 853 3333",
phone2:" ",
location:"https://maps.app.goo.gl/RsHBJRckY6AXTA4q7",
status:"active"
},


{
name:"Mam Concret",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/AfmANnU6cq18mpBA6",
status:"active"
},


  
//z
,
{
name:"Zarawa Company",
owner:"",
phone1:"",
phone2:" ",
location:"https://maps.app.goo.gl/ngXUh8XCRyYnDDUV8?g_st=aw",
status:"active"
}
  
];

const list = document.getElementById("list");
const popup = document.getElementById("popup");

function displayList(items){
list.innerHTML = "";

items.forEach((item) => {
const div = document.createElement("div");
div.className = "list-item";
div.innerText = item.name;

// ✅ FIX HERE
div.onclick = () => showDetails(item);

list.appendChild(div);
});
}

// ✅ FIX HERE
function showDetails(item){

document.getElementById("popupName").innerText = item.name;
document.getElementById("owner").innerText = "Name: " + item.owner;

document.getElementById("phone1").innerText = "Phone No. 1: " + item.phone1;
document.getElementById("phone2").innerText = "Phone No. 2: " + item.phone2;

document.getElementById("mapLink").href = item.location;

const statusElement = document.getElementById("status");
statusElement.innerText = "Status: " + item.status;

statusElement.className = item.status === "active" ? "status-active" : "status-deactive";

document.getElementById("copy1").onclick = () => {
navigator.clipboard.writeText(item.phone1);
alert("Phone 1 copied!");
};

document.getElementById("copy2").onclick = () => {
navigator.clipboard.writeText(item.phone2);
alert("Phone 2 copied!");
};

list.style.display = "none";
document.getElementById("search").style.display = "none";
popup.style.display = "block";
}

function goBack(){
popup.style.display = "none";
list.style.display = "";
document.getElementById("search").style.display = "block";
displayList(data);
}

document.getElementById("search").addEventListener("input", function(){
const value = this.value.toLowerCase();

const filtered = data.filter(item =>
item.name.toLowerCase().includes(value)
);

displayList(filtered);
});

displayList(data);
