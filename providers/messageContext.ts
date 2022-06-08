import { createContext, Dispatch } from 'react'
import { MessageStore, MessageAction } from './messageReducer'

const MessageContext = createContext<{
  state: MessageStore
  dispatch: Dispatch<MessageAction>
}>()

export default MessageContext

// // export const MessageContext = createContext<{
// //   messageStore: MessageStore
// //   dispatch: Dispatch<MessageAction>
// // }>({})

// export const MessageProvider = ({ children }:{children: React.ReactNode}) => {
//   const [state, dispatch] = useReducer(messageReducer, store)

//   return <div>{children}</div>
//     // <MessageContext.Provider value={{ messageStore: state, dispatch }}>
//     //   {children}
//     // </MessageContext.Provider>
// }

// // export const useMsgStatistic = () =>
// //   useContext<{ msgStore: StoreState; dispatch: Dispatch<MessageAction> }>(
// //     MessageContext
// //   )
