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

    if (itemsDiv.childNodes.length !== 0) {
       
        totalPriceDiv.style.cssText = ' background-color: white; border-radius: 10px; box-shadow: 1px 8px 4px rgb(213, 100, 106);'
        const totalPrice = arrayOfPrices.reduce((a,b) => a+b, 0)
        totalPriceDiv.innerText = 'Total price: ' + new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' , maximumSignificantDigits: 3}).format(totalPrice)

        }

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

   if (itemsDiv.childNodes.length !== 0) {
    totalPriceDiv.style.cssText = 'display: block;background-color: white; border-radius: 10px; box-shadow: 1px 8px 4px rgb(213, 100, 106);'
    }
}
    
const toggleItemStatus = async (event, id) => {
    await db.items.update(id, {isPurchased: !!event.target.checked})
    await populateItemsDiv()
}

const removeItem = async (id) => {
    await db.items.delete(id)
    await populateItemsDiv()
    if (itemsDiv.childNodes.length == 0) {
        totalPriceDiv.style.cssText = 'display: none'
    }
}

const clearAllItem = async () => {
    await db.items.clear()
    await populateItemsDiv()
    totalPriceDiv.style.cssText = 'display: none'
}

const editItem = () => {
    nameInput.focus()
}

const updateItem = async (event, id) => {
    await db.items.update(id, {name: nameInput.value, price: priceInput.value, quantity: quantityInput.value})
    await populateItemsDiv()
    itemForm.reset()

}

clearAllItemButton.addEventListener('click',clearAllItem)