const food_items = document.querySelector('.food-items');
const cart_items_total = document.getElementById('cart-items');
const cart = document.querySelector('.cart');


async function fooditems() {
    const jsonData = 'data.json';
    const response = await fetch(jsonData);
    const data = await response.json();

    data.forEach((element) => {
        const div = document.createElement('div');
        div.classList.add('food-item');
        food_items.appendChild(div);

        const img = document.createElement('img');
        img.src = element.image.mobile;
        img.alt = element.category;
        img.classList.add('food-img');
        div.appendChild(img);

        const p_button = document.createElement('p');
        p_button.classList.add('cart-btn');
        p_button.innerHTML = `<embed src="./assets/images/icon-add-to-cart.svg"> Add to Cart`;
        div.appendChild(p_button);

        const span = document.createElement('span');
        span.id = 'category';
        span.textContent = element.category;
        div.appendChild(span);

        const p = document.createElement('p');
        p.id = 'item-name';
        p.textContent = element.name;
        div.appendChild(p);

        const p2 = document.createElement('p');
        p2.id = 'item-price';
        p2.textContent = `$${element.price}`;
        div.appendChild(p2);

        p_button.addEventListener("click", (e) => {
          e.stopPropagation();
          cartButtonChange(p_button, img, element);
        });
        


    })
}
fooditems();


function cartButtonChange(btn, img, itemdata) {
    btn.innerHTML = `
        <p id="increment">+</p>  
        <input type="number" id="quantity" value="1" min="0" />  
        <p id="decrement">-</p>`;
    btn.classList.add('cart-btn', 'active');
    img.classList.add('food-img', 'img-border');

    const incrementButton = btn.querySelector("#increment");
    const decrementButton = btn.querySelector("#decrement");
    const quantityInput = btn.querySelector("#quantity");
    

    incrementButton.addEventListener("click", (event) => {
        event.stopPropagation();
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateCart();
        item_ToCart(itemdata, parseInt(quantityInput.value)); 
      
    });

    
    decrementButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (parseInt(quantityInput.value) > 0) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            updateCart();
            item_ToCart(itemdata, parseInt(quantityInput.value)); 
        }
    });

    item_ToCart(itemdata, parseInt(quantityInput.value)); 
    totalPrice();
}



function showOrderConfirmationPopup() {
    
    const popup = document.createElement("div");
    popup.className = "pop_up";

    const confirmedIcon = document.createElement("img");
    confirmedIcon.src = "./assets/images/icon-order-confirmed.svg";
    confirmedIcon.alt = "Order Confirmed Icon";
    popup.appendChild(confirmedIcon);

    
    const orderText = document.createElement("p");
    orderText.id = "order_text";
    orderText.textContent = "Order Confirmed";
    popup.appendChild(orderText);

    const orderTextSmall = document.createElement("p");
    orderTextSmall.id = "order_text_small";
    orderTextSmall.textContent = "We hope you enjoy your food!";
    popup.appendChild(orderTextSmall);

    const confirmedOrders = document.createElement("div");
    confirmedOrders.className = "confirmed_orders";
    
    let totalOrderPrice = 0;

    document.querySelectorAll('.cart .all_items').forEach(cartItem => {
        const itemName = cartItem.querySelector('#c_item_name').textContent;
        const imgSrc = cartItem.querySelector('#c_item_img').src;
        const itemQuantity = cartItem.querySelector('#c_item_number').textContent.replace('x', '');
        const itemPrice = parseFloat(cartItem.querySelector('#c_item_price').textContent.replace('@$', ''));
        const itemTotal = parseFloat(cartItem.querySelector('#c_item_total').textContent.replace('$', ''));

        totalOrderPrice += itemTotal;

        const order = document.createElement("div");
        order.className = "order";

        const orderImage = document.createElement("img");
        orderImage.src = imgSrc; 
        orderImage.alt = itemName;
        order.appendChild(orderImage);

        const confirmedOrderQuantity = document.createElement("div");
        confirmedOrderQuantity.className = "confirmed_order_quantity";

        const confirmedName = document.createElement("p");
        confirmedName.id = "confirmed_name";
        confirmedName.textContent = itemName;
        confirmedOrderQuantity.appendChild(confirmedName);

        const confirmedOQ = document.createElement("div");
        confirmedOQ.id = "confirmed_o_q";

        const confirmedQuantity = document.createElement("p");
        confirmedQuantity.id = "confirmed_quantity";
        confirmedQuantity.textContent = `${itemQuantity}x`;
        confirmedOQ.appendChild(confirmedQuantity);

        const confirmedPrice = document.createElement("p");
        confirmedPrice.id = "confirmed_price";
        confirmedPrice.textContent = `$${itemPrice.toFixed(2)}`;
        confirmedOQ.appendChild(confirmedPrice);

        confirmedOrderQuantity.appendChild(confirmedOQ);
        order.appendChild(confirmedOrderQuantity);

        const confirmedPTotal = document.createElement("p");
        confirmedPTotal.id = "confirmed_p_total";
        confirmedPTotal.textContent = `$${itemTotal.toFixed(2)}`;
        order.appendChild(confirmedPTotal);

        confirmedOrders.appendChild(order);
    });


    const confirmedTotal = document.createElement("div");
    confirmedTotal.id = "confirmed_total";

    const totalText = document.createElement("p");
    totalText.textContent = "Order Total";
    confirmedTotal.appendChild(totalText);

    const confirmedTotalPrice = document.createElement("p");
    confirmedTotalPrice.id = "confirmed_total_price";
    confirmedTotalPrice.textContent = `$${totalOrderPrice.toFixed(2)}`;
    confirmedTotal.appendChild(confirmedTotalPrice);

    confirmedOrders.appendChild(confirmedTotal);

    popup.appendChild(confirmedOrders);

    const newOrderBtn = document.createElement("button");
    newOrderBtn.id = "new_order_btn";
    newOrderBtn.textContent = "Start New Order";
    popup.appendChild(newOrderBtn);

    newOrderBtn.addEventListener("click", ()=>{ StartNewOrder(popup)});

    document.body.appendChild(popup);
}

function item_ToCart(item, quantity) {
    const cart = document.querySelector('.cart');
    
    
    let cartItem = Array.from(cart.querySelectorAll('.all_items')).find(cartItem => 
        cartItem.querySelector('#c_item_name').textContent === item.name
    );

    if (!cartItem) {
        cartItem = document.createElement('div');
        cartItem.classList.add('all_items');

        const itemQuantityContainer = document.createElement('div');
        itemQuantityContainer.classList.add('item_quantity');
        cartItem.appendChild(itemQuantityContainer);

        const itemName = document.createElement('div');
        itemName.id = 'c_item_name';
        itemName.textContent = item.name;
        itemQuantityContainer.appendChild(itemName);

        const img = document.createElement('img');
        img.id = 'c_item_img';
        img.src = item.image.thumbnail;
        img.style.display = 'none';
        itemQuantityContainer.appendChild(img);

        const itemDetails = document.createElement('div');
        itemDetails.id = 'item-details';
        itemQuantityContainer.appendChild(itemDetails);

        const itemQuantity = document.createElement('p');
        itemQuantity.id = 'c_item_number';
        itemDetails.appendChild(itemQuantity);

        const itemPrice = document.createElement('p');
        itemPrice.id = 'c_item_price';
        itemPrice.textContent = `@$${item.price.toFixed(2)}`;
        itemDetails.appendChild(itemPrice);

        const itemTotal = document.createElement('p');
        itemTotal.id = 'c_item_total';
        itemDetails.appendChild(itemTotal);

        const removeItem = document.createElement('div');
        removeItem.classList.add('remove_item');
        cartItem.appendChild(removeItem);

        const removeImg = document.createElement('img');
        removeImg.src = './assets/images/icon-remove-item.svg';
        removeImg.alt = 'Remove item';
        removeItem.appendChild(removeImg);

        
        removeImg.addEventListener("click", () => {
            cartItem.remove();
            updateCart(); 
            totalPrice(); 
        });

        cart.appendChild(cartItem);
    }
    const itemQuantity = cartItem.querySelector('#c_item_number');
    const itemTotal = cartItem.querySelector('#c_item_total');
    itemQuantity.textContent = `${quantity}x`;
    itemTotal.textContent = `$${(item.price * quantity).toFixed(2)}`;

    updateCart();
    totalPrice(); 

    let totalDiv = cart.querySelector('.total');
    if (!totalDiv) {
        totalDiv = document.createElement('div');
        totalDiv.classList.add('total');

        const div = document.createElement('div');
        div.classList.add('total2');
        totalDiv.appendChild(div);

        const p1 = document.createElement('p');
        p1.textContent = 'Order Total';
        div.appendChild(p1);

        const p2 = document.createElement('p');
        p2.id = 'total_price';
        div.appendChild(p2);

        const btn_div =  document.createElement('div');
        btn_div.style.width = '100%';
        totalDiv.appendChild(btn_div);

        const confirm_btn = document.createElement('button');
        confirm_btn.id = 'confirm_btn';
        confirm_btn.textContent = 'Confirm Order';
        btn_div.appendChild(confirm_btn);

       confirm_btn.addEventListener("click",()=>{  showOrderConfirmationPopup(item,quantity);} )
    }


    cart.appendChild(totalDiv);
}

function updateCart() {
    const allQuantities = document.querySelectorAll('.all_items #c_item_number');
    let totalQuantity = 0;

    allQuantities.forEach(quantity => {
        totalQuantity += parseInt(quantity.textContent) || 0;
    });

    cart_items_total.innerHTML = `Your Cart (${totalQuantity})`;

    const c_img_text = document.getElementsByClassName('c_img_text');
    let totalDiv = cart.querySelector('.total');
    if (c_img_text.length > 0) {
        if (totalQuantity === 0) {
        
            c_img_text[0].style.display = 'flex';  
            cart.removeChild(totalDiv);
        } else {
            
            c_img_text[0].style.display = 'none';
        }
    }
}

function totalPrice() {
    const itemTotals = document.querySelectorAll('#c_item_total');
    let order_total = 0;

    
    itemTotals.forEach(item => {
        order_total += parseFloat(item.textContent.replace('$', '')) || 0;
    });


    const totalDisplay = document.querySelector('#total_price');
    if (totalDisplay) {
        totalDisplay.textContent = `$${order_total.toFixed(2)}`;
    }
}

 function StartNewOrder() {
        
        
        location.reload();

        
    }

