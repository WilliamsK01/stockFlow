"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Countri } from "../../lib/types";
import { COUNTRIES } from "@/components/utils/countries";

export interface CountrySelectorProps {
    id: string;
    open: boolean;
    disabled?: boolean;
    onToggle: () => void;
    selected: Countri;
    onChange: (country: Countri) => void;
    options?: Countri[];
}

export function CountrySelector({
    id,
    open,
    disabled = false,
    onToggle,
    selected,
    onChange,
    options = COUNTRIES,
}: CountrySelectorProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node) && open) {
                onToggle();
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onToggle]);

    const filteredCountries = options.filter((country) =>
        country.title.toLowerCase().startsWith(query.toLowerCase())
    );

    return (
        <div ref={ref} className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                id={`${id}-button`}
                className={`${disabled
                    ? "bg-white dark:bg-slate-900"
                    : "bg-white dark:bg-slate-800"
                    } relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby={`${id}-button`}
                onClick={onToggle}
                disabled={disabled}
            >
                <span className="truncate flex items-center gap-2">
                    {selected.icon ? (
                        selected.icon
                    ) : (
                        <Image
                            alt={selected.value}
                            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selected.value}.svg`}
                            width={20}
                            height={14}
                            className="rounded-sm"
                        />
                    )}
                    <span>{selected.title}</span>
                </span>
                {!disabled && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                )}
            </button>

            {/* Dropdown List */}
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-900 shadow-lg max-h-80 rounded-md text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                        tabIndex={-1}
                        role="listbox"
                        aria-labelledby={`${id}-button`}
                    >
                        {/* Search */}
                        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-3 py-2">
                            <input
                                type="search"
                                name="search"
                                autoComplete="off"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-none bg-transparent"
                                placeholder="Search a country"
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                            <hr className="my-2" />
                        </div>

                        {/* List */}
                        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-slate-600">
                            {filteredCountries.length === 0 ? (
                                <li className="text-gray-900 dark:text-white cursor-default select-none relative py-2 px-3">
                                    No countries found
                                </li>
                            ) : (
                                filteredCountries.map((country, idx) => (
                                    <li
                                        key={`${id}-${country.value}`}
                                        id={`listbox-option-${idx}`}
                                        role="option"
                                        aria-selected={country.value === selected.value}
                                        className={`flex items-center px-3 py-2 cursor-pointer select-none relative hover:bg-muted transition ${country.value === selected.value ? "bg-slate-100 dark:bg-slate-700" : ""
                                            }`}
                                        onClick={() => {
                                            onChange(country);
                                            setQuery("");
                                            onToggle();
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {country.icon ? (
                                                country.icon
                                            ) : (
                                                <Image
                                                    alt={country.value}
                                                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.value}.svg`}
                                                    width={24}
                                                    height={16}
                                                    className="rounded-sm"
                                                />
                                            )}
                                            <span className="truncate">{country.title}</span>
                                        </div>

                                        {country.value === selected.value && (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <svg
                                                    className="h-5 w-5 text-blue-600"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </span>
                                        )}
                                    </li>
                                ))
                            )}
                        </div>
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}
