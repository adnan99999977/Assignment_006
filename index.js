const categoriesContainer = document.getElementById("categories_container");
const allPlantsContainer = document.getElementById("all_plants_container");
const myModalContainer = document.getElementById("my_modal");
const modalInfoContainer = document.getElementById("modal_info_container");
const cartsContainer = document.getElementById("carts_container");
const loadingDiv = document.getElementById('loading_div')


// all  categories load & display
const categoriesLoad = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};
const displayCategories = (categoriesList) => {
  categoriesContainer.innerHTML = "";
    const allTreesDiv = document.createElement("p");
  allTreesDiv.className =
    "categories_div cursor-pointer rounded-sm p-2 mb-2 text-[rgba(31,41,55,1)] text-[16px]";
  allTreesDiv.innerText = "All Trees";
  allTreesDiv.onclick = () => allPlantsLoad();
  categoriesContainer.appendChild(allTreesDiv);


  categoriesList.forEach((category) => {
    const createNewCategoryList = document.createElement("div");
    createNewCategoryList.innerHTML = `
       <div class = " cursor-pointer ">
       <p  onclick="categoryBtn(${category.id})"  class=" categories_div rounded-sm p-2 text-[rgba(31,41,55,1)] text-[16px] ">${category.category_name}</p></div>`;
    categoriesContainer.appendChild(createNewCategoryList);
  });
};
categoriesLoad();




// load plants by categories
const categoryBtn = (id) => {
  loadingDiv.classList.remove("hidden");
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      displayPlantsByCatagory(data.plants);
    })
    .catch((err) => {
      console.error("Error:", err);
    })
    .finally(() => {
      loadingDiv.classList.add("hidden");
    });
};

// display plants by categories
const displayPlantsByCatagory = (plants) => {
  allPlantsContainer.innerHTML = "";
  plants.forEach((plant) => {
    const createCardByCategory = document.createElement("div");
    createCardByCategory.innerHTML = `
      <div class="plant_card lg:w-60  bg-white rounded-lg p-5 lg:p-3 space-y-2 shadow-md cursor-pointer">
              <img class="rounded-md w-full h-[170px]
             lg:w-[210px] lg:h-[210px] object-cover
             " src="${plant.image}" alt="">
             <button class="plant_name font-bold cursor-pointer text-left hover:text-green-800 " onclick="showModal(${plant.id})">${plant.name}</button>
           <div class = "h-[87px] overflow-hidden">
             <p class="text-[12px]">${plant.description}</p></div>
             <div class="price flex justify-between items-center">
                <p class="p-2 font-bold text-[12px] bg-[rgba(220,252,231,1)] rounded-4xl text-[rgba(21,128,61,1)] ">${plant.category}</p>
                <p class="plant_price font-bold">৳${plant.price}</p>
             </div>
             <button  class=" add_to_cart_btn cursor-pointer bg-[rgba(21,128,61,1)] rounded-3xl w-full text-white p-2 lg:p-1 mt-2" >Add to Cart</button>
          </div>
      `;
     
    allPlantsContainer.appendChild(createCardByCategory);
  });
};

// category toggle bg

categoriesContainer.addEventListener("click", (e) => {
  const clickedEl = e.target.closest(".categories_div");
  if (!clickedEl) return;

  const oldList = document.querySelectorAll(".categories_div.active_category");
  oldList.forEach((old) => old.classList.remove("active_category"));
  clickedEl.classList.add("active_category");
  
   
});

// all plants load & display
const allPlantsLoad = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => allPlantsDisplay(data.plants));
};
const allPlantsDisplay = (allPlants) => {
  allPlantsContainer.innerHTML = "";

  allPlants.forEach((plant) => {
    const createPlantsCard = document.createElement("div");
    createPlantsCard.innerHTML = ` <div class="plant_card lg:w-60  bg-white rounded-lg p-5 lg:p-3 space-y-2 shadow-md cursor-pointer">
              <img class="rounded-md w-full h-[170px]
             lg:w-[210px] lg:h-[210px] object-cover
             " src="${plant.image}" alt="">
             <button class="plant_name font-bold cursor-pointer text-left hover:text-green-800 " onclick="showModal(${plant.id})">${plant.name}</button>
            <div class="h-[87px] overflow-hidden">
             <p class="text-[12px] ">${plant.description}</p></div>
             <div class="price flex justify-between items-center">
                <p class="p-2 font-bold text-[12px] bg-[rgba(220,252,231,1)] rounded-4xl text-[rgba(21,128,61,1)] ">${plant.category}</p>
                <p class="plant_price font-bold">৳${plant.price}</p>
             </div>
             <button  class=" add_to_cart_btn cursor-pointer bg-[rgba(21,128,61,1)] rounded-3xl w-full text-white p-2 lg:p-1 mt-2 hover:bg-[rgba(29,181,61,1)] duration-200" >Add to Cart</button>
          </div>
    `;
    allPlantsContainer.appendChild(createPlantsCard);
  });
};


// show modal
const showModal = (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayTreesDetails(data.plants);
      myModalContainer.showModal();
    });
};
const displayTreesDetails = (plant) => {
  modalInfoContainer.innerHTML = "";
  const createInfoModal = document.createElement("div");
  createInfoModal.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${plant.name}</h2>
    <img class="rounded-lg w-full h-[300px] object-cover  mb-3" src="${plant.image}" alt="${plant.name}">
    <p><span class="font-bold">Category:</span> ${plant.category}</p>
    <p><span class="font-bold">Price:</span> ৳${plant.price}</p>
    <p class="mt-2 text-sm text-gray-600"><span class="font-bold">Description:</span>${plant.description}</p>
  `;
  modalInfoContainer.appendChild(createInfoModal);
};

// add to cart 

allPlantsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add_to_cart_btn")) {
    const card = e.target.closest(".plant_card");

    const name = card.querySelector(".plant_name").innerText;
    const price = card.querySelector(".plant_price").innerText;
    addToCartBtn({ name, price });
   
  }
});

// cart and delete btn 
const addToCartBtn = (info) => {
  const createNewCart = document.createElement("div");
  createNewCart.innerHTML = `
         <div  class="cart_card p-4 lg:p-2 rounded-sm  flex justify-between items-center mb-4 w-[200px] m-auto bg-[rgba(240,253,244,1)] text-[#474646]">
               <div class="info">
                <p class="font-bold">${info.name}</p>
                <p>${info.price} x 1</p>
               </div>
               <div class="cross_icon">
                <button  class="cross-btn cursor-pointer hover:scale-105 hover:text-red-600">
                     <i  class="fa-solid fa-xmark"></i>
                </button>
               </div>
              `;
  cartsContainer.appendChild(createNewCart);
  
    const crossBtn = createNewCart.querySelector(".cross-btn");
    crossBtn.addEventListener('click',()=>{
       createNewCart.remove();
    })
  
};



// all trees category 

const allTreesCategory =('click',()=>{
   allPlantsLoad();
})


allPlantsLoad();