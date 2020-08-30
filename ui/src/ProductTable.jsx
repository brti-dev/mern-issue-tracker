import React from 'react';

import graphQlFetch from './graphQlFetch.js';

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

    switch (action.type) {
        case 'ADD_ONE':
            return {
                ...state,
                totalQuantity: state.totalQuantity + 1,
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
        totalCost: 0.0,
    };
    const [cart, dispatchCart] = React.useReducer(cartReducer, emptyCart);

    const Cart = () => (
        <div id="cart">
            <strong>Shopping Cart</strong>
            <dl>
                <dt>Items</dt>
                <dd>{cart.totalQuantity}</dd>
                <dt>Total</dt>
                <dd>{cart.totalCost}</dd>
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
        const buttonRef = React.useRef(null);

        const [count, updateCount] = React.useState(0);

        const addToCart = () => {
            updateCount(count + 1);
            dispatchCart({ type: 'ADD_ONE', sku: product.sku });
        };

        return (
            <div className="product" key={product.sku}>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <div className="price">
                    <span>$</span>
                    {product.price}
                </div>
                <button ref={buttonRef} type="button" onClick={addToCart}>
                    {`Add to Cart (${count})`}
                </button>
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
