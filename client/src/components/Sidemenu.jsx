import { useSearchParams } from "react-router-dom";
import Search from "./Search";

const Sidemenu = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const searchTerm = searchParams.get("cat");

    const handleFilterChange = (e) => {

        if (searchParams.get("sort") !== e.target.value) {
            setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value });
        };
    }

    const handleCategoryChange = (cat) => {
        if (searchParams.get("cat") !== cat) {
            setSearchParams({ ...Object.fromEntries(searchParams), cat });
        };
    };

    return (
        <div className="px-4 h-max sticky top-8">
            <h1 className="mb-3 text-sm font-medium">Search</h1>
            <Search />
            <h1 className="mt-6 mb-3 text-sm font-medium">Filter</h1>

            <div className="flex flex-col gap-2 text-sm">
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="sort"
                        value="newest"
                        className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800 bg-white"
                        onChange={handleFilterChange}
                    />
                    Newest
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="sort"
                        value="popular"
                        className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800 bg-white"
                        onChange={handleFilterChange}
                    />
                    Most Popular
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="sort"
                        value="trending"
                        className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800 bg-white"
                        onChange={handleFilterChange}
                    />
                    Trending
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="sort"
                        value="oldest"
                        className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800 bg-white"
                        onChange={handleFilterChange}
                    />
                    Oldest
                </label>
            </div>

            <h1 className="mt-6 mb-3 text-sm font-medium">Categories</h1>

            <div className="flex flex-col gap-2 text-sm">
                <span
                    onClick={() => handleCategoryChange("general")}
                    className="underline cursor-pointer"
                >
                    All
                </span>
                <span
                    onClick={() => handleCategoryChange("web-design")}
                    className={`underline cursor-pointer ${searchTerm === "web-design" ? "text-red-500 font-bold" : ""}`}
                >
                    Web Design
                </span>
                <span
                    onClick={() => handleCategoryChange("development")}
                    className={`underline cursor-pointer ${searchTerm === "development" ? "text-red-500 font-bold" : ""}`}
                >
                    Developments
                </span>
                <span
                    onClick={() => handleCategoryChange("databases")}
                    className={`underline cursor-pointer ${searchTerm === "databases" ? "text-red-500 font-bold" : ""}`}
                >
                    Databases
                </span>
                <span
                    onClick={() => handleCategoryChange("seo")}
                    className={`underline cursor-pointer ${searchTerm === "seo" ? "text-red-500 font-bold" : ""}`}
                >
                    Search Engines
                </span>
                <span
                    onClick={() => handleCategoryChange("marketing")}
                    className={`underline cursor-pointer ${searchTerm === "marketing" ? "text-red-500 font-bold" : ""}`}
                >
                    Marketing
                </span>
                <span
                    onClick={() => handleCategoryChange("automotive")}
                    className={`underline cursor-pointer ${searchTerm === "automotive" ? "text-red-500 font-bold" : ""}`}
                >
                    Automotive
                </span>
                <span
                    onClick={() => handleCategoryChange("mma")}
                    className={`underline cursor-pointer ${searchTerm === "mma" ? "text-red-500 font-bold" : ""}`}
                >
                    MMA
                </span>
                <span
                    onClick={() => handleCategoryChange("football")}
                    className={`underline cursor-pointer ${searchTerm === "football" ? "text-red-500 font-bold" : ""}`}
                >
                    Football
                </span>
            </div>
        </div>
    );
};

export default Sidemenu;