"use client";

// データが存在しないときの画面
const NotFound = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
      className="flex-center"
    >
      <p>404</p>
      <p>｜</p>
      <p>ページが存在しません</p>
    </div>
  );
};

export default NotFound;
