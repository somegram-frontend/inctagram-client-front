import { toast } from 'react-toastify'

export const tryCatch = async <T>(logic: () => Promise<T>): Promise<T | undefined> => {
  try {
    return await logic()
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error?.message)
    }
  }
}
