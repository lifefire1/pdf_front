import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import PdfComp from "./PdfComp";
import Dictionary from "./Dictionary";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

function App() {
    const [pdfFile, setPdfFile] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null); // Добавлено для отслеживания количества страниц
    const [dictionaries, setDictionaries] = useState({});

    useEffect(() => {
        const storedDictionaries = localStorage.getItem("dictionaries");
        if (storedDictionaries) {
            setDictionaries(JSON.parse(storedDictionaries));
        }
    }, []);

    useEffect(() => {
        const loadPdf = () => {
            setPdfFile("/files/Gradle.pdf");
        };
        loadPdf();
    }, []);

    useEffect(() => {
        localStorage.setItem("dictionaries", JSON.stringify(dictionaries));
    }, [dictionaries]);

    const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
    const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));

    const updatePageNumber = (newPageNumber) => {
        setPageNumber(newPageNumber);
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


    const addWordToDictionary = (word, translation) => {
        setDictionaries((prevDictionaries) => ({
            ...prevDictionaries,
            [pageNumber]: [
                ...(prevDictionaries[pageNumber] || []),
                { word, translation }
            ]
        }));
    };

    return (
        <div className="App">
            <div className="pdf-container">
                <PdfComp
                    pdfFile={pdfFile}
                    scale={scale}
                    pageNumber={pageNumber}
                    setNumPages={setNumPages} // Добавлено для передачи количества страниц
                />
            </div>
            <div className="dictionary-container">
                <Dictionary
                    zoomIn={zoomIn}
                    zoomOut={zoomOut}
                    scale={scale}
                    words={dictionaries[pageNumber] || []}
                    addWord={addWordToDictionary}
                    goToNextPage={goToNextPage}
                    goToPreviousPage={goToPreviousPage}
                    pageNumber={pageNumber}
                    numPages={numPages}
                    updatePageNumber={updatePageNumber}
                />
            </div>
        </div>
    );
}

export default App;
