import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function TagsInput() {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  const input = useRef();
  const tagInputRef = useRef();

  // Tag input handler
  const tagInputHandler = ({ target }) => {
    const { value } = target;

    if (value !== ",") setTag(value);
  };

  // Key down handler for removing tag
  const keyDownHandler = ({ key }) => {
    if (key === "," || key === "Enter") {
      if (!tag) return;
      if (tags.includes(tag)) return setTag("");

      setTags([...tags, tag]);
      setTag("");
    }

    if (key == "Backspace" && !tag && tags.length) {
      const newTags = tags.filter((_, index) => index !== tags.length - 1);
      setTags([...newTags]);
    }
  };

  // Removing tag on click X
  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags([...newTags]);
  };

  // Foucus handler
  const onFocusHandler = () => {
    tagInputRef.current.classList.remove("dark:border-dark-subtle", "border-light-subtle");
    tagInputRef.current.classList.add("dark:border-white", "border-primary");
  };

  // Blur handler
  const onBlurHandler = () => {
    tagInputRef.current.classList.add("dark:border-dark-subtle", "border-light-subtle");
    tagInputRef.current.classList.remove("dark:border-white", "border-primary");
  };

  //UseEffect Hook
  useEffect(() => {
    input.current.scrollIntoView();
  }, [tags]);

  // Main UI
  return (
    <div>
      <div
        ref={tagInputRef}
        onKeyDown={keyDownHandler}
        className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition"
      >
        {tags.map((t) => (
          <Tag onClick={() => removeTag(t)} key={t}>
            {t}
          </Tag>
        ))}
        <input
          id="tags"
          ref={input}
          type="text"
          placeholder="Tag One, Tag Two"
          className="flex-grow h-full bg-transparent outline-none dark:text-white text-primary "
          value={tag}
          onChange={tagInputHandler}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        />
      </div>
    </div>
  );
}

const Tag = ({ children, onClick }) => {
  return (
    <span className="dark:bg-white bg-primary dark:text-primary text-white flex items-center text-sm px-1 whitespace-nowrap">
      {children}
      <button type="button" onClick={onClick}>
        <AiOutlineClose size={12} />
      </button>
    </span>
  );
};
