"use client";

import React from "react";
import useURLParams from "@/hooks/useURLParams";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

function InputSearchBox({ ...props }: React.ComponentProps<typeof Input>) {
  const { getParam, setParam } = useURLParams();
  const [searchValue, setSearchValue] = React.useState(getParam("query") || "");

  const handleSearch = useDebouncedCallback((term: string) => {
    setParam("page", "1"); // Reset to page 1 on new search
    setParam("query", term);
  }, 300);

  return (
    <>
      <Input
        placeholder={"Search"}
        onChange={(event) => {
          setSearchValue(event.target.value);
          handleSearch(event.target.value);
        }}
        value={searchValue}
        className="focus-visible:ring-ring/50 h-10 w-full focus-visible:ring-[1px] md:w-[300px]"
        type="search"
        {...props}
      />
    </>
  );
}

export default InputSearchBox;
