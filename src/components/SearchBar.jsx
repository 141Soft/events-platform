import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { getTags } from "../api";

//Would be nice if this could search through tags as well
export const SearchBar = ({setSearchParams, setError}) => {

    const [value, setValue] = useState("");
    const [searchTags, setSearchTags] = useState([]);

    useEffect(() => {
        const loadTags = async () => {
          try {
            const data = await getTags();
            setSearchTags(data.tags);
          } catch (err) {
            console.error(err);
          }
        }
        loadTags();
      }, []);

    //memoize and debounce to reduce api calls
    const debounceSearch = useCallback(
        debounce((search) => {
            setSearchParams(prev => ({
                ...prev,
                name: search
            }))
        }, 300),
        []
    )
    
    const handleChange = (e) => {
        setValue(e.target.value);
        debounceSearch(e.target.value);
    }

    const handleClick = (e) => {
        e.preventDefault();
        setSearchParams(prev => ({
            ...prev,
            tag: e.target.value
        }))
    }

    return (
        <>
            <div className="searchBar">
                <input aria-label="Enter Search" type="text" value={value} placeholder="Start typing..." onChange={handleChange}></input>
                <ul className="tags-list">
                    {searchTags.map((tag) => 
                        <li key={tag}>
                            <button value={tag} onClick={handleClick}>
                                {tag}
                            </button>
                        </li>
                        )}
                </ul>
            </div>
        </>
    )
}