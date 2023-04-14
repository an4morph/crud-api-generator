const resourceItems = require('./resource.js')
const { resource } = require('../settings.js')

module.exports = {
  users: [
    {
      token: 'token_bhje73bkj38jlds9',
      data: {
        username: 'admin',
        firstName: 'John',
        age: 18,
      },
      auth: {
        username: 'admin',
        password: '1234',
      }
    }
  ],
  [resource]: resourceItems.main,
  [`${resource}_expanded`]: resourceItems.expanded,
}