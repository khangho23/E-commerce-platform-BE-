module.exports = {
    ROUTING: {
        API: '/api',
        V1: '/v1',
        PRODUCT: '/product',
        CART: '/cart',
        DISCOUNT: '/discount',
        CHECKOUT: '/checkout',
        INVENTORY: '/inventory',
        COMMENT: '/comment',
    },
    HEADER: {
        API_KEY: 'x-api-key',
        CLIENT_ID: 'x-client-id',
        AUTHORIZATION: 'authorization',
        REFRESH_TOKEN: 'refresh-token'
    },
    DATABASE: {
        DOCUMENT_NAME: {
            API_KEY: 'ApiKey',
            CART: 'Cart',
            DISCOUNT: 'Discount',
            INVENTORY: 'Inventory',
            KEY_TOKEN: 'Key',
            ORDER: 'Order',
            PRODUCT: 'Product',
            SHOP: 'Shop',
            CLOTHING: 'Clothes',
            ELECTRONIC: 'Electronics',
            FURNITURE: 'Furnitures',
            COMMENT: 'Comment',
        },
        COLLECTION_NAME: {
            API_KEY: 'apiKeys',
            CART: 'carts',
            DISCOUNT: 'discounts',
            INVENTORY: 'inventories',
            KEY_TOKEN: 'keys',
            ORDER: 'orders',
            PRODUCT: 'products',
            SHOP: 'shops',
            CLOTHING: 'clothes',
            ELECTRONIC: 'electronics',
            FURNITURE: 'furnitures',
            COMMENT: 'comments',
        }
    },
}