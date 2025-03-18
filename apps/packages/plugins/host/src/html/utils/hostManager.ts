import { storage } from "."
import { STORAGE_NAMES } from "../constants"

export const getHostGroups = async(parentId: string | null) => {
  const groups = (await storage.getData<[]>(STORAGE_NAMES.hostList)) ?? []
}

