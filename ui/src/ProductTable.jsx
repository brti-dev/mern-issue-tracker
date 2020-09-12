import React from 'react';

import graphQlFetch from './graphQlFetch.js';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

async function fetchProducts(vars = {}) {
    const query = `query productList($category: ProductCategory) {
        productList (category: $category) {
            sku
            title
            description
            category
            picture
            price
            cost
            inventory
            created
        }
    }`;

    const result = await graphQlFetch(query, vars);

    if (result) {
        console.log('fetchProducts result:', result);
        return result.productList;
    }

    return {};
}

function productsReducer(state, action) {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                data: action.payload,
            };

        case 'CREATE':
            break;

        default:
            throw new Error();
    }

    return {};
}

function cartReducer(state, action) {
    console.log('cartReducer', state, action);

    const { sku, price } = action.product;

    switch (action.type) {
        case 'ADD_ONE':
            return {
                ...state,
                totalQuantity: state.totalQuantity + 1,
                subtotal: state.subtotal + price,
                counts: {
                    ...state.counts,
                    [sku]: (state.counts[sku] || 0) + 1,
                },
            };

        case 'REMOVE_ONE':
            return {
                ...state,
                totalQuantity: state.totalQuantity - 1,
                subtotal: state.subtotal - price,
                counts: {
                    ...state.counts,
                    [sku]: (state.counts[sku] || 0) - 1,
                },
            };

        default:
            throw new Error();
    }
}

/**
 * @param {Object} vars Variables passed by parent Component `ProductList`
 */
export default function ProductTable({ vars }) {
    console.log('<ProductTable>', vars);

    /** Cart */

    const emptyCart = {
        totalQuantity: 0,
        subtotal: 0,
        counts: [],
    };
    const [cart, dispatchCart] = React.useReducer(cartReducer, emptyCart);

    const Cart = () => (
        <div id="cart">
            <strong>Shopping Cart</strong>
            <dl>
                <dt>Items</dt>
                <dd>{cart.totalQuantity}</dd>
                <dt>Total</dt>
                <dd>{currencyFormatter.format(cart.subtotal)}</dd>
            </dl>
        </div>
    );

    /** Products */

    const [products, dispatchProducts] = React.useReducer(productsReducer, { data: [] });
    console.log('State:products', products);
    React.useEffect(() => {
        fetchProducts(vars).then((result) => {
            dispatchProducts({ type: 'FETCH_SUCCESS', payload: result });
        });
    }, [vars]);

    const ProductRows = () => {
        if (vars && !products.data.length) {
            return `No products match the selection '${vars.category}'. Please widen the selection.`;
        }

        return products.data.map((product) => (
            <ProductRow key={product.sku} product={product} />
        ));
    };

    const ProductRow = ({ product }) => {
        const { sku } = product;

        const addToCart = () => {
            dispatchCart({ type: 'ADD_ONE', product });
        };

        const removeFromCart = () => {
            dispatchCart({ type: 'REMOVE_ONE', product });
        };

        const count = cart.counts[sku] || 0;

        return (
            <div className="product" key={product.sku}>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <div className="price">
                    <span>$</span>
                    {product.price}
                </div>
                <button type="button" onClick={addToCart}>
                    {`Add to Cart (${count})`}
                </button>
                {count ? <button type="button" onClick={removeFromCart}>Remove One</button> : ''}
            </div>
        );
    };

    return (
        <>
            <Cart />
            <ProductRows />
        </>
    );
}
