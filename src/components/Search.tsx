import { useEffect, useState } from "react";
import { SearchIcon } from "../assets/SearchIcon";
import { useGetFetchQuery } from "../useGetFetchQuery";
import { VList } from "virtua";
import { decode } from "html-entities";

export const Search = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const storedCategories = localStorage.getItem('selectedCategories');
        if (storedCategories) {
            setCategories(JSON.parse(storedCategories));
        }
    }, []);

    const data = useGetFetchQuery("items");

    const handleCategoryClick = (category: string) => {
        const isSelected = categories.includes(category);
        if (isSelected) {
            setCategories((prevSelected) =>
                prevSelected.filter((item) => item !== category)
            );
        } else {
            setCategories((prevSelected) => [...prevSelected, category]);
        }
    };

    useEffect(() => {
        localStorage.setItem('selectedCategories', JSON.stringify(categories));
    }, [categories]);

    let sortedCategories: string[] | undefined;

      if (Array.isArray(data)) {
        sortedCategories = [...data].sort((a, b) => {

            const aIsSelected = categories.includes(a);
            const bIsSelected = categories.includes(b);

            if (aIsSelected && !bIsSelected) {
                return -1;
            } else if (!aIsSelected && bIsSelected) {
                return 1;
            }

            const aStartsWithSearch = a.toLowerCase().startsWith(searchText.toLowerCase());
            const bStartsWithSearch = b.toLowerCase().startsWith(searchText.toLowerCase());

            if (aStartsWithSearch && !bStartsWithSearch) {
                return -1;
            } else if (!aStartsWithSearch && bStartsWithSearch) {
                return 1;
            } else {
                return 0;
            }

        });
    }

    return <>
        <div className="container">
            <h2>Kategoriler</h2>
            <div className="search">
                <span className="icon"> <SearchIcon /></span>
                <input type="text" placeholder="kategori ara..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <ul>
                <VList className="categories" style={{ height: 300 }}>
                    {
                        Array.isArray(data) && data.length === 0 &&
                        <li>Kategori bulunamadı</li>
                    }
                    {Array.isArray(sortedCategories) &&
                        sortedCategories.map((category: string, index: number) => {
                            return (
                                <li key={index}
                                    onClick={() => handleCategoryClick(category)}>
                                    <input
                                        type="checkbox"
                                        value={category}
                                        checked={categories.includes(category)}
                                        readOnly
                                    />
                                    <p>{decode(category)}</p>
                                </li>
                            )
                        })}
                </VList>
            </ul>
            <button className="btn">Ara</button>
        </div>
    </>
}
