import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";

//Would be nice if this could search through tags as well
export const SearchBar = ({setSearchParams, setError}) => {

    const [value, setValue] = useState("");

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

    return (
        <>
            <div className="searchBar">
                <input aria-label="Search" type="text" value={value} placeholder="Start typing..." onChange={handleChange}></input>
            </div>
        </>
    )
}