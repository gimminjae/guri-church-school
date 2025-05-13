import util from "@/util/util"
import { db } from "./firebase"
import {
  ref,
  set,
  get,
  child,
  update,
  remove,
  orderByChild,
  query,
  equalTo,
} from "firebase/database"
import { loadingActions, store } from "@/store//LoadingState"

export const todoPrayModel = {
  async writeTodoPray(todoPray: TodoPray) {
    const id = util.getUuid()
    const now = new Date()
    const nowStr = util.getFormattedDateTime(now)
    const nowStamp = util.getDateTimeStamp(now)
    const savedTodoPray = {
      ...todoPray,
      id: id,
      createdAt: nowStr,
      updatedAt: nowStr,
      createdAtTimeStamp: nowStamp,
      // 인도자
      leader: todoPray.leader,
      // 전도대상자
      targetPerson: todoPray.targetPerson,
      // 분반교사명
      teacherName: todoPray.teacherName,
      // 관계
      relationship: todoPray.relationship,
      // 내용
      content: todoPray.content,
      // 상반기 전도집회 출석
      firstHalfAttendance: todoPray.firstHalfAttendance,
      // 학부모명
      parentName: todoPray.parentName,
      // 전도구역
      evangelismArea: todoPray.evangelismArea,
      // 권유횟수
      invitationCount: todoPray.invitationCount,
      // 식사횟수
      mealCount: todoPray.mealCount,
      // 확답여부
      isConfirmed: todoPray.isConfirmed,
    }
    set(ref(db, `todoPrays/${id}`), savedTodoPray)

    return savedTodoPray
  },

  async getTodoPrayListByPage(page: number, size: number, userId?: string) {
    store.dispatch(loadingActions.loading())
    try {
      let snapshot
      if (userId) {
        snapshot = await get(
          query(ref(db, "todoPrays"), orderByChild("userId"), equalTo(userId))
        )
      } else {
        snapshot = await get(ref(db, "todoPrays"))
      }

      const result = snapshot?.val()
      if (!result) return []

      const allTodoPrays = Object.values(result)
      const sortedTodoPrays = allTodoPrays.sort(
        (a: any, b: any) => b.createdAtTimeStamp - a.createdAtTimeStamp
      )

      const startIndex = (page - 1) * size
      const endIndex = startIndex + size
      return sortedTodoPrays.slice(startIndex, endIndex)
    } catch (error) {
      console.log(error)
      return []
    } finally {
      store.dispatch(loadingActions.complete())
    }
  },

  async getTodoPrayListByUserEmail(email: string) {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "todoPrays"), orderByChild("userEmail"), equalTo(email))
      )
      const result = snapshot?.val()
      return (result ? Object.values(result) : []).sort((a: any, b: any) =>
        a.createdAt > b.createdAt ? -1 : 1
      )
    } catch (error) {
      console.log(error)
      return []
    } finally {
      store.dispatch(loadingActions.complete())
    }
  },

  async getTodoPrayById(id: string) {
    store.dispatch(loadingActions.loading())
    const result = await get(child(ref(db), `todoPrays/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          console.log("No data available")
        }
      })
      .catch((error) => {
        console.error(error)
      })
    store.dispatch(loadingActions.complete())
    return result
  },

  async getTodoPrayListByUserId(userId: string) {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "todoPrays"), orderByChild("userId"), equalTo(userId))
      )
      const result = snapshot?.val()
      return result ? Object.values(result) : []
    } catch (error) {
      console.log(error)
      return []
    } finally {
      store.dispatch(loadingActions.complete())
    }
  },

  async getTodoPrayList() {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "todoPrays"), orderByChild("createdAtTimeStamp"))
      )
      return snapshot.exists() ? Object.values(snapshot.val()) : []
    } catch (error) {
      console.log(error)
    } finally {
      store.dispatch(loadingActions.complete())
    }
  },

  async updateTodoPray(todoPray: TodoPray) {
    try {
      return await update(ref(db, `/todoPrays/${todoPray.id}`), {
        ...todoPray,
        updatedAt: util.getFormattedCurrentDateTime(),
      })
    } catch (error) {
      console.log(error)
    }
  },

  async deleteTodoPrayById(todoPrayId: string) {
    try {
      return await remove(ref(db, `/todoPrays/${todoPrayId}`))
    } catch (error) {
      console.log(error)
    }
  },

  async increaseInvitationCount(id: string) {
    try {
      const todoPray = await this.getTodoPrayById(id)
      if (!todoPray) return

      return await update(ref(db, `/todoPrays/${id}`), {
        ...todoPray,
        invitationCount: (todoPray.invitationCount || 0) + 1,
        updatedAt: util.getFormattedCurrentDateTime(),
      })
    } catch (error) {
      console.log(error)
    }
  },

  async increaseMealCount(id: string) {
    try {
      const todoPray = await this.getTodoPrayById(id)
      if (!todoPray) return

      return await update(ref(db, `/todoPrays/${id}`), {
        ...todoPray,
        mealCount: (todoPray.mealCount || 0) + 1,
        updatedAt: util.getFormattedCurrentDateTime(),
      })
    } catch (error) {
      console.log(error)
    }
  },

  async toggleConfirmed(id: string) {
    try {
      const todoPray = await this.getTodoPrayById(id)
      if (!todoPray) return

      return await update(ref(db, `/todoPrays/${id}`), {
        ...todoPray,
        isConfirmed: !todoPray.isConfirmed,
        updatedAt: util.getFormattedCurrentDateTime(),
      })
    } catch (error) {
      console.log(error)
    }
  },

}
