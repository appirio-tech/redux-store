import { combineReducers } from 'redux'

import entities from './entities'
import form from './form'
import stepsByProject from './stepsByProject'
import user from './user'

const rootReducer = combineReducers({
  entities,
  stepsByProject,
  user,
  form
})

export default rootReducer
