import { useQuery } from "@tanstack/react-query";
import { Search } from "./components/Search";

const App = () => {

const getData = async (): Promise<void> => {
  const response = await fetch("https://kvdb.io/W6kwaijwKY5TGN7BB5BXuA/categories");
  const {data} = await response.json();
  return data;
}

  const { isLoading, isFetching, error } = useQuery({
    queryKey: ["items"],
    queryFn: getData
  })


  return <>
    {isLoading || isFetching && <div>Loading...</div>}
    {error && <div>Error...</div>}
    <Search />
  </>
}

export default App
