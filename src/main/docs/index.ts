import components from './components'
import paths from './paths'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Node API',
    description: 'API de treinamento para realizar enquetes entre programadores',
    version: '1.0.0',
    contact: {
      name: 'Jhosef Marks de Carvalho',
      email: 'jhosef@gmail.com',
      url: 'https://www.linkedin.com/in/jhosefmarks'
    },
    license: {
      name: 'MIT',
      url: 'https://raw.githubusercontent.com/jhosefmarks/training-nodejs-fordevs/main/LICENSE'
    }
  },
  servers: [{
    url: '/api',
    description: 'Servidor Principal'
  }],
  tags: [{
    name: 'Login',
    description: 'APIs relacionadas a Login'
  }, {
    name: 'Enquete',
    description: 'APIs relacionadas a Enquete'
  }],
  paths,
  schemas,
  components
}
