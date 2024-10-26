import React, { useState, useEffect } from "react";

function Dictionary({ zoomIn, zoomOut, scale, pageNumber, updatePageNumber, numPages }) {
    const [newWord, setNewWord] = useState("");
    const [translation, setTranslation] = useState("");
    const [words, setWords] = useState([]);
    const title = "Gradle.pdf"; // Или другой нужный title

    // Функция для получения слов с сервера
    const fetchWords = () => {
        fetch(`http://192.168.0.20:8080/page/${pageNumber}/title/${title}`)
            .then(response => response.json())
            .then(data => {
                setWords(data);
                console.log("Полученные слова:", data);
            })
            .catch(error => console.error("Ошибка при получении слов:", error));
    };

    // Вызываем fetchWords при изменении pageNumber или title
    useEffect(() => {
        fetchWords();
    }, [pageNumber, title]);

    const handleAddWord = () => {
        const word = newWord.trim();
        const translatedWord = translation.trim();

        if (!word || !translatedWord) {
            console.warn("Поля для добавления слова и перевода не должны быть пустыми");
            return;
        }

        fetch("http://192.168.0.20:8080/word", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                word: word,
                translation: translatedWord,
                pageNumber: pageNumber,
                title: title,
            }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка при добавлении слова");
                return response.text(); // Используем text() вместо json()
            })
            .then((message) => {
                console.log(message || "Word added successfully");
                fetchWords(); // Обновляем список слов после добавления
                setNewWord(""); // Очищаем поле слова
                setTranslation(""); // Очищаем поле перевода
            })
            .catch((error) => console.error("Ошибка:", error));
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
