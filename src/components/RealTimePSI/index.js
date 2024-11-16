import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as styles from "./style.scss";

const translations = {
  en: {
    pollutionOverview: "Pollution Overview",
    currentStatus: "Current Status",
    maxPSIOfPastHour: "Max PSI of Past Hour",
    national: "National",
    east: "East",
    south: "South",
    west: "West",
    north: "North",
    central: "Central",
  },
  ms: {
    pollutionOverview: "Gambaran Pollutasi",
    currentStatus: "Status Semasa",
    maxPSIOfPastHour: "PSI Maksimum Dalam Jam Terkini",
    national: "Nasional",
    east: "Timur",
    south: "Selatan",
    west: "Barat",
    north: "Utara",
    central: "Pusat",
  },
  zh: {
    pollutionOverview: "污染概况",
    currentStatus: "当前状态",
    maxPSIOfPastHour: "过去一小时最大PSI",
    national: "全国",
    east: "东部",
    south: "南部",
    west: "西部",
    north: "北部",
    central: "中部",
  },
  tm: {
    pollutionOverview: "படிமாசார நிலவரம்",
    currentStatus: "தற்போதைய நிலை",
    maxPSIOfPastHour: "கடந்த மணிநேரத்தில் அதிகபட்ச PSI",
    national: "தேசிய",
    east: "கிழக்கு",
    south: "தெற்கு",
    west: "மேற்கு",
    north: "வடக்கு",
    central: "மத்திய",
  },
};


const RealTimePSI = (props) => {
  const { psi, language } = props;

  const t = translations[language.language] || translations.en;

  const status = psi && psi.status;
  const hourly = psi && psi.hourly;
  const { national, west, east, central, south, north } = hourly || {};

  return (
    <div className={styles.container}>
      <div>
        <strong>{t.pollutionOverview}</strong>
      </div>
      <div>
        {t.currentStatus}:{" "}
        <span style={{ color: "crimson" }}>
          <strong>{status}</strong>
        </span>
      </div>
      <div>
        <strong>{t.maxPSIOfPastHour}</strong>
      </div>
      <div>
        {t.national}: <strong>{national}</strong>
      </div>
      <div>
        {t.east}: <strong>{east}</strong>
      </div>
      <div>
        {t.south}: <strong>{south}</strong>
      </div>
      <div>
        {t.west}: <strong>{west}</strong>
      </div>
      <div>
        {t.north}: <strong>{north}</strong>
      </div>
      <div>
        {t.central}: <strong>{central}</strong>
      </div>
    </div>
  );
};

RealTimePSI.propTypes = {
  psi: PropTypes.object,
  language: PropTypes.string,
};

const mapStateToProps = (state) => {
  const { common } = state;
  return {
    psi: common && common.psi,
    language: state.language,
  };
};

export default connect(mapStateToProps)(RealTimePSI);
