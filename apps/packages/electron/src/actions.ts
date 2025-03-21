import Action from '@gy-tools/common/Action'
import { appActions } from './app'
import { winMainActions } from './renderer/winMain'

const ACTIONS = {
  app: appActions,
  winMain: winMainActions,
} as const


type Actions = FlattenObject<typeof ACTIONS>


const actionsRaw = new Action() as ActionType

for (const [mod, modActions] of Object.entries(ACTIONS)) {
  for (const [action, handle] of Object.entries(modActions)) {
    actionsRaw.register(`${mod}.${action}`, handle)
  }
}


declare class ActionType extends Action {
  exec<K extends keyof Actions>(action: K, ...args: Parameters<Actions[K]>): ReturnType<Actions[K]>
}

export const actions = actionsRaw as Omit<ActionType, 'register'>

