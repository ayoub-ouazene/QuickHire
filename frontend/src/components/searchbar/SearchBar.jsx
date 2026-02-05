import { useState } from 'react'
import searchlogo from "./search-svgrepo-com.svg"
import styles from './SearchBar.module.css'

function Search({ onSearch }) {
    const [query , setQuery] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch && onSearch(query);
    }

    const handleChange = (e) => {
        const v = e.target.value;
        setQuery(v);
        onSearch && onSearch(v); // live update parent query as user types
    }

    return(
        <form onSubmit={handleSubmit} className={styles.Search}>
            <div className={styles.Searchbar}>
                <img src={searchlogo} alt="searchbar" width="20" height="20" />
                <input
                    type="search"
                    onChange={handleChange}
                    value={query}
                    placeholder='Job Title Or Keyword'
                />
                <hr />
            </div>
            <p style={{paddingTop :"2vh"}}>Popular : UI Designer, UX Researcher, Android, Admin</p>
        </form>
    );
}
export default Search