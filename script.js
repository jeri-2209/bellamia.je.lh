const products = [
 {id:1,name:"Perfume Floral 100 ml",category:"Perfumes",price:129.90,oldPrice:159.90,offer:true,rating:4.8,reviews:124,img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=85"},
 {id:2,name:"Top básico de tirantes",category:"Ropa",price:49.90,oldPrice:59.90,offer:true,rating:4.7,reviews:87,img:"https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=600&q=85"},
 {id:3,name:"Zapatillas casuales",category:"Zapatos",price:119.90,oldPrice:null,offer:false,rating:4.6,reviews:96,img:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=85"},
 {id:4,name:"Aretes corazón dorado",category:"Aretes",price:39.90,oldPrice:49.90,offer:true,rating:4.8,reviews:76,img:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=85"},
 {id:5,name:"Bolso de mano clásico",category:"Bolsos",price:159.90,oldPrice:null,offer:false,rating:4.9,reviews:58,img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=85"},
 {id:6,name:"Reloj minimalista",category:"Relojes",price:89.90,oldPrice:109.90,offer:true,rating:4.5,reviews:43,img:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=85"},
 {id:7,name:"Set de maquillaje",category:"Maquillaje",price:69.90,oldPrice:null,offer:false,rating:4.7,reviews:64,img:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=85"},
 {id:8,name:"Crema hidratante",category:"Cuidado personal",price:45.90,oldPrice:55.90,offer:true,rating:4.6,reviews:39,img:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=85"},
 {id:9,name:"Vestido rosa elegante",category:"Ropa",price:139.90,oldPrice:null,offer:false,rating:4.9,reviews:112,img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=85"},
 {id:10,name:"Perfume Rosa 50 ml",category:"Perfumes",price:89.90,oldPrice:99.90,offer:true,rating:4.5,reviews:51,img:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=85"},
 {id:11,name:"Sandalias de vestir",category:"Zapatos",price:99.90,oldPrice:null,offer:false,rating:4.4,reviews:32,img:"https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=85"},
 {id:12,name:"Bolso para todos los días",category:"Bolsos",price:119.90,oldPrice:149.90,offer:true,rating:4.8,reviews:69,img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=85"}
];
const categories=[...new Set(products.map(p=>p.category))];
let activeCategory="",appliedMax=500,onlyOffers=false,cart=[],favorites=new Set();
const $=id=>document.getElementById(id);
function money(n){return "S/ "+n.toFixed(2)}
function toast(msg){const t=$("toast");t.textContent=msg;t.style.display="block";clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.style.display="none",2400)}
function buildCategoryChecks(){ $("categoryChecks").innerHTML=categories.map(c=>`<label class="checkline"><input type="checkbox" value="${c}" class="category-check"> ${c}</label>`).join("") }
function filteredProducts(){
 let list=products.filter(p=>(!activeCategory||p.category===activeCategory)&&p.price<=appliedMax&&(!onlyOffers||p.offer));
 const q=$("searchInput").value.trim().toLowerCase();
 if(q) list=list.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q));
 const sort=$("sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"es"));
 return list;
}
function renderProducts(){
 const list=filteredProducts(),grid=$("productGrid");
 if(!list.length){grid.innerHTML='<div class="no-results">No encontramos productos con esos filtros. Prueba con otra categoría o precio. 🌸</div>';return}
 grid.innerHTML=list.map(p=>`<article class="product"><div class="product-image"><img loading="lazy" src="${p.img}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80'"><button class="heart ${favorites.has(p.id)?"saved":""}" data-fav="${p.id}" aria-label="Añadir a favoritos">${favorites.has(p.id)?"♥":"♡"}</button></div><div class="product-info"><h3>${p.name}</h3><div class="price">${money(p.price)} ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}</div><div class="rating">★★★★★ <span>(${p.reviews})</span></div><button class="add" data-add="${p.id}">Agregar al carrito</button></div></article>`).join("");
}
function renderCart(){
 $("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map(i=>`<div class="cart-item"><img src="${i.img}" alt=""><div><strong>${i.name}</strong><p>${money(i.price)} × ${i.qty}</p><button class="remove" data-remove="${i.id}">Quitar</button></div></div>`).join(""):'<p style="color:#777">Tu carrito está vacío. ¡Encuentra algo que te encante!</p>';
 $("cartTotal").textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0));
}
function addToCart(id){const p=products.find(x=>x.id===id),item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});renderCart();toast(p.name+" se agregó al carrito")}
function setCategory(c){activeCategory=c;document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b.dataset.category===c));document.querySelectorAll(".category-check").forEach(x=>x.checked=x.value===c);renderProducts();$("productos").scrollIntoView({behavior:"smooth",block:"start"})}
buildCategoryChecks();renderProducts();renderCart();$("year").textContent=new Date().getFullYear();
$("priceRange").addEventListener("input",e=>{$("maxPriceLabel").textContent="S/ "+e.target.value;appliedMax=Number(e.target.value);renderProducts()});
$("categoryChecks").addEventListener("change",e=>{if(e.target.classList.contains("category-check")){activeCategory=e.target.checked?e.target.value:"";document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b.dataset.category===activeCategory));renderProducts()}});
$("applyFilters").addEventListener("click",()=>{onlyOffers=$("onlyOffers").checked;appliedMax=Number($("priceRange").value);renderProducts();toast("Filtros aplicados")});
$("clearFilters").addEventListener("click",()=>{activeCategory="";appliedMax=500;onlyOffers=false;$("priceRange").value=500;$("maxPriceLabel").textContent="S/ 500";$("onlyOffers").checked=false;document.querySelectorAll(".category-check").forEach(x=>x.checked=false);document.querySelectorAll(".category").forEach(b=>b.classList.remove("active"));$("searchInput").value="";$("sortSelect").value="featured";renderProducts()});
document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>setCategory(activeCategory===b.dataset.category?"":b.dataset.category)));
document.querySelectorAll("[data-jump-category]").forEach(b=>b.addEventListener("click",()=>setCategory(b.dataset.jumpCategory)));
$("productGrid").addEventListener("click",e=>{const add=e.target.closest("[data-add]"),fav=e.target.closest("[data-fav]");if(add)addToCart(Number(add.dataset.add));if(fav){const id=Number(fav.dataset.fav);favorites.has(id)?favorites.delete(id):favorites.add(id);renderProducts();toast(favorites.has(id)?"Añadido a favoritos":"Quitado de favoritos")}});
$("sortSelect").addEventListener("change",renderProducts);
$("searchForm").addEventListener("submit",e=>{e.preventDefault();renderProducts();$("productos").scrollIntoView({behavior:"smooth"})});
$("searchInput").addEventListener("input",renderProducts);
$("favoritesShortcut").addEventListener("click",()=>{if(!favorites.size){toast("Todavía no tienes favoritos");return}const ids=[...favorites];$("searchInput").value="";activeCategory="";appliedMax=500;onlyOffers=false;renderProducts();$("productGrid").innerHTML=products.filter(p=>ids.includes(p.id)).map(p=>`<article class="product"><div class="product-image"><img src="${p.img}" alt="${p.name}"></div><div class="product-info"><h3>${p.name}</h3><div class="price">${money(p.price)}</div><button class="add" data-add="${p.id}">Agregar al carrito</button></div></article>`).join("");$("productos").scrollIntoView({behavior:"smooth"})});
function openCart(){$("cartPanel").classList.add("open");$("overlay").classList.add("show")}
function closeCart(){$("cartPanel").classList.remove("open");$("overlay").classList.remove("show")}
$("openCart").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);$("overlay").addEventListener("click",closeCart);
$("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(b){cart=cart.filter(i=>i.id!==Number(b.dataset.remove));renderCart()}});
$("checkout").addEventListener("click",()=>{if(!cart.length){toast("Tu carrito está vacío");return}toast("¡Pedido de demostración! Conecta WhatsApp o una pasarela de pago para vender.");});
$("newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("¡Gracias por suscribirte! Esta es una demostración.");e.target.reset()});
$("menuToggle").addEventListener("click",()=>$("navlinks").classList.toggle("show"));
