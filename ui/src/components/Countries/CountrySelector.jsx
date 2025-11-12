import React from "react";
import Select from "react-select";

const COUNTRIES = [
  "All", // ✅ Added this
  "British", "Italian", "Indian", "Chinese", "French",
  "Mexican", "Thai", "Japanese", "American", "Spanish",
  "Moroccan", "Greek", "Turkish", "Korean", "Vietnamese"
];

const options = COUNTRIES.map(c => ({ value: c, label: c }));

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#f3f4f6",
    borderColor: state.isFocused ? "#7e22ce" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px #7e22ce" : "none",
    "&:hover": { borderColor: "#7e22ce" },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#f9fafb",
    color: "#111827",
    zIndex: 50,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#7e22ce"
      : state.isFocused
      ? "#ede9fe"
      : "transparent",
    color: state.isSelected ? "white" : "#111827",
    cursor: "pointer",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#111827",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6b7280",
  }),
};

const CountrySelector = ({ selectedCountry, onChangeCountry }) => {
  const handleChange = (selectedOption) => {
    onChangeCountry(selectedOption ? selectedOption.value : "All"); // ✅ Default to All when cleared
  };

  const selectedOption = options.find(o => o.value === selectedCountry) || options[0];

  return (
    <div className="flex flex-col w-64">
      <label className="mb-1 font-semibold">Select Country</label>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isClearable
        placeholder="Search country..."
        styles={customStyles}
        classNamePrefix="select"
      />
    </div>
  );
};

export default CountrySelector;
