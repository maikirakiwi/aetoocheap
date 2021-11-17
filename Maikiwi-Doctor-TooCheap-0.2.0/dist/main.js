"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs")
// @ts-ignore
const resolve_path = internal.path.resolve;

function fetch_flea_prices() {
    fetch('https://raw.githubusercontent.com/maikirakiwi/aetoocheap/resources/flea.json').then(response=>{
        response.json().then(data=>{
         fs.writeFileSync("../resources/flea.json", JSON.stringify(data))
        })
       })
}

function update_trader_prices(flea_prices) {
    const db = fileIO.readParsed(resolve_path('user/cache/items.json'));
    const items = db.data;
    for (const item of Object.values(items)) {
        if (flea_prices.has(item._id)) {
            item._props.CreditsPrice = flea_prices.get(item._id).price;
        }
    }
    fileIO.write(resolve_path('user/cache/items.json'), db, true);
}
function update_flea_prices(flea_prices) {
    const db = fileIO.readParsed(resolve_path('user/cache/templates.json'));
    const items = db.data.Items;
    for (const item of items) {
        if (flea_prices.has(item.Id)) {
            item.Price = flea_prices.get(item.Id).price;
        }
    }
    fileIO.write(resolve_path('user/cache/templates.json'), db, true);
}
exports.mod = (mod_info) => {
    fetch_flea_prices();
    logger.logSuccess("[AETooCheap] Synchronized Live Flea Market Prices");
    let flea_prices = new Map(Object.entries(require('../resources/flea.json')));
    const ids_blacklist = new Set(require('../resources/blacklist.json'));
    const mod_config = require("../resources/config.json");
    flea_prices = new Map([...flea_prices].filter(([key, item]) => {
        if (item.price < mod_config.min_price) {
            return false;
        }
        if (ids_blacklist.has(key)) {
            return false;
        }
        return true;
    }));
    if (mod_config.update_trader_prices) {
        update_trader_prices(flea_prices);
        logger.logSuccess("[AETooCheap] Applied new prices to Traders");
    }
    if (mod_config.update_flea_prices) {
        update_flea_prices(flea_prices);
        logger.logSuccess("[AETooCheap] Applied new prices to Flea Market");
    }
};
//# sourceMappingURL=main.js.map
