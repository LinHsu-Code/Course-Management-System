import { Message, MessageType, MessageCount } from '../lib/model'

export type MessageLocation = 'modal' | 'page'

export type MessageStore = {
  unread: MessageCount
  newMessage: Message | null
  markedIds:
    | { [key in MessageLocation]: { ids: number[]; messageType: MessageType } }
    | null
}

export type ActionType =
  | 'UNREAD_COUNT_INCREMENT'
  | 'UNREAD_COUNT_DECREMENT'
  | 'RECEIVE_NEW_MESSAGE'
  | 'MARK_AS_READ'

export type MessageAction =
  | {
      type: 'UNREAD_COUNT_INCREMENT' | 'UNREAD_COUNT_DECREMENT'
      payload: {
        count: number
        messageType: MessageType
      }
    }
  | {
      type: 'RECEIVE_NEW_MESSAGE'
      payload: {
        message: Message
      }
    }
  | {
      type: 'MARK_AS_READ'
      payload:
        | {
            modal: { ids: number[]; messageType: MessageType }
          }
        | {
            page: { ids: number[]; messageType: MessageType }
          }
    }
  | {
      type: 'RESET_MARK_AS_READ'
    }

export const store: MessageStore = {
  unread: { notification: 0, message: 0 },
  newMessage: null,
  markedIds: null,
}

export function messageReducer(state: MessageStore, action: MessageAction) {
  switch (action.type) {
    case 'UNREAD_COUNT_INCREMENT':
      return {
        ...state,
        unread: {
          ...state.unread,
          [action.payload.messageType]:
            state.unread[action.payload.messageType] + action.payload.count,
        },
      }
    case 'UNREAD_COUNT_DECREMENT':
      return {
        ...state,
        unread: {
          ...state.unread,
          [action.payload.messageType]:
            state.unread[action.payload.messageType] - action.payload.count,
        },
      }
    case 'RECEIVE_NEW_MESSAGE':
      return {
        ...state,
        newMessage: action.payload.message,
      }
    case 'MARK_AS_READ':
      return {
        ...state,
        markedIds: { ...state.markedIds, ...action.payload },
      }
    case 'RESET_MARK_AS_READ':
      return {
        ...state,
        markedIds: null,
      }
    default:
      throw new Error('No Action')
  }
}
