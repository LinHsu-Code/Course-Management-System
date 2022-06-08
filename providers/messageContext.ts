import { createContext, Dispatch } from 'react'
import {
  MessageState,
  MessageAction,
  initialMessageState,
} from './messageReducer'

const MessageContext = createContext<{
  state: MessageState
  dispatch: Dispatch<MessageAction>
}>({
  state: initialMessageState,
  dispatch: () => undefined,
})

export default MessageContext
