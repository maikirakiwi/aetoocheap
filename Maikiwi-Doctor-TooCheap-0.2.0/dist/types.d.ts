export interface ItemTemplate {
    _id: string;
    _props: {
        CreditsPrice: number;
    };
}
export interface ItemCategory {
    Id: string;
    ParentId: string;
    Price: number;
}
export interface FleaItem {
    name: string;
    price: number;
}
export interface ModConfig {
    min_price: number;
    update_flea_prices: boolean;
    update_trader_prices: boolean;
}
