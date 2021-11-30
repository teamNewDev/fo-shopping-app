const db = new Dexie('ShoppingApp')
db.version(2).stores( {items: '++id,name,price,quantity,isPurchased'})

const itemForm = document.getElementById('itemForm')
const itemsDiv = document.getElementById('itemsDiv')
const totalPriceDiv = document.getElementById('totalPriceDiv')
const clearAllItemButton = document.getElementById('clearAllItemButton')
const nameInput = document.getElementById('nameInput')
const quantityInput = document.getElementById('quantityInput')
const priceInput = document.getElementById('priceInput')


const populateItemsDiv = async () => {
    const allItems = await db.items.reverse().toArray()

    itemsDiv.innerHTML = allItems.map(item => `
    <div class="item ${item.isPurchased && 'purchased'}">
        <label>
            <input
                type="checkbox" 
                class="checkbox" 
                onChange="toggleItemStatus(event, ${item.id})"
                ${item.isPurchased && 'checked'}
            >
        </label>

        <div class="itemInfo">
            <p>${item.name}</p>
            <p>$${item.price} * ${item.quantity}</p>
        </div>

        <div class="item_buttons__container">
            <button class="deleteButton" onclick="removeItem(${item.id})">
                X
            </button>

            <button class="editItemButton" onclick="editItem(event, ${item.id})">
                Edit item
            </button>

            <button class="updateItemButton" onclick="updateItem(event, ${item.id})">
                Update item
            </button>
        </div>

    </div>
    `).join('')

    const arrayOfPrices = allItems.map(item => item.price * item.quantity)
    const totalPrice = arrayOfPrices.reduce((a,b) => a+b, 0)

    totalPriceDiv.innerText = 'Total price: $' + totalPrice
}

window.onload = populateItemsDiv()


itemForm.onsubmit = async (event) => {
    event.preventDefault()

    const name = document.getElementById('nameInput').value
    const quantity = document.getElementById('quantityInput').value
    const price = document.getElementById('priceInput').value

    await db.items.add({name, quantity, price})
    await populateItemsDiv()

    itemForm.reset()
}

const toggleItemStatus = async (event, id) => {
    await db.items.update(id, {isPurchased: !!event.target.checked})
    await populateItemsDiv()
}

const removeItem = async (id) => {
    await db.items.delete(id)
    await populateItemsDiv()
}

const clearAllItem = async () => {
    await db.items.clear()
    await populateItemsDiv()
    console.log('deleted all')
}

const editItem = (event, id) => {
    nameInput.focus()
    console.log('new focus');
    console.log(id);
    console.log(event.target.value);
}

const updateItem = async (event, id) => {
    await db.items.update(id, {name: nameInput.value, price: priceInput.value, quantity: quantityInput.value})
    console.log('item updated');
    console.log(event.target.value);
    console.log(id);

    await populateItemsDiv()
    itemForm.reset()


}

clearAllItemButton.addEventListener('click',clearAllItem)


// const g = async (event) => {
//     console.log('submit');
//     event.preventDefault()

//     const name = document.getElementById('nameInput').value
//     const quantity = document.getElementById('quantityInput').value
//     const price = document.getElementById('priceInput').value

//     await db.items.add({name, quantity, price})
//     itemForm.reset()


// }

// itemForm.addEventListener('submit', g);

