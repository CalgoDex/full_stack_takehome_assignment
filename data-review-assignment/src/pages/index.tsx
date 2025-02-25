// pages/index.tsx

import DataReviewTable from "../components/DataReviewTable";
import DigitalRain from "../components/DigitalRain";

export default function Home() {
  return (
    <div className="data-visualizer-ctn col">
      <DigitalRain />
      <div className="mainDataviewer">
        <DataReviewTable />
      </div>
    </div>
  );
}
