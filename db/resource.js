const { mainKeys, startCount, generator } = require('../settings')
const shortid = require("shortid")

const generateArr = (length, fromNum = 1) => Array(length).fill(0).map((_, index) => index + fromNum)

const expanded = generateArr(startCount).map(() => ({
  id: shortid.generate(),
  ...generator()
}))

const main = expanded.map(item => {
  let newObj = {}
  const keys = mainKeys.split(' ')
  keys.push('id')
  keys.forEach((key) => {
    newObj[key] = item[key]
  })
  return newObj
})

module.exports = {
  main,
  expanded
}