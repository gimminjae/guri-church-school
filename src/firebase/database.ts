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

export const postModel = {
  async writePost(post: Post) {
    const id = util.getUuid()
    const now = new Date()
    const nowStr = util.getFormattedDateTime(now)
    const nowStamp = util.getDateTimeStamp(now)
    const savedPost = {
      ...post,
      id: id,
      createdAt: nowStr,
      updatedAt: nowStr,
      createdAtTimeStamp: nowStamp,
    }
    set(ref(db, `posts/${id}`), savedPost)

    return savedPost
  },
  async getPostListByPage(page: number, size: number, userId?: string) {
    store.dispatch(loadingActions.loading())
    try {
      let snapshot
      if (userId) {
        snapshot = await get(
          query(ref(db, "posts"), orderByChild("userId"), equalTo(userId))
        )
      } else {
        snapshot = await get(ref(db, "posts"))
      }

      const result = snapshot?.val()
      if (!result) return []

      const allPosts = Object.values(result)
      // Sort by createdAtTimeStamp in descending order
      const sortedPosts = allPosts.sort(
        (a: any, b: any) => b.createdAtTimeStamp - a.createdAtTimeStamp
      )

      const startIndex = (page - 1) * size
      const endIndex = startIndex + size
      return sortedPosts.slice(startIndex, endIndex)
    } catch (error) {
      console.log(error)
      return []
    } finally {
      store.dispatch(loadingActions.complete())
    }
  },

  async getPostListByUserEmail(email: string) {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "posts"), orderByChild("userEmail"), equalTo(email))
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

  async getPostById(id: string) {
    store.dispatch(loadingActions.loading())
    const result = await get(child(ref(db), `posts/${id}`))
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

  async getPostListByUserId(userId: string) {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "posts"), orderByChild("userId"), equalTo(userId))
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

  async getPostList() {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "posts"), orderByChild("createdAtTimeStamp"))
      )
      return snapshot.exists() ? Object.values(snapshot.val()) : []
    } catch (error) {
      console.log(error)
    } finally {
      store.dispatch(loadingActions.complete())
    }
  },

  async updatePost(post: Post) {
    try {
      return await update(ref(db, `/posts/${post.id}`), {
        ...post,
        updatedAt: util.getFormattedCurrentDateTime(),
      })
    } catch (error) {
      console.log(error)
    }
  },
  async deletePostById(postId: string) {
    try {
      return await remove(ref(db, `/posts/${postId}`))
    } catch (error) {
      console.log(error)
    }
  },
}
