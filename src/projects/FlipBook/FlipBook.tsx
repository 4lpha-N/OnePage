import HTMLFlipBook from "react-pageflip";
import "./FlipBook.scss";

function Book() {
  const pages = [
    { id: 1, content: "Page 1" },
    { id: 2, content: "Page 2" },
    { id: 3, content: "Page 3" },
    { id: 4, content: "Page 4" },
    { id: 5, content: "Page 5" },
    { id: 6, content: 'Page 6' },
    // { id: 7, content: 'Page 7' },
  ];

  const extraPages = pages.length % 2 === 0 ? 1 : 2;
  const innerPageIndex = extraPages === 2 ? 1 : 0; // Bei 2 extra Seiten ist die innere Seite die zweite
  const emptyPages = Array.from({ length: extraPages }, (_, i) => (
    <div className="page" key={`empty-page-${i}`}>
      <div className={'page-content' + (i === innerPageIndex ? ' inner' : '')}></div>
    </div>
  ));

  return (
    <HTMLFlipBook
      width={370}
      height={500}
      maxShadowOpacity={0.1}
      drawShadow={true}
      showCover={true}
      size="fixed"
      className="flip-book"
      startPage={0}
      minWidth={300}
      maxWidth={600}
      minHeight={400}
      maxHeight={800}
    //   minWidth={300}
    //   maxWidth={600}
    //   minHeight={400}
    //   maxHeight={800}
      autoSize={true}
      clickEventForward={true}
      useMouseEvents={true}
      swipeDistance={10}
      showPageCorners={false}
      style={{}}
      flippingTime={1000}
      usePortrait={false}
      startZIndex={0}
      mobileScrollSupport={true}
      disableFlipByClick={false}
    >
      <div className="page" style={{ backgroundColor: "crimson" }}>
        <div className="page-content cover">Titel</div>
      </div>
      <div className="page">
        <div className="page-content inner"></div>
      </div>

      {pages.map((page) => (
        <div className="page" key={page.id}>
          <div className="page-content">{page.content}</div>
        </div>
      ))}

      {emptyPages}

      <div className="page" style={{ backgroundColor: "crimson" }}>
        <div className="page-content cover"></div>
      </div>
    </HTMLFlipBook>
  );
}

export default Book;
