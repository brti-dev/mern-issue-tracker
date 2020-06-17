let continents = ['Africa','America','Asia','Australia','Europe'];

function HelloWorld() {
    return continents.map(continent => <Continent>{continent}</Continent>);
    return {helloContintents}
}

function Continent(props) {
    return <a href="/hello/{props.children}">Hello {props.children}!</a>
}

const element = (
    <>
        <h1>Hello World!</h1>
        <HelloWorld />
    </>
)

ReactDOM.render(element, document.getElementById('root'))