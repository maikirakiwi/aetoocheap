"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require('https');
var fs = require("fs")
// @ts-ignore
const resolve_path = internal.path.resolve;
const mod_config = require("../resources/config.json");
const ids_blacklist = new Set(require('../resources/blacklist.json'));
const time_interval = mod_config.update_interval_minutes * 60000;

function fetch_flea_prices(mod_info) {
    let folder = `user/mods/${mod_info.author}-${mod_info.name}-${mod_info.version}`;
    https.get("https://raw.githubusercontent.com/maikirakiwi/aetoocheap/main/Maikiwi-Doctor-TooCheap-0.2.0/resources/flea.json",(res) => {
    const filePath = fs.createWriteStream(resolve_path(`${folder}/resources/flea.json`));
    res.pipe(filePath);
    filePath.on('finish',() => {
        filePath.close();
        logger.logSuccess("[MOD] -- MaikiwiTooCheap: Downloaded Live Flea Market Prices");
    })
    })  
}
/*
function update_trader_prices(flea_prices) {
    let traderPrice = fileIO.readParsed(internal.path.resolve('user/cache/items.json'));
    for (let item of Object.values(traderPrice.data)) {
            if (flea_prices.has(item._id)) {
                item._props.CreditsPrice = flea_prices.get(item._id).price;
            }
        }
    fileIO.write(internal.path.resolve('user/cache/items.json'), traderPrice, true, false);
    }
    */
function update_flea_prices(flea_prices) {
    //const db = fileIO.readParsed(resolve_path('user/cache/templates.json'));
    const db = fileIO.readParsed(resolve_path('db/templates/items.json'))
    //const items = db.data.Items;
    const items = db;
    for (const item of items) {
        if (flea_prices.has(item.Id)) {
            item.Price = Math.round(flea_prices.get(item.Id).price * 0.5);
        }
    }
    fileIO.write(resolve_path('db/templates/items.json'), db, true);
}
exports.mod = (mod_info) => {
    logger.logSuccess("[MOD] -- MaikiwiTooCheap: Initialized Flea Market Synchronization (" + mod_config.update_interval_minutes + " minutes)");
    
    fetch_flea_prices(mod_info);
    setTimeout(function loop_init() {
        let flea_prices = new Map(Object.entries(require('../resources/flea.json')));
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
        //update_trader_prices(flea_prices);
        if (mod_config.show_debug_messages) {
            //logger.logSuccess("[MOD] -- MaikiwiTooCheap: Initialized new prices to Traders");
            logger.logInfo("[MOD] -- MaikiwiTooCheap: Unable to update Trader Prices because this version of TooCheap does not support this feature.");
        }
    }
    if (mod_config.update_flea_prices) {
        update_flea_prices(flea_prices);
        if (mod_config.show_debug_messages) {
            logger.logSuccess("[MOD] -- MaikiwiTooCheap: Initialized new prices to Flea Market");
        }        
    }}, 2000);
    
    setInterval(function(){
        fetch_flea_prices(mod_info);
    }, time_interval)   

    let loop_timer = setTimeout(function loop_main() {
        let flea_prices = new Map(Object.entries(require('../resources/flea.json')));
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
            //update_trader_prices(flea_prices);
            if (mod_config.show_debug_messages) {
               //logger.logSuccess("[MOD] -- MaikiwiTooCheap: Updated new prices to Traders (" + mod_config.update_interval_minutes + " minutes)");
               logger.logInfo("[MOD] -- MaikiwiTooCheap: Unable to update Trader Prices because this version of TooCheap does not support this feature.");
            }
        }
        if (mod_config.update_flea_prices) {
            update_flea_prices(flea_prices);
            if (mod_config.show_debug_messages) {
                logger.logSuccess("[MOD] -- MaikiwiTooCheap: Updated new prices to Flea Market (" + mod_config.update_interval_minutes + " minutes)");
            }        
        }
        loop_timer = setTimeout(loop_main, time_interval+2000);
    }, time_interval+2000)
    
};
//# sourceMappingURL=main.js.map
