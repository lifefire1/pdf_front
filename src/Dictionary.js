import React, { useState } from "react";

function Dictionary({ zoomIn, zoomOut, scale, words, addWord, pageNumber, updatePageNumber, numPages }) {
    const [newWord,setNewWord] = useState("");
    const [translation, setTranslation] = useState("");

    const handleAddWord = () => {
        let word = newWord;
        let translatedWord  = translation;
        let page = pageNumber;
        let title = "Gradle.pdf"
        let xhr = new XMLHttpRequest();
        let url = "localhost:8080/word"
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({"word": word, "translation": translatedWord, "pageNumber": page, "title": title});
        xhr.send(data);
        setNewWord("");
        setTranslation("");


    };

    const goToPreviousPage = () => {
        if (pageNumber > 1) {
            updatePageNumber(pageNumber - 1);
        }
    };

    const goToNextPage = () => {
        if (pageNumber < numPages) {
            updatePageNumber(pageNumber + 1);
        }
    };

    return (
        <div className="dictionary">
            <h2>Dictionary</h2>

            <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Add new word"
            />
            <input
                type="text"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder="Translation"
            />
            <button className="add" onClick={handleAddWord}>Add</button>

            <ul>
                {words.map((entry, index) => (
                    <li key={index}>
                        {entry.word} - {entry.translation}
                    </li>
                ))}
            </ul>

            <div className="zoom-controls">
                <button onClick={zoomOut} disabled={scale <= 0.5}>
                    Zoom Out
                </button>
                <button onClick={zoomIn} disabled={scale >= 2.0}>
                    Zoom In
                </button>
            </div>

            <div className="page-controls">
                <button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
                    Previous
                </button>
                <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Dictionary;
