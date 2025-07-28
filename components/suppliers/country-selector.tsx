// "use client";

// import React from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Countri } from "@/lib/types";



// interface CountrySelectorProps {
//     id: string;
//     open: boolean;
//     disabled?: boolean;
//     selected: Countri;
//     onToggle: () => void;
//     onChange: (country: Countri) => void;
//     options?: Countri[]; // pour personnaliser la source (COUNTRIES ou FILTER_COUNTRIES)
// }

// export const CountrySelectors: React.FC<CountrySelectorProps> = ({
//     id,
//     open,
//     disabled = false,
//     selected,
//     onToggle,
//     onChange,
//     options = [],
// }) => {
//     return (
//         <div className="relative">
//             {/* Trigger */}
//             <button
//                 id={id}
//                 onClick={onToggle}
//                 disabled={disabled}
//                 className="flex items-center justify-between w-full px-4 py-2 text-sm border rounded-md bg-background hover:bg-muted focus:outline-none"
//             >
//                 <div className="flex items-center gap-2">
//                     {selected.icon ? (
//                         selected.icon
//                     ) : (
//                         <span>{selected.emoji}</span>
//                     )}
//                     <span>{selected.title}</span>
//                 </div>
//                 <span className="ml-2">▼</span>
//             </button>

//             {/* Dropdown */}
//             <AnimatePresence>
//                 {open && (
//                     <motion.ul
//                         initial={{ opacity: 0, y: -5 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -5 }}
//                         className="absolute z-10 mt-2 w-full bg-background border rounded-md shadow-md overflow-auto max-h-[200px]"
//                     >
//                         {options.map((country) => (
//                             <li
//                                 key={country.value}
//                                 onClick={() => onChange(country)}
//                                 className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-2 text-sm"
//                             >
//                                 {country.icon ? (
//                                     country.icon
//                                 ) : (
//                                     <span>{country.emoji}</span>
//                                 )}
//                                 <span>{country.title}</span>
//                             </li>
//                         ))}
//                     </motion.ul>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };
