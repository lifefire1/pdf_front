import { Document, Page } from "react-pdf";
import { useEffect } from "react";

function PdfComp({ pdfFile, scale, pageNumber, setNumPages }) {
    useEffect(() => {
        setNumPages(null); // Сбрасываем количество страниц при смене документа
    }, [pdfFile]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages); // Передаем количество страниц в App.js
    };

    return (
        <div>
            {pdfFile && (
                <>
                    <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                    {/*<p>*/}
                    {/*    Page {pageNumber} of {numPages || "?"}*/}
                    {/*</p>*/}
                </>
            )}
        </div>
    );
}

export default PdfComp;
