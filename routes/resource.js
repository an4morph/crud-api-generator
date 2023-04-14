const db = require('../db')
const shortid = require('shortid')
const error = (res, status, text) => res.status(status).json(text).end()
const Validator = require("fastest-validator")
const v = new Validator()
const { schema, mainKeys, extraKeys, resource } = require('../settings.js')

const resourceExpanded = `${resource}_expanded`

const getOptionalSchema = (_schema) => {
  const newSchema = {}
  Object.keys(_schema).forEach((key) => {
    newSchema[key] = JSON.stringify(_schema[key])[0] === '{' 
      ? { ..._schema[key], optional: true } 
      : { type: _schema[key], optional: true }
  })
  return newSchema
}

const getAll = (req, res) => {
  const items = db.get(resource)
  res.send(items)
}

const getItem = (req, res) => {
  const { id } = req.params
  const item = db.get(resourceExpanded).find({ id }).value()
  if (!item) return error(res, 404, `cannot find ${resource} item with this id`)
  res.send(item)
}

const getNewItems = (body, main, extra) => {
  const newItem = {}
  main.split(' ').forEach((key) => {
    newItem[key] = body[key]
  })

  const expandedItem = { ...newItem }
  extra.split(' ').forEach((key) => {
    expandedItem[key] = body[key]
  })

  return { newItem, expandedItem }
}

const validation = (body, _schema) => {
  const invalid = Object.keys(body).filter(k => !Object.keys(_schema).includes(k))
  if (invalid.length) {
    return`${invalid.join(', ')} is not valid keys`
  }

  const errors = v.compile(_schema)(body)
  if (errors?.length) {
    return errors.map(e => e.message).join(' / ')
  }

  return null
}

const createNew = (req, res) => {
  const errorMsg = validation(req.body, schema)
  if (errorMsg) return error(res, 400, errorMsg)

  const { newItem, expandedItem } = getNewItems(req.body, mainKeys, extraKeys)

  const id = shortid.generate()
  db.get(resource).push({ id, ...newItem }).write()
  db.get(resourceExpanded).push({ id, ...newItem, ...expandedItem }).write()
  res.send({ ...newItem, ...expandedItem })
}

const updateItem = (req, res) => {
  const { id } = req.params
  const _schema = getOptionalSchema(schema)
  
  const item = db.get(resource).find({ id }).value()
  const item_expanded = db.get(resourceExpanded).find({ id }).value()
  if (!item || !item_expanded) return error(res, 404, `cannot find ${resource} item with this id`)

  const errorMsg = validation(req.body, _schema)
  if (errorMsg) return error(res, 400, errorMsg)

  const updatedItem = { ...item_expanded, ...req.body }
  const not_expanded = Object.assign({}, updatedItem)

  extraKeys.split(' ').forEach((key) => {
    delete not_expanded[key]
  })

  db.get(resource).find({ id }).assign(not_expanded).write()
  db.get(resourceExpanded).find({ id }).assign(updatedItem).write()

  res.send(updatedItem)
}

const deleteItem = (req, res) => {
  const { id } = req.params
  const item = db.get(resource).find({ id }).value()
  const item_expanded = db.get(resourceExpanded).find({ id }).value()
  if (!item || !item_expanded) return error(res, 404, `cannot find ${resource} item with this id`)

  db.get(resource).remove({ id }).write()
  db.get(resourceExpanded).remove({ id }).write()
  
  res.send({
    id: item.id,
    success: true
  })
}

module.exports = {
  getAll,
  getItem,
  createNew,
  updateItem,
  deleteItem
}