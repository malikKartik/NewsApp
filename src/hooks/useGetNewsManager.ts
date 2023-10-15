import { useEffect, useState } from "react"
import { api100 } from "../mock/api0-100";
import { useMMKVString } from "react-native-mmkv";
import { api200 } from "../mock/api100-200";

function getNews<T>(pageSize: number, page: number) {
  return new Promise<T[]>(resolve => {
    if (page === 1) {
      resolve(api100.articles as T[]);
    } else if (page === 2) {
      resolve(api200.articles as T[]);
    } else {
      resolve([]);
    }
  });
}

export const useGetNewsManager = () => {
    const pageSize = 100
    const [page, setPage] = useState(1)
    const [stringifiedData, setData] = useMMKVString("API_DATA_DUMP");
    const data = (stringifiedData && JSON.parse(stringifiedData)) || [];
    useEffect(() => {
        (async () => {
            if(data.length) return;
            const resp = await getNews(pageSize, page);
            setPage(page + 1)
            setData(JSON.stringify(resp));
        })()
    }, [])

    const nextPage = async () => {
        const resp = await getNews<News>(pageSize, page);
        setPage(page + 1)
        setData(JSON.stringify([...data, ...resp]));
    }



    return {
        data: data,
        nextPage,
        pinnedData: []
    }
}