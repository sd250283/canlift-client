import { createStore } from 'vuex'
import parameter from './modules/admin/parameter.module'
import messageModel from './modules/admin/messageModel.module'
import user from './modules/admin/user.module'
import elevator from './modules/admin/elevator.module'
import scheduleParameter from './modules/admin/scheduleParameter.module'
import product from './modules/admin/product.module'
import productDetail from './modules/admin/productDetail.module'
import simulationConfig from './modules/simulation/config.module'
import simulation from './modules/simulation/simulation.module'
import simulationEvent from './modules/simulation/event.module'
import alerting from './modules/alerting/alerting.module'
import auth from './modules/security/auth.module'
import flashMessage from './modules/admin/flashMessage.module'
import recipient from './modules/admin/recipient.module'

export default createStore({
  modules: {
    parameter,
    scheduleParameter,
    elevator,
    product,
    productDetail,
    simulationConfig,
    simulation,
    simulationEvent,
    alerting,
    auth,
    user,
    messageModel,
    flashMessage,
    recipient
  }
})
