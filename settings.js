const { faker } = require("@faker-js/faker")

const schema = {
  name: { type: "string", min: 3, max: 255 },
  author: { type: "string", min: 3, max: 50 },
  isFavorite: { type: "boolean", optional: true },
  publishYear: { type: "number", min: 1995, max: new Date().getFullYear(), optional: true },
  pagesNumber: { type: "number", min: 10, optional: true },
  original: { type: "string", optional: true },
}
const mainKeys = 'name author isFavorite'
const extraKeys = 'publishYear pagesNumber original'
const resource = 'books'

const startCount = 10

const generator = () => ({
  name: faker.music.songName(),
  author: faker.name.fullName(),
  isFavorite: Boolean(Math.round(Math.random())),
  publishYear: faker.datatype.number({ min: 1985, max: 2023 }),
  pagesNumber: faker.datatype.number({ min: 50, max: 1200 }),
  original: faker.address.country()
})

module.exports = {
  schema,
  mainKeys,
  extraKeys,
  resource,
  startCount,
  generator
}