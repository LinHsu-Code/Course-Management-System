import { Message, MessageType, MessageCount } from '../lib/model'

export type MessageState = {
  unread: MessageCount
  newMessage: Message | null
  markedIdsFromModal: { ids: number[]; messageType: MessageType } | null
  markedIdsFromPage: { ids: number[]; messageType: MessageType } | null
}

export enum ActionType {
  IncreaseUnreadCount,
  DecreaseUnreadCount,
  ReceiveNewMessage,
  MarkAsReadFromModal,
  MarkAsReadFromPage,
  ResetMarkAsReadFromModal,
  ResetMarkAsReadFromPage,
  ResetNewMessage,
}

interface IncreaseUnreadCount {
  type: ActionType.IncreaseUnreadCount
  payload: {
    count: number
    messageType: MessageType
  }
}

interface DecreaseUnreadCount {
  type: ActionType.DecreaseUnreadCount
  payload: {
    count: number
    messageType: MessageType
  }
}

interface ReceiveNewMessage {
  type: ActionType.ReceiveNewMessage
  payload: {
    message: Message
  }
}

interface MarkAsReadFromModal {
  type: ActionType.MarkAsReadFromModal
  payload: { ids: number[]; messageType: MessageType }
}

interface MarkAsReadFromPage {
  type: ActionType.MarkAsReadFromPage
  payload: { ids: number[]; messageType: MessageType }
}

interface ResetMarkAsReadFromModal {
  type: ActionType.ResetMarkAsReadFromModal
}

interface ResetMarkAsReadFromPage {
  type: ActionType.ResetMarkAsReadFromPage
}

interface ResetNewMessage {
  type: ActionType.ResetNewMessage
}

export type MessageAction =
  | IncreaseUnreadCount
  | DecreaseUnreadCount
  | ReceiveNewMessage
  | MarkAsReadFromModal
  | MarkAsReadFromPage
  | ResetMarkAsReadFromModal
  | ResetMarkAsReadFromPage
  | ResetNewMessage

export const initialMessageState: MessageState = {
  unread: { notification: 0, message: 0 },
  newMessage: null,
  markedIdsFromModal: null,
  markedIdsFromPage: null,
}

export function messageReducer(
  state: MessageState,
  action: MessageAction
): MessageState {
  switch (action.type) {
    case ActionType.IncreaseUnreadCount:
      return {
        ...state,
        unread: {
          ...state.unread,
          [action.payload.messageType]:
            state.unread[action.payload.messageType] + action.payload.count,
        },
      }
    case ActionType.DecreaseUnreadCount:
      return {
        ...state,
        unread: {
          ...state.unread,
          [action.payload.messageType]:
            state.unread[action.payload.messageType] - action.payload.count,
        },
      }
    case ActionType.ReceiveNewMessage:
      return {
        ...state,
        newMessage: action.payload.message,
      }
    case ActionType.MarkAsReadFromModal:
      return {
        ...state,
        markedIdsFromModal: action.payload,
      }
    case ActionType.MarkAsReadFromPage:
      return {
        ...state,
        markedIdsFromPage: action.payload,
      }
    case ActionType.ResetMarkAsReadFromModal:
      return {
        ...state,
        markedIdsFromModal: null,
      }
    case ActionType.ResetMarkAsReadFromPage:
      return {
        ...state,
        markedIdsFromPage: null,
      }
    case ActionType.ResetNewMessage:
      return {
        ...state,
        newMessage: null,
      }
    default:
      throw new Error('No Action')
  }
}
