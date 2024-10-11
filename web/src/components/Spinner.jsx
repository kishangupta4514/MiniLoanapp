import { SpinnerCircular } from "spinners-react";

export default function Spinner() {
  return (
    <div className="absolute ml-[260px] right-[43%] bottom-[55%]  transform translate-x-[95%] translate-y-[80%] z-50">
      <SpinnerCircular />
    </div>
  );
}
