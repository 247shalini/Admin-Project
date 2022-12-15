const PageLoader = () => {
  return (
    <>
      {" "}
      <div className="main-loader-page pageloader">
        <div className="loader">
          <svg className="circular">
            <circle
              className="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default PageLoader;
