import { CircleLoader } from "react-spinners";

function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <CircleLoader color="#ff5a60" loading size={70} speedMultiplier={1} />
    </div>
  );
}

export default Loading;
