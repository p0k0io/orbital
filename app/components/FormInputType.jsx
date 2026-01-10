"use client";

import { useState } from "react";

export default function FormInputType() {
  const [word, setWord] = useState(false);
  const [pdf, setPdf] = useState(false);
  const [image, setImage] = useState(false);
  const [textInput, setTextInput] = useState("");

  const handleChange = (e) => {
    const { value, checked } = e.target;

    switch (value) {
      case "Word":
        setWord(checked);
        break;
      case "PDF":
        setPdf(checked);
        break;
      case "Image":
        setImage(checked);
        break;
      default:
        break;
    }
  };

  const manageNewEp = async () => {
    

    // EJEMPLO: Si tuvieras base64 y file definidos
     const res = await fetch('/api/create', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ textInput: textInput, word: word, pdf: pdf, image: image })
    });
  };

  return (
    <div className="flex flex-col gap-2 w-3/4 bg-slate-50 p-4">
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Enter text here"
        className="border p-1 rounded w-full"
      />

      <label className="flex items-center gap-2">
        <input type="checkbox" value="Word" checked={word} onChange={handleChange} />
        Word
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" value="PDF" checked={pdf} onChange={handleChange} />
        PDF
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" value="Image" checked={image} onChange={handleChange} />
        Image
      </label>

      <button type="button" onClick={manageNewEp} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </div>
  );
}
