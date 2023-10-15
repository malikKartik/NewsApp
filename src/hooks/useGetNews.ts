import { useEffect, useRef, useState } from "react";
import { useGetNewsManager } from "./useGetNewsManager"

let timer: NodeJS.Timeout
export const useGetNews = () => {
    const {data, nextPage} = useGetNewsManager();
    const currentOffset = useRef(0);
    const [news, setNews] = useState<News[]>([]);
    const [pinnedNews, setPinnedNews] = useState<News[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const pageSize = 5;

    useEffect(() => {
        if(currentOffset.current === 0 && data.length > 0) {
            setNews(data.slice(currentOffset.current, currentOffset.current + pageSize))
            currentOffset.current  = currentOffset.current + pageSize
        }
        return () => {
            clearTimeout(timer)
        }
    }, [data.length ])

    const fetchMoreFromAPI = () => {
        if(currentOffset.current % 100 > 90 && data.length<100){
            nextPage();
        }
    }

    const deleteNews = (title: string) => {
        const temp = data.slice(currentOffset.current, currentOffset.current + 1)
        currentOffset.current = currentOffset.current + 1
        setNews(n =>{
            const filteredNews = n.filter(x => x.title !== title)
            fetchMoreFromAPI();
            return [...temp, ...filteredNews]
        })
    }

    const getMoreNews = () => {
        setIsLoading(true)
        setIsLoading(false)
        const newData = data.slice(currentOffset.current, currentOffset.current + pageSize)
        currentOffset.current  = currentOffset.current + pageSize
        setNews(n => {
            if(newData?.length !== pageSize){
                return n;
            }
            fetchMoreFromAPI();
            return [...newData, ...n]
        })
    }

    const pinNews = (title: string, newsToBePinned: News) => {
        // delete from the news
        setNews(news.filter(n => n.title !== title))
        // add to pinnedNews
        setPinnedNews([{...newsToBePinned, isPinned: true}, ...pinnedNews])
    }

    return {news, pinnedNews, pinNews, getMoreNews, deleteNews, isLoading}
}