const menu = [
  {name:"Steak et Frite", cat:"Appetizers", price:"$7", desc:"Beef steak · mushroom sauce · thin fried frites"},
  {name:"Polo et Spinach", cat:"Appetizers", price:"$6", desc:"Chicken breast stuffed with spinach and cheese · pink sauce · thin fried frites"},
  {name:"Shrimps et Frite", cat:"Appetizers", price:"$8", desc:"Shrimps marinated in lemon and garlic · mushroom sauce"},
  {name:"Baby Potatoes", cat:"Appetizers", price:"$5", desc:"Baby potatoes cooked to perfection · Parmesano and garlic"},
  {name:"Fresh Focaccia", cat:"Appetizers", price:"$3", desc:"In-house baked focaccia served with olive oil and tartar"},
  {name:"The Smoked Pollo", cat:"Sandwiches", price:"$10", desc:"Marinated chicken breast · caramelized onion · mushrooms · tartar · panea · kale · smokey cheese sauce"},
  {name:"The Burro Beef", cat:"Sandwiches", price:"$10", desc:"Beef filet mignon · caramelized onion · mushrooms · tartar · panea · kale · smokey cheese sauce"},
  {name:"The Gambaretto", cat:"Sandwiches", price:"$12", desc:"Jumbo shrimp · caramelized onion · mushrooms · avocado · tartar · panea · kale · smokey cheese sauce"},
  {name:"The Salmon Sumo", cat:"Sandwiches", price:"$15", desc:"Fresh panfried salmon · caramelized onion · mushrooms · carrots · cabbage · tartar · panea · kale · smokey cheese sauce · Asian sauce"},
  {name:"The Verdura Fling", cat:"Sandwiches", price:"$6", desc:"Vegetarian option · avocado · caramelized onion · mushrooms · tartar · panea · kale · smokey cheese sauce"},
  {name:"The Quack au Pain", cat:"Sandwiches", price:"$15", desc:"Duck breast to perfection · caramelized onion · sautéed mushrooms · tartar · panea · kale · smokey cheese sauce"},
  {name:"The Nosh Salad", cat:"Salads", price:"$6", desc:"TheNosh house salad — see the original menu board for current details."},
  {name:"The Nosh Caesar", cat:"Salads", price:"$7", desc:"TheNosh Caesar salad — see the original menu board for current details."},
  {name:"Beef Burger", cat:"Burgers", price:"$6.5", desc:"Beef patty 100g · caramelized onion · cheddar cheese · cocktail sauce"},
  {name:"Nosh Sliders x2", cat:"Burgers", price:"$11", desc:"Beef patty 100g · caramelized onion · cheddar cheese · cocktail sauce"},
  {name:"Chicken Burger", cat:"Burgers", price:"$5", desc:"Chicken breast · caramelized onion · cheddar cheese · tartar · kale"},
  {name:"The Chicken Plate", cat:"Main Dishes", price:"$15", desc:"Chicken breast · baby potatoes · smokey cheese sauce · sided pickles"},
  {name:"The Duck Plate", cat:"Main Dishes", price:"$22", desc:"Duck breast · baby potatoes · smokey cheese sauce · sided pickles"},
  {name:"The Salmon Plate", cat:"Main Dishes", price:"$25", desc:"Fresh salmon fillet · baby potatoes · smokey cheese sauce · sided pickles and lemon"},
  {name:"The Steak Plate", cat:"Main Dishes", price:"$20", desc:"Beef filet mignon · baby potatoes · smokey cheese sauce · sided pickles"}
];

const filters = document.querySelector("#filters");
const menuList = document.querySelector("#menuList");
const categories = ["All", ...new Set(menu.map(x => x.cat))];

filters.innerHTML = categories.map(c => `<button class="filter ${c==="All"?"active":""}" data-cat="${c}">${c}</button>`).join("");

function renderMenu(cat="All"){
  const items = cat==="All" ? menu : menu.filter(x=>x.cat===cat);
  menuList.innerHTML = items.map(x=>`
    <article class="menu-item">
      <div>
        <div class="menu-top"><h3>${x.name}</h3><span class="price">${x.price}</span></div>
        <p>${x.desc}</p>
      </div>
      <span class="tag">${x.cat}</span>
    </article>
  `).join("");
}
renderMenu();

filters.addEventListener("click", e=>{
  const btn=e.target.closest("[data-cat]");
  if(!btn)return;
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderMenu(btn.dataset.cat);
});

// Mobile nav
const burger=document.querySelector(".hamburger"), mobile=document.querySelector(".mobile-nav");
burger.addEventListener("click",()=>{
  const open=mobile.classList.toggle("open");
  burger.setAttribute("aria-expanded",open);
  burger.textContent=open?"×":"☰";
});
mobile.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  mobile.classList.remove("open"); burger.setAttribute("aria-expanded","false"); burger.textContent="☰";
}));

// Reservation -> WhatsApp
const modal=document.querySelector("#reservationModal");
const reserveForm=document.querySelector("#reserveForm");
const dateInput=document.querySelector("#date");
const reserveMessage=document.querySelector("#reserveMessage");

function openModal(){modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";}

document.querySelectorAll("[data-reserve]").forEach(b=>b.addEventListener("click",openModal));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeLightbox();}});

const today=new Date();
dateInput.min=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
dateInput.addEventListener("change",()=>{
  const d=new Date(dateInput.value+"T12:00:00");
  reserveMessage.textContent=d.getDay()===1?"TheNosh is closed on Mondays. Please choose another date.":"";
  if(d.getDay()===1) dateInput.value="";
});

reserveForm.addEventListener("submit",e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(reserveForm));
  const day=new Date(data.date+"T12:00:00").getDay();
  if(day===1){reserveMessage.textContent="Monday is closed. Please choose another date.";return;}
  const msg=`Hello TheNosh! I'd like to reserve a table.%0A%0AName: ${encodeURIComponent(data.name)}%0APhone: ${encodeURIComponent(data.phone)}%0ADate: ${encodeURIComponent(data.date)}%0ATime: ${encodeURIComponent(data.time)}%0AGuests: ${encodeURIComponent(data.guests)}%0ASpecial request: ${encodeURIComponent(data.request||"None")}`;
  window.open(`https://wa.me/96176054688?text=${msg}`,"_blank","noopener");
  reserveMessage.textContent="Opening WhatsApp with your reservation request…";
});

// Lightbox
const lightbox=document.querySelector("#lightbox"), lightboxImg=document.querySelector("#lightboxImg");
function openLightbox(src){lightboxImg.src=src;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeLightbox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");lightboxImg.src="";document.body.style.overflow="";}
document.querySelectorAll("[data-lightbox]").forEach(el=>el.addEventListener("click",()=>openLightbox(el.dataset.lightbox)));
document.querySelector("[data-lightbox-close]").addEventListener("click",closeLightbox);
lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox();});

document.querySelector("#year").textContent=new Date().getFullYear();
