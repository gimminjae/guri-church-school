import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"
import util from "@/util/util"
import { v4 as uuidv4 } from "uuid"

const getUuid = () => {
  const uuid = uuidv4()
  const tokens = uuid.split("-")
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]
}

export const store = {
  async uploadImage(file: any) {
    const imageRef = ref(
      storage,
      // "images"
      `images/${util.getFormattedCurrentDate()}/${getUuid()}`
      // `images/${imageFile.name}`
    )

    return await uploadBytes(imageRef, file).then(
      async (snapshot) => await getDownloadURL(snapshot.ref).then((url) => url)
    )
  },
}
