import { createStore } from "redux"

enum ActionTypes {
  LOADING = "LOADING",
  COMPLETE = "COMPLETE",
}

// 액션 생성자 함수 정의
interface LoadingAction {
  type: ActionTypes.LOADING
}

interface CompleteAction {
  type: ActionTypes.COMPLETE
}
type Action = LoadingAction | CompleteAction

export const loadingActions = {
  loading(): LoadingAction {
    return { type: ActionTypes.LOADING }
  },

  complete(): CompleteAction {
    return { type: ActionTypes.COMPLETE }
  },
}

interface LoadingState {
  value: Boolean
}
const loadingInitialState = { value: false }
function loadingReducer(
  state: LoadingState = loadingInitialState,
  action: Action
): LoadingState {
  switch (action.type) {
    case ActionTypes.LOADING:
      return {
        value: true,
      }
    case ActionTypes.COMPLETE:
      return {
        value: false,
      }
    default:
      return state
  }
}

export const store = createStore(loadingReducer, loadingInitialState)
