import { postModel } from "@/firebase/database"
import { useCustomQuery } from "@/hooks/useCustomQuery"

type Param = {
  userId?: string
  postId?: string
  userEmail?: string
}

type Props = {
  param?: Param
}

const usePost = ({ param }: Props = { param: undefined }) => {
  const postList = useCustomQuery<Post[], Error>({
    key: "postList",
    queryFn: () => (!param ? postModel.getPostList() : []),
  })

  const postListByUserId = useCustomQuery<Post[], Error>({
    key: param?.userId || "",
    queryFn: () =>
      param?.userId ? postModel.getPostListByUserId(param?.userId) : [],
  })

  const postListByUserEmail = useCustomQuery<Post[], Error>({
    key: param?.userEmail || "",
    queryFn: () =>
      param?.userEmail
        ? postModel.getPostListByUserEmail(param?.userEmail)
        : [],
  })

  const postDetail = useCustomQuery<Post, Error>({
    key: param?.postId || "",
    queryFn: () => (param?.postId ? postModel.getPostById(param?.postId) : []),
  })

  const deleteById = (id: string) => postModel.deletePostById(id)

  const updatePost = (post: Post) => postModel.updatePost(post)

  const writePost = (post: Post) => postModel.writePost(post)

  return {
    deleteById,
    updatePost,
    writePost,
    postList,
    postDetail,
    postListByUserId,
    postListByUserEmail,
  }
}

export default usePost
