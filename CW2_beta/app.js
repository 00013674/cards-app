const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

// localhost:8000
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) =>{
    res.render('create')
})

app.post('/create', (req, res) =>{
    const title = req.body.title
    const description = req.body.description
    
    if(title.trim() === '' && description.trim() === ''){
        res.render('create', { error: true })
    } else {
        fs.readFile('./data/cards.json', (err, data) =>{
            if(err) throw err

            const cards = JSON.parse(data)

            cards.push({
                id: id (),
                title: title,
                description: description,
            })

            fs.writeFile('./data/cards.json', JSON.stringify(cards), err => {
                if(err) throw err

                res.render('create', { success: true })
            })
        })
    }

})

app.get('/cards/:id/delete', (req, res) =>{
    const id = req.params.id

    fs.readFile('./data/cards.json', (err, data) => {
        if (err) throw err

        const cards = JSON.parse(data)

        const filteredCards = cards.filter(card => card.id != id )

        fs.writeFile('./data/cards.json', JSON.stringify(filteredCards), (err) => {
            if (err) throw err

            res.render('cards', { cards: filteredCards, delete: true })
        })
    })
})

app.get('/cards/:id/registers', (req, res) =>{
    const id = req.params.id

    fs.readFile('./data/cards.json', (err, data) => {
        if (err) throw err

        const cards = JSON.parse(data)
        const card = cards.filter(card => card.id == id)[0]
        
        const cardIdx = cards.indexOf(card)
        const splicedCard = cards.splice(cardIdx, 1)[0]
        
        splicedCard.registers = true
        cards.push(splicedCard)

        fs.writeFile('./data/cards.json', JSON.stringify(cards), (err) => {
            if (err) throw err

            res.render('cards', { cards: cards })
        })
    })
        
})

app.get('/api/v1/cards', (req, res) =>{
    fs.readFile('./data/cards.json', (err, data) => {
        if (err) throw err
  
        const cards = JSON.parse(data)
  
        res.json(cards)
      })
})

app.get('/cards', (req, res) => {
    
    fs.readFile('./data/cards.json', (err, data) => {
      if (err) throw err

      const cards = JSON.parse(data)

      res.render('cards', { cards: cards })
    })
})

app.get('/cards/:id', (req, res) =>{
    const id = req.params.id

    fs.readFile('./data/cards.json', (err, data) => {
        if (err) throw err
  
        const cards = JSON.parse(data)
  
        const card = cards.filter(card => card.id == id)[0]

        res.render('detail', { card: card })
     })
})

app.listen(8000, err => {
    if (err) console.log(err)

    console.log('Server is running on port 8000...')
})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
}
