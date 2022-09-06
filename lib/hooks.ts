import useSWR from 'swr'
import fetcher from './fetcher'
type UserTask = {
  taskId:string;
}

export const useTasks = () => {
  const { data, error } = useSWR('/tasks/read', fetcher)
  return {
    userTasks: (data as UserTask[]) || [],
    isLoading: !data && !error,
    isError: error,
  }
}