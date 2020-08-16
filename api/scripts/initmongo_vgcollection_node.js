/**
 * initmongo_vgcollection_node.js
 * 
 * Initialize db collection `works` by:
 * - Truncating the current `works` collection
 * - Fetching data from API endpoint
 * - Populating the collection with data from API
 * - Building indexes
 * 
 * This script is intended to run on the shell, eg:
 * > node .\scripts\initmongo_vgcollection_node.js
 * 
 * @see FUKUDA, Kazufumi, "Using Wikidata as Work Authority for Video Games" https://dcpapers.dublincore.org/pubs/article/view/4245
 */

const { MongoClient } = require('mongodb')
const fetch = require('node-fetch');
const url = 'mongodb+srv://root:root91@cluster0.dsrzl.mongodb.net/vgcollection?retryWrites=true&w=majority'

const api_endpoint = 'http://vgsite/api'
const credentials = {
    "grant_type": "authorization_code",
    "client_id": 1,
    "client_secret": "foo"
}

async function testWithAsync() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

    try {
        console.log('Connecting to MongoDB...')
        await client.connect();
        console.log('Connected.')

        const db = client.db()
        const collection_works = db.collection('works')

        await collection_works.deleteMany({})

        let response = await fetch(api_endpoint + '/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        })
        let body = await response.text();
        const authorization = JSON.parse(body);
        
        let api_uri = '/games'
        let games = []
        let games_num = 0
        while (api_uri) {
            response = await fetch(api_endpoint+api_uri.replace('/api',''), {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authorization.access_token}` }
            })
            body = await response.text();
            body = JSON.parse(body)
            games = parseGamesCollection(body);
            games_num = games.length
            if (!games_num) throw new Error('No games parsed on ' + api_endpoint + api_uri)
            console.log(`Inserting ${games[0]['title']}--${games[games_num-1]['title']}`)
    
            const result = await collection_works.insertMany(games)
            console.log(`Inserted ${result.insertedCount}`)
            
            if (body.collection.links.pagination.next) {
                api_uri = body.collection.links.pagination.next.href
            } else {
                api_uri = null
            }
        }

        await collection_works.createIndex({ id: 1 }, { unique: true })
        await collection_works.createIndex({ title: 1, title_sort: 1, keywords: 1 })
        await collection_works.createIndex({ platform: 1 })
        await collection_works.createIndex({ release: 1 })

        const collection_variations = db.collection('variations')

        await collection_variations.deleteMany({})
    } catch (error) {
        console.error(error)
    } finally {
        client.close()
    }
}

testWithAsync()

function parseGamesCollection(collection) {
    return collection.collection.items.map(game => {
        delete game.type
        delete game.subcategory
        delete game.links
        delete game.href

        variation_schema = {}
        variations_example = [
            {
                version: 'regular',
                title: 'Dark Souls III',
                release: '2016-04-12',
                packages: [
                    {
                        platform: 'PlayStation 4',
                        distribution_format: 'optical disc'
                    }, {
                        platform: 'Xbox 360',
                        distribution_format: 'optical disc'
                    }, {
                        platform: 'Microsoft Windows',
                        distribution_format: 'optical disc'
                    }, {
                        platform: 'PlayStation 4',
                        distribution_format: 'digital distribution'
                    }, {
                        platform: 'Xbox 360',
                        distribution_format: 'digital distribution'
                    }, {
                        platform: 'Microsoft Windows',
                        distribution_format: 'digital distribution'
                    }
                ]
            }, {
                version: 'bonus',
                title: 'Dark Souls III',
                platform: 'Xbox 360',
            }, {
                version: 'special',
                title: 'Dark Souls III: Game of the Year Edition',
                platform: 'PC',
            }
        ]

        game.variations = []

        return game
    })
}